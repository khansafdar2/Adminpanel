import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  loading: boolean = false;
  URLS = URLS;
  tags: string[] = [];
  customerForm = this.fb.group({
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    email: [""],
    phone: [""],
    notes: [""]
  });
  addressForm = this.fb.group({
    primary_address: [true],
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    company: [""],
    phone: [""],
    address: ["", [Validators.required]],
    apartment: [""],
    city: ["", [Validators.required]],
    country: ["", [Validators.required]],
    postal_code: ["", [Validators.required]]
  });

  onSubmit() {
    let customerData = this.customerForm.value;
    let addressData = this.addressForm.value;
    customerData.address = [addressData];
    customerData.tags = this.tags.join(',');
    this.loading = true;
    this.customersService.createCustomer(customerData).then(resp => {
      this.loading = false;
      if(resp.isAxiosError) {
        if(resp.response.status === 400) {
          if(resp.response.data.email) {
            this.snackBar.open("Email: " + resp.response.data.email, "", {duration: 3000});
          }
        }
      } else {
        if(resp) {
          this.snackBar.open("Customer created successfully.", "", {duration: 3000});
          this.router.navigate(['/', URLS.customers]);
        }
      }
    });
  }


  ngOnInit(): void {
  }

}
