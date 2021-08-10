import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import URLS from 'src/app/shared/urls';


@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ) { }

  loading: boolean = false;
  URLS = URLS;
  lineitems = [];
  lineitemsForm = this.fb.group({
    lineitems: this.fb.array([])
  });

  onQtyKeydown(event: KeyboardEvent) {
    if(event.key === ".") {
      event.preventDefault();
    }
  }

  deleteLineItem(index) {
    (this.lineitemsForm.get('lineitems') as FormArray).removeAt(index);
  }

  onAddItems(items) {
    console.log(items);
    this.lineitems = this.lineitems.concat(items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      (this.lineitemsForm.get('lineitems') as FormArray).push(
        this.fb.group({
          id: item.variant.id,
          vendor_name: item.vendor_name,
          product_name: item.title,
          variant_title: item.variant.title,
          image: item.image,
          shipping: item.shipping,
          inventory_quantity: item.variant.inventory_quantity,
          qty: [1, [Validators.required, Validators.min(1), Validators.max(item.variant.inventory_quantity)]],
          price: item.variant.price,
          sku: item.variant.sku,
        })
      );
    }
  }

  ngOnInit(): void {
  }

}
