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

//ENVIAMOS EL VALOR DE RECARGAR EN LOS DIFERENTES COMPONENTES QUE USEN EL OUTPUT DE RELOAD
  handleReload(){ this.reload.emit(true); }


  getUsers(): Observable<any> { //BURNED
    return this.http.get<any>(
      `${environment.apiUrlG12Connect.users}/filter`, { headers: header, 
      params: this.filter }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }


  getUserRoles(userId: number): Observable<Response> {
    return this.http.get<Response>(
      `${environment.apiUrlG12Connect.users}/roles`, 
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
      `${environment.apiUrlG12Connect.users}/add-role`, payload, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  editUser(user: User): Observable<Response> {
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect.users}`, user, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }
  
  deleteUserRole(payload: { user: number, role: number }) { //BURNED
    return this.http.put<any>(
      `${environment.apiUrlG12Connect.users}/delete-role`, payload, { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

}
