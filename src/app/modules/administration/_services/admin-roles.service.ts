import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';

import { Response } from '../../auth/_models/auth.model';
import { Role, RoleObjects } from '../_models/role.model';

import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminRolesService {

  constructor(private http: HttpClient, private _storageService: StorageService) { }

  getHeader(): HttpHeaders {
    let token: string = this._storageService.getItem("user").token;
    let _header: HttpHeaders = header.append("Authorization", `Bearer ${token}`);
    return _header;
  }

  getRoles(): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListRol`, { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRoleObjects(roleId: number): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListRolObject/${roleId}`, { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createRole(role: Role): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/CreateRole`, JSON.stringify(role), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createRoleObjects(payload: RoleObjects) {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/CreateRolObject`, JSON.stringify(payload), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  editRole(role: Role): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/EditRole`, JSON.stringify(role), { headers: this.getHeader() }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteRole(role: { IdRole: number, UserModified: number }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/DeleteRole`, JSON.stringify(role), { headers: this.getHeader() }).pipe(
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
