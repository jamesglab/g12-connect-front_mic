import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { Response } from '../../auth/_models/auth.model';

import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  public isLoading$: boolean;

  constructor(private http: HttpClient) {
    this.isLoading$ = false;
  }

  getTracingLeaderGO(data: { idUser: number, idLeader: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}api/ReportSend/ReportLeaderGo`, JSON.stringify(data),
      { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getReportStatusGO(data: { idUser: number, IdLeader: number, State: boolean }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}api/ReportSend/ReportStatusCell`, JSON.stringify(data),
      { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getReportConsolidated(data: { idUser: number, year: number, month: number, week: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}api/ReportSend/Reportconsolidated`, JSON.stringify(data),
      { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getReportAssistants(data: { idAcceso: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}api/ReportSend/ReportConsolidatedAssitant`, JSON.stringify(data),
      { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getReportCells(data: { IdAcceso: number }): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}api/ReportSend/ReportConsolidatedCell`, 
    JSON.stringify(data),
      { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getReportNational(data: { Red: string }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}api/ReportSend/ReportConsolidatedNational`, JSON.stringify(data),
      { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
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
