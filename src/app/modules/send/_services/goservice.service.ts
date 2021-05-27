import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { Response } from '../../auth/_models/auth.model';
import { EditGo, NewGo, NewReportGo } from '../_models/go.model';
import { Assistant } from '../_models/assistant.model';

import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoService {

  public isLoading$: boolean;

  constructor(private http: HttpClient) {
    this.isLoading$ = false;
  }

  getGo(idUser: number): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}Go/List`, JSON.stringify({ idUser }), { headers: header }).pipe(
      map((res: Response) => {
        this.isLoading$ = false;
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getCellById(data: { IdUser: number, IdGo: number }): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}Go/Get`, JSON.stringify(data), { headers: header }).pipe(
      map((res: Response) => {
        this.isLoading$ = false;
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getGoTypes(): Observable<Response> {
    this.isLoading$ = true;
    return this.http.get<Response>(`${environment.apiUrl}Go/Type`, { headers: header }).pipe(
      map((res: Response) => {
        this.isLoading$ = false;
        return res;
      }),
      catchError((err) => { console.error('err', err); return of(undefined); }),
      finalize(() => this.isLoading$ = false)
    );
  }

  getAssistantsList(data: { id: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Member/List`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoading$ = false)
      );
  }

  // To see report of GO
  getDataReportByGo(data: { idGo: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}Go/ListGoLeaderReport`, JSON.stringify(data), { headers: header }).pipe(
      map((res: Response) => {
        this.isLoading$ = false;
        return res;
      }),
      catchError((err) => { console.error('err', err); return of(undefined); }),
      finalize(() => this.isLoading$ = false)
    );
  }

  insertGo(data: NewGo): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}Go/Add`, JSON.stringify(data), { headers: header }).pipe(
      map((res: Response) => {
        this.isLoading$ = false;
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

  insertReportOfGo(data: NewReportGo): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Go/AssistantReport`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertNewAssistantGo(data: Assistant): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Member/Create`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoading$ = false)
      );
  }

  updateGo(data: EditGo): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(`${environment.apiUrl}Go/Edit`, JSON.stringify(data), { headers: header }).pipe(
      map((res: Response) => {
        this.isLoading$ = false;
        return res;
      }),
      catchError(this.handleError)
    );
  }

  deleteGo(data: { IdCelula: number, MotivoCierre: string, IdUsuarioModificacion: number }):
    Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Go/Close`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoading$ = false)
      )
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
