import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Response } from '../../auth/_models/auth.model';
import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToWinReportsService {

  constructor(private http: HttpClient) { }

  getMainReport(data: { IdAccess: number, 
    StartDateWin: string, EndDateWin: string, IdLeader?: number }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}ReportWin/GetMainReport`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getViewDetail(data: { IdLeader: number, StartDateWin: string, EndDateWin: string }): 
  Observable<Response>{
    return this.http.post<Response>(
      `${environment.apiUrl}ReportWin/GetViewDetailed`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getDownloadDetail(data: { IdLeader: number, StartDateWin: string, EndDateWin: string }): Observable<Response>{
    return this.http.post<Response>(
      `${environment.apiUrl}ReportWin/GetDownLoadDetailed`, JSON.stringify(data), { headers: header }).pipe(
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
