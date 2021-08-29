import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { header, handleError, headerFile } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DonationsServices {

  constructor(private http: HttpClient) { }


  getTransactionsReports(params) {
    if (!params.finish_date) {
      delete params.init_date;
      delete params.finish_date;
    }
    
    return this.http.get<any>(
      `${'https://d977-201-184-17-202.ngrok.io/api/v2/'}reports/list-reports-status`, { params, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }

  getTotalTransactions() {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/total-transactions`, { headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }

  getTotalValueTransactions(params) {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/total-value-transactions`, { params, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }

  getTotalTransactionsTypes(params) {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/total-transactions-type-donation`, { params, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }

  getTotalTransactionsGraph(params) {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/total-value-donations-graph`, { params, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }

  getTotalQuantityGraph(params) {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/total-quantity-donations-graph`, { params, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }

  getTransactionMethodPayment(params) {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/total-transaction-method-payment`, { params, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }

  getTotalValuesOrQuantity(filter) {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/total-value-or-quantity-donations`, { params: { filter }, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }


}
