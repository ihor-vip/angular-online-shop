import {Component, OnInit} from '@angular/core';
import {IProducts} from "../models/products";
import {Subscription} from "rxjs";
import {ProductsService} from "../../services/products.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogBoxComponent} from "../dialog-box/dialog-box.component";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products!: IProducts[];
  productsSubscription!: Subscription;
  canEdit: boolean = false;
  canView: boolean = false;

  constructor(private productService: ProductsService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.canEdit = true;

    this.productsSubscription = this.productService.getProducts().subscribe((data) => {
      this.products = data;
    })
  }

  openDialog(product?: IProducts): void {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    dialogConfig.data = product

    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.id)
        this.updateData(data)
       else
        this.postData(data)

    })
  }

  postData(data: IProducts) {
    this.productService.postProduct(data).subscribe((data) => this.products.push(data));
  }

  updateData(product: IProducts) {
    this.productService.updateProduct(product).subscribe((data) => {
      this.products = this.products.map((product) => {
        if (product.id === data.id) return data;
        else return product
      })
    });
  }

  ngOnDestroy() {
    if (this.productsSubscription) this.productsSubscription.unsubscribe();
  }

  deleteItem(id: number) {
    this.productService.deleteProduct(id).subscribe(() => this.products.find((item) => {
      if (id === item.id) {
        let idx = this.products.findIndex((item) => item.id === id)
        this.products.splice(idx, 1)
      }
    }))
  }
}
