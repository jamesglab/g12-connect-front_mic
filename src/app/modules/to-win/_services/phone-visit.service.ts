import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { Response } from '../../auth/_models/auth.model';
import { NewPhoneVisit } from '../_models/phone-visit.model';
import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhoneVisitService {

  constructor(private http: HttpClient) { }

  getBoardData(idUser: number): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}PhoneVisit/ReportPhoneBoardVisit`, JSON.stringify({ idUser }), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPhoneVisitData(data: {
    StartDateWin: string,
    EndDateWin: string,
    IdLeader: number,
    IdZone?: number,
    Call?: string,
    Visited?: string
  }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}PhoneVisit/GetPhoneVisit`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPhoneVisitResults(): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}PhoneVisit/GetResultPhoneVisit`, JSON.stringify({}), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  addPhoneVisit(data: NewPhoneVisit): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}PhoneVisit/AddPhoneVisit`, JSON.stringify(data), { headers: header }).pipe(
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
