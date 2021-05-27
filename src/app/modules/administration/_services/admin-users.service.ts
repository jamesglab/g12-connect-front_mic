import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';

import { Response } from '../../auth/_models/auth.model';
import { User, UserType, UserObjects } from '../_models/user.model';

import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(private http: HttpClient, private _storageService: StorageService) { }

  getHeader(): HttpHeaders {
    let token: string = this._storageService.getItem("user").token;
    let _header: HttpHeaders = header.append("Authorization", `Bearer ${token}`);
    return _header;
  }

  getUserTypes(): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListTypeUser`, { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createUserType(type: UserType): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/CreateTypeUser`, JSON.stringify(type), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  editUserType(type: UserType): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/EditTypeUser`, JSON.stringify(type), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteUserType(type: { IdTypeUser: number, UserModified: number }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/DeleteTypeUser`, JSON.stringify(type), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListUser`, { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getUserObjects(userId: number): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListUserObject/${userId}`, { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getUserRoles(userId: number): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListUserRol/${userId}`, { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createUser(user: User): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/CreateUser`, JSON.stringify(user), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createUserObjects(payload: UserObjects) {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/CreateUserObject`, JSON.stringify(payload), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createUserRole(payload: { User: number, Role: number, Available: boolean, UserCreation: number }){
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/AssignUserRole`, JSON.stringify(payload), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  editUser(user: User): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/EditUser`, JSON.stringify(user), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteUser(user: { IdUser: number, UserModified: number }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/DeleteUser`, JSON.stringify(user), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteUserRole(payload: { IdUser: number, IdRol: number; UserModified: number }) {
    //FALTA EL ID DEL ROL A ELIMINAR
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/DeleteUserRole`, JSON.stringify(payload), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      throw error.error.message;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(error);
  }
}
