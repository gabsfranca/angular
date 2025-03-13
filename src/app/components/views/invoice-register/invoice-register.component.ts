import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InputComponent } from '../../input/input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Invoice, InvoiceItem } from '../../../shared/models/invoice';
import { InvoiceService } from '../../../shared/services/invoice.service';
import { ProductsService } from '../../../shared/services/products.service';
import { Product } from '../../../shared/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-register',
  standalone: true,
  imports: [InputComponent, FormsModule, CommonModule],
  templateUrl: './invoice-register.component.html',
  styleUrls: ['./invoice-register.component.css']
})
export class InvoiceRegisterComponent implements OnInit {
  showProductsList: boolean = false;
  availableProducts: Product[] = [];
  invoiceTotal: number = 0;
  invoice: Invoice;

  constructor(
    private invoiceService: InvoiceService,
    private productsService: ProductsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.invoice = this.invoiceService.getDefaultInvoice();
   }

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
    this.invoice = this.invoiceService.addProductToInInvoice(product, this.invoice);
    this.calculateTotal();
  }

  getItemTotal(item: InvoiceItem): number {
    return this.invoiceService.getItemTotal(item);
  }

  removeProductFromInvoice(index: number): void {
    this.invoice = this.invoiceService.removeProductFromInvoice(index, this.invoice);
    this.calculateTotal();
  }

  isProductInInvoice(product: Product, invoice: Invoice): boolean{
    return this.invoiceService.isProductInInvoice(product, invoice)
  }

  calculateTotal(): void {
    this.invoiceTotal = this.invoiceService.calculateTotal(this.invoice);
  }

  isFormValid(): boolean {
    return this.invoiceService.isFormValid(this.invoice);
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
            errorMsg = `Estoque insuficiente para realizar a transação\n${this.invoice.status}`;
          }
          alert(errorMsg)
          console.error('erro criando nf: ', error);
          console.log('nf: ', this.invoice);
        }
      });
    }
    catch(e) {
      console.error('erro ao enviar nf: ', e)
    }
  }
  resetForm() {
    this.invoice = this.invoiceService.getDefaultInvoice();
  }
}