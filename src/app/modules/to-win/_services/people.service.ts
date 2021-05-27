import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { Response } from '../../auth/_models/auth.model';
import { Person } from '../_models/people.model';
import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  getZone(idSede: number): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Parameterization/Zone/Get`, JSON.stringify({ idSede }), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  searchPerson(data: {
    Filter: string, IdWin?: number, DocumentType?: string,
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

  insertPerson(data: Person): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Win/AddMciWin`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updatePerson(data: Person): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}Win/EditMciWin`, JSON.stringify(data), { headers: header }).pipe(
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
