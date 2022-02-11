import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { StorageService } from 'src/app/modules/auth/_services/storage.service';

import { Response } from '../../auth/_models/auth.model';
import { Object, ObjectType } from '../_models/object.model';

import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminObjectsService {

  constructor(private http: HttpClient, private _storageService: StorageService) { }

  getObjects(query: any): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect.managment}/data-dictionary/filter`, { headers: header, 
      params: query }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createObject(object: Object): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrlG12Connect.managment}/data-dictionary`, JSON.stringify(object), { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  editObject(object: Object): Observable<any> { //BURNED
    return this.http.post<any>(
      `${environment.apiUrlG12Connect.managment}/data-dictionary`, JSON.stringify(object), { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  deleteObject(object: { key: string, platform: string }): Observable<any> { //BURNED
    return this.http.put<any>(
      `${environment.apiUrlG12Connect.managment}/data-dictionary/object-role`, JSON.stringify(object), { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

}
