import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputComponent } from '../../input/input.component';
import { Product } from '../../../shared/models/product';
import { ProductsService } from '../../../shared/services/products.service';


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

  constructor(private productsService: ProductsService) { }

  onSubmit() {
    this.product.price = Number(this.product.price)

    const productToSend: Partial<Product> = {...this.product}
    delete productToSend.id;
    
    this.productsService.createProduct(productToSend as Product).subscribe({
      next: (createdProduct) => {
        console.log('Produto criado!!! ', createdProduct);
        this.resetForm();
      },
      error: (error) => {
        console.error('erro criando produto: ', error);
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
}


