import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  createProduct(p: Product): Observable<Product> {
    console.log('mandando produto: ', p)
    return this.http.post<Product>(`${this.apiUrl}/products`, p);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(p: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${p.id}`, p);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
