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
  constructor(private productService: ProductsService, public dialog: MatDialog) {
  }

  products!: IProducts[];
  productsSubscription!: Subscription;
  basket!: IProducts[];
  basketSubscription!: Subscription;
  canEdit: boolean = false;
  canView: boolean = false;

  ngOnInit(): void {
    this.canEdit = true;

    this.productsSubscription = this.productService.getProducts().subscribe((data) => {
      this.products = data;
    })

    this.basketSubscription = this.productService.getProductFromBasket().subscribe((data) => {
      this.basket = data;
    })
  }

  openDialog(product?: IProducts): void {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    dialogConfig.data = product

    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
     if (data) {
       if (data && data.id)
         this.updateData(data)
       else
         this.postData(data)
     }
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
    if (this.basketSubscription) this.basketSubscription.unsubscribe();

  }

  deleteItem(id: number) {
    this.productService.deleteProduct(id).subscribe(() => this.products.find((item) => {
      if (id === item.id) {
        let idx = this.products.findIndex((item) => item.id === id)
        this.products.splice(idx, 1)
      }
    }))
  }

  addToBasket(product: IProducts) {
    product.quantity = 1;

    let findItem;
    if(this.basket.length > 0) {
     findItem = this.basket.find((item) => item.id === product.id)
      if (findItem) this.updateToBasket(findItem)
      else this.postToBasket(product)
    } else this.postToBasket(product)
   }

  postToBasket(product: IProducts) {
    this.productService.postProductToBasket(product).subscribe((data) => {
      this.basket.push(data)
    })
  }

  updateToBasket(product: IProducts) {
    product.quantity += 1
    this.productService.updateProductToBasket(product).subscribe((data) => {
      console.log(data);})
  }
}
