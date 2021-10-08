import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Response } from '../auth/_models/auth.model';
import { handleError, header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // getUserInfo(data: { idUser: number }): Observable<Response> {
  //   return this.http.post<Response>(
  //     `${environment.apiUrl}User/Get`, JSON.stringify(data), { headers: header }).pipe(
  //       map((res: Response) => {
  //         return res;
  //       }),
  //       catchError((err) => { console.error('err', err); return of(undefined); })
  //     );
  // }

  changePassword(data: { idUser: number, oldPassword: string, newPassword: string }): Observable<Response> {
    return this.http.post<Response>(
      `${environment.apiUrl}User/ChangePassword`, JSON.stringify(data), { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((err) => { console.error('err', err); return of(undefined); })
      );
  }


  // ENDPOINTS TO MINISTERIAL INFO

  getPlaces(filter: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/church/filter`, {
        headers: header,
        params: filter,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getProfile() {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/detail`, {
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  updateProfile(body) {
    return this.http.put<Response>(
      `${environment.apiUrlG12Connect.users}`, body, { headers: header, }).pipe(
        map((res: Response) => {
          return res;
        }),
      );
  }

  getMinisterialTeamG12() {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/g12-team`, {
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }


  getMinistry(params) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/ministry`, { params }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getLeadersOrPastors(params: {
    userCode: string;
    church: string;
  }): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/pastor`, {
        params,
        headers: header,
      })
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  finOne(params): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/find-one`, {
        params,
        headers: header,
      })
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  updateUserByPastor(user) {
    return this.http
      .put<any>(`${environment.apiUrlG12Connect.users}/update`, user, {
        headers: header,
      })
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  filterMinistry(params){
    return this.http
    .get<any>(`${environment.apiUrlG12Connect.users}/filter-ministry`, {
      params,
    })
    .pipe(
      map((res: Response) => {
        return res;
      }),
      catchError(handleError)
    );
  }
}
