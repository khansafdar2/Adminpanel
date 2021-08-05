import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { CustomersService } from '../customers.service';


@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.customerID = this.activatedRoute.snapshot.paramMap.get('id');
  }

  loading: boolean = true;
  URLS = URLS;
  tags: string[] = [];
  customerID = null;
  customerForm = this.fb.group({
    id: [null],
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    email: [{
      value: "",
      disabled: true
    }],
    phone: [""],
    notes: [""],
    tags: [""],
    address: this.fb.array([])
  });

  addAddress(is_primary = false) {
    (this.customerForm.get('address') as FormArray).push(this.fb.group({
      primary_address: [{value: is_primary, disabled: is_primary}],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      company: [""],
      phone: [""],
      address: ["", [Validators.required]],
      apartment: [""],
      city: ["", [Validators.required]],
      country: ["", [Validators.required]],
      postal_code: ["", [Validators.required]]
    }));
  }

  getCustomerDetails() {
    this.loading = true;
    this.customersService.getCustomerDetail(this.customerID).then(resp => {
      this.loading = false;
      if(resp) {
        console.log(resp.data);
        this.tags = resp.data.tags ? resp.data.tags.split(","): [];
        for (let i = 0; i < resp.data.address.length; i++) {
          this.addAddress();
        }
        this.customerForm.patchValue(resp.data);
      }
    });
  }

  isDefaultChange(event) {

  }

  removeAddress(index) {
    (this.customerForm.get('address') as FormArray).removeAt(index);
  }

  onSubmit() {
    // let customerData = this.customerForm.value;
    // let addressData = this.addressForm.value;
    // customerData.address = [addressData];
    // customerData.notes = this.notes.join(',');
    // this.loading = true;
    // this.customersService.createCustomer(customerData).then(resp => {
    //   this.loading = false;
    //   this.snackBar.open("Customer created successfully.", "", {duration: 3000});
    //   this.router.navigate(['/', URLS.customers]);
    // });
  }

  ngOnInit(): void {
    this.getCustomerDetails();
  }

}
