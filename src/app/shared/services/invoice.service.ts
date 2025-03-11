import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  createInvoice(i: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, i);
  }

}
