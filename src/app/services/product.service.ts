import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5210/api/Product';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Failed to fetch product ${id}:`, error);
          return throwError(() => new Error(`Failed to fetch product. ${error.status === 404 ? 'Product not found' : ''}`));
        })
      );
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Failed to create product:', error);
          return throwError(() => new Error(`Creation failed. ${error.status === 400 ? 'Invalid data' : ''}`));
        })
      );
  }

  update(id: number, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Failed to update product ${id}:`, error);
          return throwError(() => new Error(`Update failed. ${error.status === 404 ? 'Product not found' : ''}`));
        })
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Failed to delete product ${id}:`, error);
          return throwError(() => new Error(`Deletion failed. ${error.status === 404 ? 'Product not found' : ''}`));
        })
      );
  }
}