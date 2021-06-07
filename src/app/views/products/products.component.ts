import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor() { }

  loading: boolean = false;
  URLS = URLS;
  products = [
    {
      id: 1,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 2,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 3,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 4,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    },
    {
      id: 5,
      image_src: "https://demo.saleor.io/media/__sized__/products/saleordemoproduct_fd_juice_06-thumbnail-255x255.png",
      name: "Orange juice",
      status: "Active",
      inventory: "265 in stock for 4 variants",
      vendor: "Juice Corner",
      type: "Configurable",
      price: "$225"
    }
  ]
  displayedColumns: Column[] = [
    {
      title: "",
      selector: "image_src",
      cell: row => `<img src="${row.image_src}" class="table-row-thumbnail" />`,
      width: "50px"
    },
    {
      title: "Name",
      selector: "name",
    },
    {
      title: "Status",
      selector: "status",
    },
    {
      title: "Inventory",
      selector: "inventory",
    },
    {
      title: "Vendor",
      selector: "vendor",
    },
    {
      title: "Type",
      selector: "type",
    },
    {
      title: "Price",
      selector: "price",
    },
  ]
  productSelection: SelectionModel<[]>;
  productFilters = [
    {
      title: "Status",
      values: ["Active", "Inactive"]
    }
  ]

  ngOnInit(): void {
  }

}
