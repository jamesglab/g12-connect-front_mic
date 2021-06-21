import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';

import { Response } from '../../auth/_models/auth.model';
import { Object, ObjectType } from '../_models/object.model';

import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminObjectsService {

  constructor(private http: HttpClient, private _storageService: StorageService) { }

  // getHeader(): HttpHeaders {
  //   let token: string = this._storageService.getItem("user").token;
  //   let _header: HttpHeaders = header.append("Authorization", `Bearer ${token}`);
  //   return _header;
  // }

  // getObjectTypes(): Observable<any> {
  //   return this.http.get<Response>(
  //     `${environment.apiUrl}Sso/ListTypeObject`, { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // createObjectType(objectType: ObjectType): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}Sso/CreateObjectType`, JSON.stringify(objectType), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // editObjectType(objectType: ObjectType): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}Sso/EditTypeObject`, JSON.stringify(objectType), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // deleteObjectType(objectType: ObjectType): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}Sso/DeleteTypeObject`, JSON.stringify(objectType), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  getObjects(): Observable<any> {
    return this.http.get<Response>(
      `${environment.apiUrl}Sso/ListObject`, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  createObject(object: Object): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrlG12Connect}managment/data-dictionary`, JSON.stringify(object), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  editObject(object: Object): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/EditObject`, JSON.stringify(object), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteObject(object: { IdObject: number, UserModified: number }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/DeleteObject`, JSON.stringify(object), { headers: header }).pipe(
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
