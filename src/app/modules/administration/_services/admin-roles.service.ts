import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';

import { Response } from '../../auth/_models/auth.model';
import { Role, RoleObjects } from '../_models/role.model';

import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminRolesService {

  @Output() public reload: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private _storageService: StorageService) { }

  handleReload() {
    this.reload.emit(true);
  }

  getRoles(): Observable<any> {//BURNED
    return this.http.get<any>(
      `${environment.apiUrlG12Connect.users}/role`, { headers: header, params: {/* platform: 'conexion12'*/ } }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getRoleObjects(roleId: number): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListRolObject/${roleId}`, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createRole(role: Role): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrlG12Connect.users}/role`, role, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createRoleObjects(payload: RoleObjects) {//BURNED
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect.users}/role/permissions`, payload,
      { headers: header, params: { id: payload.id.toString() } }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  editRole(role: Role): Observable<any> { //BURNED
    return this.http.put<any>(
      `${environment.apiUrlG12Connect.users}/role`, role, { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }


  getPermissions() {
    return this.http.get<Response>(
      `${environment.apiUrlG12Connect.users}/permission`, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  ceratePermission(permission) {
    return this.http.post<Response>(
      `${environment.apiUrlG12Connect.users}/permission`, permission, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  updatePermission(payload) {
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect.users}/permission`, payload,
      { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getPermissionsByRole(params) {
    return this.http.get<Response>(
      `${environment.apiUrlG12Connect.users}/role/permissions`, { headers: header, params }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }


  getPermissionsActive() {
    return this.http.get<Response>(
      `${environment.apiUrlG12Connect.users}/permission/active`, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  addRolePermission(payload) {
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect.users}/role/add-permission`, payload,
      { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  removeRolePermission(payload) {
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect.users}/role/delete-permission`, payload,
      { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }
}
