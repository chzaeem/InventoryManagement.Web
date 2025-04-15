import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list.component';
import { ProductAddEditComponent } from './components/product-add-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products', component: ProductListComponent },
    { path: 'products/add', component: ProductAddEditComponent },
    { path: 'products/edit/:id', component: ProductAddEditComponent },
  ];