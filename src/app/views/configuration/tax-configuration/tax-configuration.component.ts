import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLs from '../../../shared/urls';
import { TaxConfigurationService } from './tax-configuration.service';


@Component({
  selector: 'app-tax-configuration',
  templateUrl: './tax-configuration.component.html',
  styleUrls: ['./tax-configuration.component.scss']
})
export class TaxConfigurationComponent implements OnInit {

  constructor(
    private router: Router,
    private taxService: TaxConfigurationService,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar
  ) { }

  loading: boolean = true;
  taxForm = this.fb.group({
    id: [0],
    tax_name: ['', [Validators.required]],
    tax_percentage: [0, [Validators.required, Validators.pattern('[0-9]{1,2}[.]?[0-9]{1,2}?')]]
  });

  goBack() {
    this.router.navigate([URLs.configuration]);
  }

  getTaxInfo() {
    this.taxService.getTaxInfo().then(resp => {
      if(resp) {
        this.loading = false;
        if(resp.data.id) {
          this.taxForm.patchValue(resp.data);
        }
      }
    });
  }

  onTaxSave() {
      let data = this.taxForm.value;
      this.loading = true;
      if(data.id) {
        this.taxService.updateTaxInfo(data).then(resp => {
          if(resp) {
            this.loading = false;
            this.snackbarService.open("Tax settings updated.", "", {duration: 3000});
          }
        });
      } else {
        delete data.id;
        this.taxService.postTaxInfo(data).then(resp => {
          if(resp) {
            this.loading = false;
            this.snackbarService.open("Tax settings updated.", "", {duration: 3000});
          }
        });
      }
  }

  ngOnInit(): void {
    this.getTaxInfo();
  }

}
