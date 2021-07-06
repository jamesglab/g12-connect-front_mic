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


  /// query Mongo
  getTransactionsReports(params) {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}reports/reports/reportsMongo`, { params, headers: header }).pipe(
        map((res: Response) => {
          return res;
        }),
        catchError((handleError))
      );
  }
}
