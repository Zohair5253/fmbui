import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/User';
import { apiBaseUrl } from '../appConfig';
import { ApiResponse } from '../models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }

   httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
   public get currentUserValue(): User {
    return this.currentUserSubject.value;
}

login(username: string, password: string): Observable<ApiResponse> {
  const url = `${apiBaseUrl}/login`;
    return this.http
    .post<ApiResponse>(url, { username, password },this.httpOptions)
        .pipe(map(res => {
            // login successful if there's a jwt token in the response
            if (res.response && res.response.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                var user = res.response;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }

            return res;
        }));
}

logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
}
}
