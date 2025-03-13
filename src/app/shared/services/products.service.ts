import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:8080';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  product$ = this.productsSubject.asObservable()

  constructor(
    private http: HttpClient,
  ) { }


  createProduct(p: Product): Observable<Product> {
    console.log('mandando produto: ', p)
    return this.http.post<Product>(`${this.apiUrl}/products`, p);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  //regra d negócio
  reloadProducts(): void {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
      next: (products) => this.productsSubject.next(products),
      error: (error) => console.error('erro ao carregart produtos: ', error)
    });
  }

}
