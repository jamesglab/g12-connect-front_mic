import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { Response } from '../auth/_models/auth.model';
import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }

  getDocumentTypes(): Observable<Response> {
    /////////////OLD
    //Master/Detail
    //{ country: 48, master: 1 }
    ///////////// NEW
    //MasterDetail/Get
    //{ CodeMaster: "T1", IdCountry: 48 }

    return this.http.post<Response>(
      `${environment.apiUrl}MasterDetail/Get`, JSON.stringify({ CodeMaster: "T1", IdCountry: 48 }), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPersonTypes(): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Master/Detail`, JSON.stringify({ country: 240, master: 25 }), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  searchPerson(data: {
    Filter: string, IdWin?: number, DocumentType?: number,
    DocumentNumber?: string, Email?: string, Phone?: string
  }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Win/GetMciWin`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCivilStatus(): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}MasterDetail/Get`, JSON.stringify({ CodeMaster: "T3", IdCountry: 240 }), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getMeetings(idSede: number): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Meeting/Get`, JSON.stringify({ idSede }), { headers: header }).pipe(
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
