import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import URLS from 'src/app/shared/urls';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ) { }

  loading: boolean = false;
  URLS = URLS;
  customerForm = this.fb.group({
    first_name: [""],
    last_name: [""],
    email: [""],
    phone: [""],
    notes: [""]
  });
  addressForm = this.fb.group({
    primary: [true],
    first_name: [""],
    last_name: [""],
    company: [""],
    phone: [""],
    address: [""],
    apartment: [""],
    city: [""],
    country: [""],
    postal_code: [""]
  });


  ngOnInit(): void {
  }

}
