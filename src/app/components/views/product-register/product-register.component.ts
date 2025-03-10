import { Component } from '@angular/core';
import { InputComponent } from '../../input/input.component';
import { Product } from '../../../shared/models/product';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-register',
  imports: [InputComponent, FormsModule],
  templateUrl: './product-register.component.html',
  styleUrl: './product-register.component.css'
})
export class ProductRegisterComponent {
  product: Partial<Product> = {
      serialNumber: '',
      name: '',
      desc: '',
      price: 0, 
      quantity: 0
    };

  onSubmit() {
    this.product['serialNumber'] = this.product.serialNumber;
    this.product['name'] = this.product.name;
    this.product['desc'] = this.product.desc;
    this.product['price'] = this.product.price;

    console.log('produto cadastrado: ', this.product);
  }
}


