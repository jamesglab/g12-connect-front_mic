import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { header } from 'src/app/_helpers/tools/header.tool';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';

import { parseToObject } from 'src/app/_helpers/tools/permission.tool';
import { UserModel } from '../_models/user.model';
import { StorageService } from './storage.service';
import { Response } from '../_models/auth.model';
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
  login(user: string, password: string): Observable<Response> {

    this.isLoadingSubject.next(true);
    return this.http.post<Response>(
      `${environment.apiUrl}Sso/Login`, JSON.stringify({ Nickname: user, Password: password }), { headers: header }
      ).pipe(
        map(async (auth: Response) => {
          auth.entity[0].objectsList = await parseToObject(JSON.parse(auth.entity[0].listObjetos), "Code", "Obj");
          this.setAuthFromLocalStorage(auth);
          return auth;
        }),
        catchError((err) => {
          return of(err.error);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  logout() {
    this._storageService.removeItem("user")
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth) {
      return of(undefined);
    }
    this.currentUserSubject = new BehaviorSubject<UserModel>(auth);
    return new Observable((e) => { e.next(auth)});

    // this.isLoadingSubject.next(true);
    // return this.authHttpService.getUserByToken(auth.accessToken).pipe(
    //   map((user: UserModel) => {
    //     if (user) {
    //       this.currentUserSubject = new BehaviorSubject<UserModel>(user);
    //     } else {
    //       this.logout();
    //     }
    //     return user;
    //   }),
    //   finalize(() => this.isLoadingSubject.next(false))
    // );
  }

  // need create new user then login
  // registration(user: UserModel): Observable<any> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.createUser(user).pipe(
  //     map(() => {
  //       this.isLoadingSubject.next(false);
  //     }),
  //     // switchMap(() => this.login(user.email, user.password)),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  forgotPassword(data: { documentType: number, documentNumber: string, email: string }): Observable<Response> {
    this.isLoadingSubject.next(true);
    return this.http.post<Response>(
      `${environment.apiUrl}User/RecoverPassword`, JSON.stringify(data), { headers: header }
      ).pipe(
        map((auth: Response) => {
          this.isLoadingSubject.next(false);
          return auth;
        }),catchError((err) => {console.error('err', err); return of(err.error);}),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }


  // private methods
  private async setAuthFromLocalStorage(auth: Response): Promise<boolean> {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.entity.length > 0) {
      this._storageService.setItem("user", auth.entity[0]);
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): UserModel {
    try {
      return this._storageService.getItem("user");
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // private handle_error(error: Response ): Error {
  //   const ERROR_DEFAULT = 'Por favor intente de nuevo más tarde o pongase en contacto con soporte técnico.';
  //   const ERROR_DATA = {
  //     message: error.message || ERROR_DEFAULT,
  //     title: error.statusText
  //   };

  //   this.loading(false);

  //   Swal.fire({
  //     title: `ERROR! ${ERROR_DATA.title}`,
  //     text: ERROR_DATA.message || ERROR_DEFAULT,
  //     icon: 'error',
  //     allowEscapeKey: false,
  //     allowOutsideClick: false
  //   });

  //   throw (ERROR_DATA);
  // }

}
