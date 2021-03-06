import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class BoxService {

  constructor(private http: HttpClient) { }

  findBoxByUser(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.paymentsv3}/box/my-box`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  registerUsers(payload: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrlG12Connect.paymentsv3}/box/payment`, payload, {}).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getTransactionsByBox(box_id: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.paymentsv3}/transaction/box`, {
        params: { box_id },
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  filterTransaction(params: any): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/box/filter_transactions`,
        { params }
      ).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  filterTransactionByReference(params: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.paymentsv3}/box/by-reference`, {
        params
      }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getGrupalTransactionsBox(payment_ref: any, assistant: any): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/boxes/grupal_transactions-box`,
        { params: { payment_ref, assistant }, }
      ).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  updateTransactions(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/box/validate`,
        payload
      ).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  cancelTransaction(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/box/cancel-payment`,
        payload
      ).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getEventsBox(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.paymentsv3}/box/event`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  reportsMyBox(params: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/box/my`, {
        params,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  reportsAllBox(params: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/box/all`, {
        params,
      }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  reportsUsersBox(params: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/box/users-registers`, {
        params,
      }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  consolidatedReports(params: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/box/consolidated`, {
        params,
      }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
}
