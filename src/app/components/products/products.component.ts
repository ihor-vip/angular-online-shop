import {Component, OnInit} from '@angular/core';
import {IProducts} from "../models/products";
import {Subscription} from "rxjs";
import {ProductsService} from "../../services/products.service";

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

  constructor(private productService: ProductsService) {
  }
  ngOnInit(): void {
    this.canEdit = true;

    this.productsSubscription = this.productService.getProducts().subscribe((data) => {
      this.products = data;
    })
  }

  ngOnDestroy() {
    if (this.productsSubscription) this.productsSubscription.unsubscribe();
  }

}
