import { Routes } from '@angular/router';
import { ProductRegisterComponent } from './components/views/product-register/product-register.component';
import { InvoiceRegisterComponent } from './components/views/invoice-register/invoice-register.component';

export const routes: Routes = [
    {path: 'register-product', component: ProductRegisterComponent},
    {path: 'register-invoice', component: InvoiceRegisterComponent}
];
