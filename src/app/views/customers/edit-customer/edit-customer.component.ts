import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
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
      id: [null],
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
          this.addAddress(resp.data.address[i].primary_address);
        }
        this.customerForm.patchValue(resp.data);
      }
    });
  }

  isDefaultChange(event, index) {
    if(event.checked) {
      for (let i = 0; i < (this.customerForm.get('address') as FormArray).controls.length; i++) {
        const addressGroup = (this.customerForm.get('address') as FormArray).controls[i];
        if(i !== index) {
          if(addressGroup.get('primary_address').value) {
            addressGroup.get('primary_address').setValue(false);
            addressGroup.get('primary_address').enable();
          }
        } else {
          addressGroup.get('primary_address').disable();
        }
      }
    }
  }

  removeAddress(index) {
    const addressGroup = (this.customerForm.get('address') as FormArray).controls[index];
    let is_primary = addressGroup.get('primary_address').value;
    (this.customerForm.get('address') as FormArray).removeAt(index);
    if(is_primary) {
      (this.customerForm.get('address') as FormArray).controls[0].patchValue({
        primary_address: true
      });
    }
  }

  onSubmit() {
    let customerData = this.customerForm.getRawValue();
    customerData.tags = this.tags.join(',');
    this.loading = true;
    this.customersService.updateCustomer(customerData).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackBar.open("Customer updated successfully.", "", {duration: 3000});
        this.router.navigate(['/', URLS.customers]);
      }
    });
  }

  ngOnInit(): void {
    this.getCustomerDetails();
  }

}
