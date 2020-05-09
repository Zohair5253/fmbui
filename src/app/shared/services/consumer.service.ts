import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

import { Consumer } from '../models/Consumer';
import { ApiResponse } from '../models/ApiResponse';
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {

  constructor(
    private http: HttpClient
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

  getConsumers(): Observable<ApiResponse> {
    const url = this.baseUrl + "/GetConsumers";
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<ApiResponse>("getConsumers"))
    );
  }

  getConsumer(consumerId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetConsumerById?consumerIdentifier=${consumerId}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Fetched Consumer with ConsumerId = ${consumerId}`)),
      catchError(this.handleError<ApiResponse>(`getConsumer id= ${consumerId}`))
    );

  }

  updateConsumer(consumer:Consumer): Observable<ApiResponse> {
    const url = `${this.baseUrl}/UpdateConsumer`;
    return this.http
    .put<ApiResponse>(url,consumer,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated Consumer with ConsumerId ${consumer.consumerId}`)),
      catchError(this.handleError<any>('UpdateConsumer'))
    );
  }

  addConsumer(consumer: Consumer): Observable<ApiResponse>{
    const url = `${this.baseUrl}/CreateConsumer`;
    return this.http
    .post<ApiResponse>(url,consumer,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added consumer.`)),
      catchError(this.handleError<ApiResponse>('addConsumer'))
    );
  }


}
