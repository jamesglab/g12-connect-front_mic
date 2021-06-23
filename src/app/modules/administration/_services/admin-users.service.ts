import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';

import { Response } from '../../auth/_models/auth.model';
import { User, UserType, UserObjects } from '../_models/user.model';

import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  public filter: any = null;
  @Output() public reload: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private _storageService: StorageService) { }

  // getHeader(): HttpHeaders {
  //   let token: string = this._storageService.getItem("user").token;
  //   let _header: HttpHeaders = header.append("Authorization", `Bearer ${token}`);
  //   return _header;
  // }
  handleReload(){ this.reload.emit(true); }

  // getUserTypes(): Observable<Response> {
  //   return this.http.get<Response>(
  //     `${environment.apiUrl}Sso/ListTypeUser`, { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(handleError)
  //     );
  // }

  // createUserType(type: UserType): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}Sso/CreateTypeUser`, JSON.stringify(type), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(handleError)
  //     );
  // }

  // editUserType(type: UserType): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}Sso/EditTypeUser`, JSON.stringify(type), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(handleError)
  //     );
  // }

  // deleteUserType(type: { IdTypeUser: number, UserModified: number }): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}Sso/DeleteTypeUser`, JSON.stringify(type), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(handleError)
  //     );
  // }

  getUsers(): Observable<any> { //BURNED
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}users/user/filter`, { headers: header, 
      params: this.filter }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  // getUserObjects(userId: number): Observable<Response> {
  //   return this.http.get<Response>(
  //     `${environment.apiUrl}Sso/ListUserObject/${userId}`, { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(handleError)
  //     );
  // }

  getUserRoles(userId: number): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrlG12Connect}users/user/roles`, 
      { headers: header, params: { id: userId.toString() } }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createUser(user: User): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/CreateUser`, JSON.stringify(user), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createUserObjects(payload: UserObjects) {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/CreateUserObject`, JSON.stringify(payload), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createUserRole(payload: { user: number, role: number }){//BURNED
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect}users/user/add-role`, payload, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  editUser(user: User): Observable<Response> {
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect}users/user/`, user, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  // deleteUser(user: { IdUser: number, UserModified: number }): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}Sso/DeleteUser`, JSON.stringify(user), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(handleError)
  //     );
  // }

  deleteUserRole(payload: { user: number, role: number }) { //BURNED
    return this.http.put<any>(
      `${environment.apiUrlG12Connect}users/user/delete-role`, payload, { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

}
