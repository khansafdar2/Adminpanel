import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import URLS from 'src/app/shared/urls';
import { UsersService } from '../users.service';
import { Debounce } from 'src/app/shared/utils';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private usersService: UsersService, private snackbarService: MatSnackBar) { }

  email: any
  username: any
  loading: boolean = false;
  errorRespnse: any = ''
  errorResponseUserName: any = ''
  userName: string = ""
  userNameEmail: string = ''
  userForm = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required]]
  });

  sideDrawer: string = "";

  userPermissions = {
    dashboard: false,
    customization: false,
    theme: true,
    products: false,
    orders: false,
    customer: false,
    discounts: false,
    configuration: false,
    vendor: false,
    product_list: false,
    product_groups: false,
    collections: false,
    categories: false,
    brands: false,
    homepage: false,
    static_pages: false,
    header: false,
    footer: false,
    navigation: false,
    filters: false,
    main_discounts: false,
    coupons: false,
    store_setting: false,
    user_management: false,
    loyalty: false,
    shipping_regions: false,
    shipping_methods: false,
    checkout_setting: false,
    approvals: false,
    notifications: false

  }

  Urls = URLS;


  toggleDrawer(drawer) {
    this.sideDrawer = this.sideDrawer == drawer ? "" : drawer;

  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation();
  }

  goBack() {
    this.router.navigate([URLS.userManagement]);
  }

  onSubmit() {
    this.loading = true;
    let data = this.userForm.value;
    data.permissions = this.userPermissions;
    this.usersService.addUser(data)
      .then(resp => {
        this.loading = false;
        if (resp.isAxiosError) {
          if (resp.response.status === 400) {
            if (resp.response.data.email[0] === "This field must be unique.") {
              this.snackbarService.open("An account with this email address already exists.", "", { duration: 3000 });
            }
          }
        } else {
          if (resp) {
            this.loading = false;
            this.snackbarService.open('Invitation sent to user.', "", { duration: 3000 });
            this.goBack();
          }
        }
      }).catch(error => {
        console.log(error);
      })
  }

  checkEmail(email, username) {
    this.loading = true;
    this.usersService.checkEmailOrUsername(email, username)
      .then(resp => {
        let emailCheck = this.userForm.get("email").value;
        let username = this.userForm.get("username").value;
        if (emailCheck === '' || username === '') {
          this.errorRespnse = '';
        }
        this.loading = false;
        if (resp.status === 400) {
          this.errorRespnse = resp.data.detail;
        } else {
          this.userNameEmail = resp.data.username;
          if (this.userNameEmail) {
            this.userForm.patchValue({
              username: resp.data.username
            })
            this.userForm.controls.username.disable();
          } else {
            this.userForm.controls.username.enable();
          }
        }
        if (emailCheck === '') {
          this.userForm.controls.username.enable();
        }
      })
  }

  checkUsername(email, username) {
    this.loading = true;
    this.usersService.checkEmailOrUsername(email, username)
      .then(resp => {
        let email = this.userForm.get("email").value;
        let usernameCheck = this.userForm.get("username").value;
        if (email === '' || usernameCheck === '') {
          this.errorResponseUserName = '';
        }
        this.loading = false;
        if (resp.status === 400) {
          this.errorResponseUserName = resp.data.detail;
        } else {
          this.userName = resp.data.username;
          if (this.userName) {
            this.userForm.patchValue({
              username: resp.data.username
            })
            this.userForm.controls.username.disable();
          } else {
            this.userForm.controls.username.enable();
          }
        }
        if (email === '') {
          this.userForm.controls.username.enable();
        }
      })
  }

  checkAfterDebounceEmail = Debounce(() => {
    let email = this.userForm.get("email").value;
    let username = this.userForm.get("username").value;
    this.checkEmail(email, username = '');
  }, 500)

  checkAfterDebounceUsername = Debounce(() => {
    let email = this.userForm.get("email").value;
    let username = this.userForm.get("username").value;
    this.checkUsername(email = '', username);
  }, 500)


  customizationPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userPermissions.customization = true;
    } else if (!this.userPermissions.header && !this.userPermissions.footer && !this.userPermissions.homepage && 
      !this.userPermissions.static_pages && !this.userPermissions.navigation && !this.userPermissions.filters)
      this.userPermissions.customization = false;

  }

  customaizationCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userPermissions.header = true;
      this.userPermissions.footer = true;
      this.userPermissions.homepage = true;
      this.userPermissions.static_pages = true;
      this.userPermissions.navigation = true;
      this.userPermissions.filters = true;
    } else {
      this.userPermissions.header = false;
      this.userPermissions.footer = false;
      this.userPermissions.homepage = false;
      this.userPermissions.static_pages = false;
      this.userPermissions.navigation = false;
      this.userPermissions.filters = false;
    }
  }

  configurationPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userPermissions.configuration = true;
    } else if (!this.userPermissions.store_setting && !this.userPermissions.loyalty && !this.userPermissions.shipping_methods
       && !this.userPermissions.shipping_regions && !this.userPermissions.checkout_setting && !this.userPermissions.user_management) {
      this.userPermissions.configuration = false;
    }
  }


  configurationCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userPermissions.store_setting = true;
      this.userPermissions.loyalty = true;
      this.userPermissions.shipping_methods = true;
      this.userPermissions.shipping_regions = true;
      this.userPermissions.checkout_setting = true;
      this.userPermissions.user_management = true;
    } else {
      this.userPermissions.store_setting = false;
      this.userPermissions.loyalty = false;
      this.userPermissions.shipping_methods = false;
      this.userPermissions.shipping_regions = false;
      this.userPermissions.checkout_setting = false;
      this.userPermissions.user_management = false;
    }
  }

  productsPermissionCheck(event: MatCheckboxChange) {
    if (event.checked) {
      this.userPermissions.products = true;
    } else if (!this.userPermissions.product_list && !this.userPermissions.product_groups && !this.userPermissions.collections && 
      !this.userPermissions.categories && !this.userPermissions.brands) {
      this.userPermissions.products = false;

    }
  }

  productsCheck(event:MatCheckboxChange) {
      if (event.checked) {
        this.userPermissions.product_list = true;
        this.userPermissions.product_groups = true;
        this.userPermissions.collections = true;
        this.userPermissions.brands = true;
        this.userPermissions.categories = true;
      } else {
        this.userPermissions.product_groups = false;
        this.userPermissions.product_list = false;
        this.userPermissions.collections = false;
        this.userPermissions.brands = false;
        this.userPermissions.categories = false;
      }
  }


  discountPermissionCheck(event: MatCheckboxChange){
    if (event.checked) {
      this.userPermissions.discounts = true;
    } else if (!this.userPermissions.main_discounts && !this.userPermissions.coupons) {
      this.userPermissions.discounts = false;
    }
  }

  discountCheck(event:MatCheckboxChange) {
    if (event.checked) {
      this.userPermissions.main_discounts = true;
      this.userPermissions.coupons = true;
    } else {
      this.userPermissions.main_discounts = false;
      this.userPermissions.coupons = false;
    }
  }

  ngOnInit(): void {
  }

}
