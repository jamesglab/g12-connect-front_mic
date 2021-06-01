import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';
import { Donation } from '../_models/donation.model';

@Injectable({
  providedIn: 'root'
})
export class G12eventsService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> { 
    return this.http.get<any>(`${environment.microservices.donations}/donations`, 
    { headers: header }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  getFilter(payload: any){
    return this.http.get<any>(`${environment.microservices.donations}/donations/filter`, 
    { headers: header, params: payload }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(handleError)
    );
  }

  create(data: Donation): Observable<any> { //DEFINE THE RESPONSE
    return this.http.post<any>(
      `${environment.microservices.donations}/donations`,
      data, { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  update(){}

  delete(){}

}
