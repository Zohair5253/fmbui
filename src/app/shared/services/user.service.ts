import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { ApiResponse } from '../models/ApiResponse';
import { User } from '../models/User';
import { apiBaseUrl } from '../appConfig';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  getUsers(): Observable<ApiResponse> {
    const url = this.baseUrl + "/GetUsers";
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`${_}`)),
      catchError(this.handleError<ApiResponse>("getUsers"))
    );
  }

  getUser(userId:string):Observable<ApiResponse> {
    const url = `${this.baseUrl}/GetUserById/${userId}`;
    return this.http
    .get<ApiResponse>(url)
    .pipe(
      tap(_ => this.log(`Fetched User with UserId = ${userId}`)),
      catchError(this.handleError<ApiResponse>(`getUser id= ${userId}`))
    );

  }

  updateUser(user:User): Observable<ApiResponse> {
    const url = `${this.baseUrl}/UpdateUser`;
    return this.http
    .put<ApiResponse>(url,user,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Updated User with UserId ${user.userId}`)),
      catchError(this.handleError<any>('UpdateUser'))
    );
  }

  addUser(user: User): Observable<ApiResponse>{
    const url = `${this.baseUrl}/CreateUser`;
    return this.http
    .post<ApiResponse>(url,user,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added user.`)),
      catchError(this.handleError<ApiResponse>('addUser'))
    );
  }
}
