import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  constructor(private http: HttpClient) {}

  findBoxByUser() {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.paymentsv3}/box/my-box  `)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  registerOneUser(payload) {
    return this.http
      .post<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/box/payment`,
        payload,
        {}
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getTransactionsByBox(box_id) {
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

  filterTransaction(params) {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/box/filter_transactions`,
        {
          params,
        }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  filterTransactionByReference(params) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.paymentsv3}/box/by-reference`, {
        params,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getGrupalTransactionsBox(payment_ref, assistant) {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/boxes/grupal_transactions-box`,
        {
          params: { payment_ref, assistant },
        }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  updateTransactions(payload) {
    return this.http
      .put<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/box/validate`,
        payload
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  cancelTransaction(payload) {
    return this.http
      .put<any>(
        `${environment.apiUrlG12Connect.paymentsv3}/box/cancel-payment`,
        payload
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
}
