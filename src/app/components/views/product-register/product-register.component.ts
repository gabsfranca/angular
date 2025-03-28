import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputComponent } from '../../input/input.component';
import { Product } from '../../../shared/models/product';
import { ProductsService } from '../../../shared/services/products.service';
import { Invoice } from '../../../shared/models/invoice';
import { InvoiceService } from '../../../shared/services/invoice.service';


@Component({
  selector: 'app-product-register',
  standalone: true,
  imports: [InputComponent, FormsModule, CommonModule],
  templateUrl: './product-register.component.html',
  styleUrl: './product-register.component.css'
})
export class ProductRegisterComponent {
  product: Product = {
      serialNumber: '',
      name: '',
      description: '',
      price: 0, 
      currentStock: 0
    };

  invoice: Invoice;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private invoiceService: InvoiceService
  ) { this.invoice = this.invoiceService.getDefaultInvoice() }

  onSubmit() {
    this.product.price = Number(this.product.price)

    const productToSend: Partial<Product> = {...this.product}
    delete productToSend.id;
    
    this.productsService.createProduct(productToSend as Product).subscribe({
      next: (createdProduct) => {
        alert('Produto criado!!! ');
        console.log('produto criado: ', createdProduct);
        this.resetForm();
        this.navigateToInvoiceRegister();
      },
      error: (error) => {
        alert(`erro criando produto: ${error}`);
        console.log('produto: ', this.product)
      }
    });
  }

  resetForm() {
    this.product = {
      serialNumber: '',
      name: '',
      description: '', 
      price: 0,
      currentStock: 0
    };
  }

  isProductInInvoice(product: Product): boolean {
    return this.invoiceService.isProductInInvoice(product, this.invoice);
  }

  navigateToInvoiceRegister(): void {
    this.router.navigate(['/register-invoice']);
  }

}


