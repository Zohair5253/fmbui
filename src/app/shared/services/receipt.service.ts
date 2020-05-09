import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { ApiResponse } from '../models/ApiResponse';
import { Receipt } from '../models/Receipt';
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  constructor(
    private http: HttpClient,
    
  ) { }
  
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  private baseUrl = apiBaseUrl;

  private log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      
      this.log(`${operation} failed: ${error.message}`);
      
      return of(result as T);
    };
  }

  getReceipts(): Observable<ApiResponse> {
    const url = this.baseUrl + "/GetReceipts";
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<ApiResponse>("getReceipts"))
    );
  }

  getReceiptById(receiptId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetReceiptById/?receiptIdentifier=${receiptId}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Fetched Receipt with ReceiptId = ${receiptId}`)),
      catchError(this.handleError<ApiResponse>(`getReceipt id= ${receiptId}`))
    );

  }

  getReceiptByDate(startDate:string, endDate: string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetReceiptsByDate/?startDate=${startDate}&endDate=${endDate}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Fetched Receipt with startDate = ${startDate} and endDate = ${endDate}`)),
      catchError(this.handleError<ApiResponse>(`getReceiptByDate`))
    );

  }

  updateReceipt(receipt:Receipt): Observable<ApiResponse> {
    const url = `${this.baseUrl}/UpdateReceipt`;
    return this.http
    .put<ApiResponse>(url,receipt,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated Receipt with ReceiptId ${receipt.receiptId}`)),
      catchError(this.handleError<any>('UpdateReceipt'))
    );
  }

  addReceipt(receipt: Receipt): Observable<ApiResponse>{
    const url = `${this.baseUrl}/CreateReceipt`;
    return this.http
    .post<ApiResponse>(url,receipt,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added receipt.`)),
      catchError(this.handleError<ApiResponse>('addReceipt'))
    );
  }

  deleteReceipt(receiptId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/DeleteReceipt/?receiptIdentifier=${receiptId}`;
    return this.http
    .delete<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Deleted Receipt with ReceiptId = ${receiptId}`)),
      catchError(this.handleError<ApiResponse>(`Delete receipt id= ${receiptId}`))
    );

  }
  
}
