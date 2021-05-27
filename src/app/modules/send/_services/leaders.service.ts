import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { Response } from '../../auth/_models/auth.model';
import { LeaderHost } from '../_models/leader.model';
import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  public isLoading$: boolean;

  constructor(private http: HttpClient) {
    this.isLoading$ = false;
  }

  getHostLeaders(data: { idUser: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Host/List`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoading$ = false)
      );
  }

  getHostLeadersX(data: { idLeader: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Host/ListXLeader`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }), catchError(this.handleError));
  }
 
  //PASTORS BY USER (LEADERSHIP)
  getLeaderShips(data: { idUser: number }) {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Leadership/List`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoading$ = false)
      );
  }

  //LEADERS BY PASTOR // WIN - ADD PERSON
  getLeaderByPastor(data: { Code: string, IdSede: number }): Observable<Response>{
    return this.http.post<Response>(
      `${environment.apiUrl}Leadership/ListXLeaderCode`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError),
      );
  }

  getLeaderShipByMinistry(data: { idUser: number, red: string }){
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Leadership/ListRed`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoading$ = false)
      );
  }

  //SEARCH LEADER ON WIN TABLE
  getHostLeader(data: { documentType: number, document: string, idUser: number }) {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Win/MciWin`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError),
      );
  }

  updateHostLeader(leader: LeaderHost): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Win/EditMciWin`, JSON.stringify(leader), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); }),
        finalize(() => this.isLoading$ = false)
      );
  }

  insertHostLeader(data: { idUser: number, ganarMCI: number }): Observable<Response> {
    this.isLoading$ = true;
    return this.http.post<Response>(
      `${environment.apiUrl}Host/Create`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          this.isLoading$ = false;
          return res;
        }),
        catchError(this.handleError),
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
