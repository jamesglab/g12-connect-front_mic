import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { handleError, headerFile } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  createEmailModule(payload) {
    return this.http
      .post<any>(`${environment.apiUrlG12Connect.managment}/email`, payload, {
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  updateEmail(payload) {
    return this.http
      .put<any>(`${environment.apiUrlG12Connect.managment}/email`, payload, {
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getEmailsModules() {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.managment}/email`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createEmailForEvent(payload) {
    return this.http
      .post<any>(
        `${environment.apiUrlG12Connect.managment}/email/for-event`,
        payload,
        {
          headers: headerFile,
        }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  updateEmailForEvent(payload) {
    return this.http
      .put<any>(`${environment.apiUrlG12Connect.managment}/email`, payload, {
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getEmailForEvent(event_id: string) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.managment}/email/filter-one`, {
        params: {
          event: event_id,
          status: '4',
        },
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
}
