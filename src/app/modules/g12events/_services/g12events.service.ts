import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  header,
  handleError,
  headerFile,
} from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';
import { sendDonation } from '../_models/donation.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class G12eventsService {
  constructor(private http: HttpClient) { }

  getTransactions(params?): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/transactions`, {
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

  sendEmail(data) {
    return this.http
      .post<any>(`${environment.apiUrlG12Connect.users}/send-email`, data, {
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
  getCities() {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/church/city`, {
        headers: header,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
  getTransactionsEvents(params?): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/transactions/event`, {
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

  getTransactionsEventsStatus(params?): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.reports}/transactions/event/status`,
        { params, headers: header }
      )
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createUserWithPaymentAdmin(data) {
    return this.http
      .post<any>(
        `${environment.apiUrlG12Connect.users}/create-donation`,
        data,
        { headers: headerFile }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getAll(params): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.donations}`, {
        headers: header,
        params,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getFilter(payload: any) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.donations}/filter`, {
        headers: header,
        params: payload,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getEventsMassive() {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.donations}/event-massive`, {
        headers: header
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getById(params) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.donations}/id`, {
        headers: header,
        params,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getOne() { }

  getFormData(data: sendDonation, uploadImage?): FormData {
    const send_data = new FormData();
    if (data.transaction_info.image && uploadImage) {
      send_data.append('image', data.transaction_info.image);
    }

    delete data.transaction_info.image;
    delete data.transaction_info.base64;
    send_data.append('donation', JSON.stringify(data));
    return send_data;
  }

  getFormUpdate(data: sendDonation, updoadImage): FormData {
    console.log('llego data')
    const send_data = new FormData();
    if (updoadImage) {
      send_data.append('image', data.transaction_info.image);
    }
    data.transaction_info.image = data.image;
    delete data.transaction_info.base64;
    send_data.append('donation', JSON.stringify(data));
    return send_data;
  }

  create(data: sendDonation): Observable<any> {
    console.log('evento creado', data);
    //DEFINE THE RESPONSE
    data.transaction_info.init_date = moment(data.transaction_info.init_date);
    data.transaction_info.finish_date = moment(data.transaction_info.finish_date);
    data.transaction_info.visibility = [data.transaction_info.visibility]
    return this.http
      .post<any>(
        `${environment.apiUrlG12Connect.donations}`,
        this.getFormData(data, true),
        { headers: headerFile }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getCategories() {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.managment}/data-dictionary/filter`,
        { params: { type: 'G12_EVENT' }, headers: header }
      )
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  update(data: sendDonation, updateImage) {
    console.log('ejecutamos data', data)
    return this.http
      .put<any>(
        `${environment.apiUrlG12Connect.donations}`,
        this.getFormUpdate(data, updateImage),
        { headers: headerFile }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
  delete() { }

  /// query Mongo
  getTransactionsReports(params) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/reports-mongo`, {
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

  getTransactionsForCut(params) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/reports-for-cuts`, {
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

  ///EDIT USERSSS EVENT
  getDataByFilter(filter: any) {
    //IS FOR GET INFO USERS NOT PASTORS
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/not-pastor`, {
        params: filter,
        headers: header,
      })
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }


  getDataByFilterValue(filter: any) {
    //IS FOR GET INFO USERS NOT PASTORS
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/filter-not-pastor`, {
        params: filter,
        headers: header,
      })
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }


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

  getChurchTypes(): Observable<any> {
    // return this.http.post<any>(
    //   `${environment.apiUrlConexion12}MasterDetail/Get`, JSON.stringify({ "CodeMaster": "T14", "IdCountry": 240 }), { headers: header }).pipe(
    //     map((res: any) => {
    //       return res;
    //     }),
    //     catchError(this.handleError)
    //   );
    return new Observable((obs) => {
      obs.next({
        result: true,
        entity: [
          {
            idDetailMaster: 88,
            idCountry: 240,
            idMaster: 14,
            code: 'MCI',
            description: 'Iglesia MCI',
            disposable: true,
          },
          {
            idDetailMaster: 89,
            idCountry: 240,
            idMaster: 14,
            code: 'G12',
            description: 'Iglesia G12',
            disposable: true,
          },
          {
            idDetailMaster: 90,
            idCountry: 240,
            idMaster: 14,
            code: 'OT',
            description: 'Otra Iglesia',
            disposable: true,
          },
        ],
        message: ['Consulta exitosa.'],
        notificationType: 1,
      });
    });
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

  updateUser(user: any): Observable<any> {
    return this.http
      .put<any>(
        `${environment.apiUrlG12Connect.reports}/update-report-mongo-pgsql`,
        user,
        { headers: header }
      )
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  ///EDIT USERSSS EVENT

  getTransactionUserNotPastor(params) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/not-pastor`, {
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

  createCodesByEvent(data) {
    return this.http
      .post<any>(`${environment.apiUrlG12Connect.payments}/transaction/generate-codes`, data, {
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  changeReport(report) {
    return this.http
      .put<any>(
        `${environment.apiUrlG12Connect.reports}/change-event`,
        report,
        { headers: header }
      )
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  cuponsReports(params) {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.reports}/codes`, {
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

  getPseBanks(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.paymentsv3}/banks`, {
        headers: header,
      })
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  createMassive(payload) {
    return this.http
      .post<any>(`${environment.apiUrlG12Connect.paymentsv3}/create-massive`, payload, {
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getMassives(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.donations}/list-massive`, {
        headers: header,
      })
      .pipe(
        map((res: Response) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  addUser(payload) {
    return this.http
      .post<any>(`${environment.apiUrlG12Connect.donations}/add-user-massive`, payload, {
        headers: headerFile,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }   
  getTransactionInfo(transaction_id: string) {
    return this.http.get<any>(`${environment.apiUrlG12Connect.paymentsv3}/detail-payment`,
      { params: { transaction_id } })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getReportsMassive(){
    
      return this.http.get<any>(`${environment.apiUrlG12Connect.reports}/report-massive`
        )
        .pipe(
          map((res: any) => {
            return res;
          }),
          catchError(handleError)
        );
  }
}
