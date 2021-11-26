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

  findBoxByUser(user) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.payments}/boxes/by-user`, {
        params: { user },
      })
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
        `${environment.apiUrlG12Connect.payments}/transaction/box-payment-one-user`,
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
      .get<any>(`${environment.apiUrlG12Connect.payments}/transaction/box`, {
        params: { box_id },
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
}
