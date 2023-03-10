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
export class ProductsComponent implements OnInit{
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

  openDialog(): void {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.width = '700px';
    const dialogRef = this.dialog.open(DialogBoxComponent, dialogConfig);
  }

  ngOnDestroy() {
    if (this.productsSubscription) this.productsSubscription.unsubscribe();
  }

}
