import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { parseToObject } from 'src/app/_helpers/tools/permission.tool';
import { UserModel } from '../_models/user.model';
import { StorageService } from './storage.service';
// import { Response } from '../_models/auth.model';
// import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private isLoadingSubject: BehaviorSubject<boolean>;
  // private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    private _storageService: StorageService,
    // private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<any> {

    this.isLoadingSubject.next(true);
    return this.http.post<any>(
      `${environment.apiUrlG12Connect.users}/auth`, { email, password, platform: 'conexion12' }, { headers: header }
    ).pipe(
      map((auth: any) => {
        // auth.entity[0].objectsList = await parseToObject(JSON.parse(auth.entity[0].listObjetos), "Code", "Obj");
        if (auth.user.verify) {
          this.setAuthOnLocalStorage(auth);
          this.isLoadingSubject.next(false);
        }
        return auth;
      }),
      catchError(handleError)
    );
  }

  logout() {
    this._storageService.removeItem("auth");
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  refreshToken() {
    return this.http.post<any>(
      `${environment.apiUrlG12Connect.users}/auth/refresh-token`, { token: this._storageService.getItem('auth').token }
    ).pipe(
      map((auth: any) => {
        return auth;
      }),
      catchError(handleError)
    );
  }
  getUserByToken(): Observable<any> {
    const { user } = this.getAuthFromLocalStorage() || { user: null };
    if (!user) {
      return of(undefined);
    }
    this.currentUserSubject = new BehaviorSubject<any>(user);
    return new Observable((e) => { e.next(user) });
  }

  forgotPassword(data: { email: string }): Observable<Response> {
    this.isLoadingSubject.next(true);
    return this.http.post<Response>(
      `${environment.apiUrlG12Connect.users}/auth/send-recovery`, JSON.stringify(data), { headers: header }
    ).pipe(
      map((auth: Response) => {
        this.isLoadingSubject.next(false);
        return auth;
      }), catchError(handleError),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  // private methods
  private async setAuthOnLocalStorage(auth: Response): Promise<boolean> {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth) {
      return this._storageService.setItem("auth", auth) as any;
    }
    return false;
  }

  private getAuthFromLocalStorage(): UserModel {
    try {
      return this._storageService.getItem("auth");
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  changePassword(payload) {
    return this.http.post<any>(
      `${environment.apiUrlG12Connect.users}/auth/reset-password`, payload, { headers: header }
    ).pipe(
      map((auth: any) => {
        this.isLoadingSubject.next(false);
        return auth;
      }), catchError(handleError),
    );
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
