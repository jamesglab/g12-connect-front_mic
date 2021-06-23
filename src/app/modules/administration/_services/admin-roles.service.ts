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

  // getHeader(): HttpHeaders {
  //   let token: string = this._storageService.getItem("user").token;
  //   let _header: HttpHeaders = header.append("Authorization", `Bearer ${token}`);
  //   return _header;
  // }
  handleReload(){ this.reload.emit(true); }

  getRoles(): Observable<any> {//BURNED
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}users/role/filter`, { headers: header, params: { platform: 'conexion12' } }).pipe(
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
      `${environment.apiUrl}Sso/CreateRole`, JSON.stringify(role), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createRoleObjects(payload: RoleObjects) {//BURNED
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect}users/role/permissions`, payload, 
      { headers: header, params: { id: payload.id.toString() } }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  editRole(role: Role): Observable<any> { //BURNED
    return this.http.put<any>(
      `${environment.apiUrlG12Connect}users/role`, role, { headers: header, params: { id: role.id.toString() } }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

}
