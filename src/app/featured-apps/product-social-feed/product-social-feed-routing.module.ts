import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ProductSocialFeedComponent } from './product-social-feed/product-social-feed.component';
import { CreateProductSocialFeedComponent } from './create-product-social-feed/create-product-social-feed.component';
import { EditProductSocialFeedComponent } from './edit-product-social-feed/edit-product-social-feed.component';




const routes: Routes = [
  {path: '', component:ProductSocialFeedComponent },
  {path: URLS.createProductSoclialFeed, component:CreateProductSocialFeedComponent },
  {path: URLS.edit + '/:id', component:EditProductSocialFeedComponent},
];

@NgModule({
  imports: [
  RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProductSoicalFeedRoutingModule { }
