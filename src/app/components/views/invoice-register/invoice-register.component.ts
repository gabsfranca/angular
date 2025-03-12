import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InputComponent } from '../../input/input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Invoice, InvoiceItem } from '../../../shared/models/invoice';
import { InvoiceService } from '../../../shared/services/invoice.service';
import { ProductsService } from '../../../shared/services/products.service';
import { Product } from '../../../shared/models/product';
import { ProductRegisterComponent } from "../product-register/product-register.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-register',
  standalone: true,
  imports: [InputComponent, FormsModule, CommonModule, ProductRegisterComponent],
  templateUrl: './invoice-register.component.html',
  styleUrl: './invoice-register.component.css'
})
export class InvoiceRegisterComponent implements OnInit {
  showProductsList: boolean = false;
  availableProducts: Product[] = [];
  invoiceTotal: number = 0;
  
  invoiceItem: InvoiceItem = {
    serialNumber: '',
    name: '', 
    price: 0,
    quantity: 1,
    discount: 0
  };

  invoice: Invoice = {
    nf: '',
    products: [],
    type: 'OUT' 
  };

  constructor(
    private invoiceService: InvoiceService,
    private productsService: ProductsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productsService.reloadProducts();

    this.productsService.product$.subscribe(products => {
      this.availableProducts = products;
      this.cdr.detectChanges();
    });
  }

  loadProducts(): void {
    this.showProductsList = !this.showProductsList;
    
    if (this.showProductsList && this.availableProducts.length === 0) {
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.availableProducts = products;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
        }
      });
    }
  }

  addProductToInvoice(product: Product): void {
    if (this.isProductInInvoice(product)) {
      return;
    }
    
  const newItem: InvoiceItem = {
      serialNumber: product.serialNumber,
      name: product.name, 
      price: product.price,
      quantity: 1,
      discount: 0,
    };
    
    this.invoice.products.push(newItem);
    this.calculateTotal();
  }

  removeProductFromInvoice(index: number): void {
    this.invoice.products.splice(index, 1);
    this.calculateTotal();
  }

  isProductInInvoice(product: Product): boolean {
    return this.invoice.products.some(item => item.serialNumber === product.serialNumber);
  }

  getItemTotal(item: InvoiceItem): number {
    const discountMultiplier = (100 - (item.discount || 0)) / 100;
    return item.price * item.quantity * discountMultiplier;
  }

  calculateTotal(): void {
    this.invoiceTotal = this.invoice.products.reduce((total, item) => {
      return total + this.getItemTotal(item);
    }, 0);
  }

  isFormValid(): boolean {
    return this.invoice.nf.trim() !== '' && 
           this.invoice.products.length > 0 && 
           (this.invoice.type === 'IN' || this.invoice.type === 'OUT');
  }

  navigateToProductRegister(): void {
    this.router.navigate(['/register-product']);
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    try {
      console.log('mandando... ', this.invoice)

      this.invoiceService.createInvoice(this.invoice).subscribe({
        next: (createdInvoice) => {
          console.log('nota fiscal criada: ', createdInvoice);
          alert(`Nota fiscal criada com sucesso!!\nStatus: ${createdInvoice.status}`)
          this.resetForm();
          this.productsService.reloadProducts();
        },
        error: (error) => {
          let errorMsg = `Erro ao criar nota fiscal, tente novamente...\nStatus: ${this.invoice.status}`
          if (error.error && error.error.includes('estoque insuficiente')) {
            errorMsg = 'Estoque insuficiente para realizar a transação';
          }
          alert(errorMsg)
          console.error('erro criando nf: ', error);
          console.log('nf: ', this.invoice);
        }
      })
    }
    catch(e) {
      console.error('erro ao enviar nf: ', e)
    }
  }
  resetForm() {
    this.invoice = {
      nf: '',
      products: [],
      type: 'OUT'
    };
  }
}