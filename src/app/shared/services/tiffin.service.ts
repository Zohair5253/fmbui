import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { ApiResponse } from '../models/ApiResponse';
import { Tiffin } from '../models/Tiffin';
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class TiffinService {

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

  getTiffins(): Observable<ApiResponse> {
    const url = this.baseUrl + "/GetTiffins";
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<ApiResponse>("getTiffins"))
    );
  }

  getTiffin(tiffinId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetTiffinById/${tiffinId}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Fetched Tiffin with TiffinId = ${tiffinId}`)),
      catchError(this.handleError<ApiResponse>(`getTiffin id= ${tiffinId}`))
    );

  }

  updateTiffin(tiffin:Tiffin): Observable<ApiResponse> {
    const url = `${this.baseUrl}/UpdateTiffin`;
    return this.http
    .put<ApiResponse>(url,tiffin,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated Tiffin with TiffinId ${tiffin.tiffinId}`)),
      catchError(this.handleError<any>('UpdateTiffin'))
    );
  }

  addTiffin(tiffin: Tiffin): Observable<ApiResponse>{
    const url = `${this.baseUrl}/CreateTiffin`;
    return this.http
    .post<ApiResponse>(url,tiffin,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added tiffin.`)),
      catchError(this.handleError<ApiResponse>('addTiffin'))
    );
  }

}
