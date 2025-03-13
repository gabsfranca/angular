import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice, InvoiceItem } from '../models/invoice';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:8081';

  constructor(
    private http: HttpClient,
  ) { }

  createInvoice(i: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, i);
  }

  getItemTotal(item: InvoiceItem): number {
    const discountMultiplier = (100 - (item.discount || 0)) / 100;
    return item.price * item.quantity * discountMultiplier;
  }

  getDefaultInvoice(): Invoice {
    return{
      nf: '', 
      products: [],
      type: 'OUT',
      status: "aberta"
    };
  }

  calculateTotal(invoice: Invoice): number {
    return invoice.products.reduce((total, item) => {
      const dicountMultiplier = (100 - (item.discount || 0)) / 100;
      return total + (item.price * item.quantity * dicountMultiplier);
    }, 0);
  }

  isProductInInvoice(product: Product, invoice: Invoice): boolean {
    return invoice.products.some(item => 
      item.serialNumber === product.serialNumber
    );
  }

  addProductToInInvoice(product: Product, invoice: Invoice): Invoice {
    if(this.isProductInInvoice(product, invoice)) return invoice;

    const newItem: InvoiceItem = {
      serialNumber: product.serialNumber, 
      name: product.name, 
      price: product.price, 
      quantity: 1,
      discount: 0
    };

    return {
      ...invoice, 
      products: [...invoice.products, newItem]
    };
  }

  removeProductFromInvoice(index: number, invoice: Invoice): Invoice {
    const newProducts = [...invoice.products];
    newProducts.splice(index, 1);
    return {...invoice, products: newProducts };
  }

  isFormValid(invoice: Invoice): boolean {
    return invoice.nf.trim() !== '' &&
              invoice.products.length > 0 &&
                ['IN', 'OUT'].includes(invoice.type);
  }
}
