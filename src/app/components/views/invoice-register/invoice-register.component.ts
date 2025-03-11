import { Component, OnInit } from '@angular/core';
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
  // Controla a exibição da lista de produtos
  showProductsList: boolean = false;
  
  // Termo de busca para filtrar produtos
  searchTerm: string = '';
  
  // Lista de produtos disponíveis
  availableProducts: Product[] = [];
  
  // Total da nota fiscal
  invoiceTotal: number = 0;
  
  // Modelo de item da nota
  invoiceItem: InvoiceItem = {
    serialNumber: '',
    name: '', // Adicionamos o campo name aqui
    price: 0,
    quantity: 1,
    discount: 0
  };

  // Modelo da nota fiscal - Agora incluindo o tipo
  invoice: Invoice = {
    nf: '',
    products: [],
    type: 'OUT' // Definindo 'OUT' (saída) como valor padrão
  };

  constructor(
    private invoiceService: InvoiceService,
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {

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

  // Filtra produtos baseado no termo de busca
  get filteredProducts(): Product[] {
    if (!this.searchTerm) {
      return this.availableProducts;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.availableProducts.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.serialNumber.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  }

  // Adiciona um produto à nota fiscal
  addProductToInvoice(product: Product): void {
    // Verificar se já temos este produto na nota
    if (this.isProductInInvoice(product)) {
      return;
    }
    
    // Criamos um novo item da nota baseado no produto
    const newItem: InvoiceItem = {
      serialNumber: product.serialNumber,
      name: product.name, // Agora incluímos o nome do produto
      price: product.price,
      quantity: 1,
      discount: 0,
    };
    
    this.invoice.products.push(newItem);
    this.calculateTotal();
  }

  // Remove um produto da nota fiscal
  removeProductFromInvoice(index: number): void {
    this.invoice.products.splice(index, 1);
    this.calculateTotal();
  }

  // Verifica se um produto já está na nota fiscal
  isProductInInvoice(product: Product): boolean {
    return this.invoice.products.some(item => item.serialNumber === product.serialNumber);
  }

  // Calcula o total de um item específico
  getItemTotal(item: InvoiceItem): number {
    const discountMultiplier = (100 - (item.discount || 0)) / 100;
    return item.price * item.quantity * discountMultiplier;
  }

  // Calcula o total da nota fiscal
  calculateTotal(): void {
    this.invoiceTotal = this.invoice.products.reduce((total, item) => {
      return total + this.getItemTotal(item);
    }, 0);
  }

  // Verifica se o formulário é válido para submissão
  isFormValid(): boolean {
    return this.invoice.nf.trim() !== '' && 
           this.invoice.products.length > 0 && 
           (this.invoice.type === 'IN' || this.invoice.type === 'OUT');
  }

  navigateToProductRegister(): void {
    this.router.navigate(['/register-product']);
  }

  // Submete a nota fiscal
  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }
    try {
      console.log('mandando... ', this.invoice)
      this.invoiceService.createInvoice(this.invoice).subscribe({
        next: (createdInvoice) => {
          console.log('nota fiscal criada: ', createdInvoice);
          this.resetForm();
        },
        error: (error) => {
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