import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/_services/auth.service';
import Swal from 'sweetalert2';
// import { encryptDataConection, decrypt } from 'src/app/_helpers/tools/encrypt.tool';
// import { environment } from 'src/environments/environment';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private _storageSetvice: StorageService, public _loginService: AuthService) { }
  // INTERCEDEMOS LA SOLICITUD REQUEST
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ACCEDEMOS AL TOKEN
    const token = this._storageSetvice.getItem('auth')?.token;
    // VALIDAMOS QUE EXISTA EL TOKEN 
    if (!token) {
      return next.handle(req);
    }
    // CLONAMOS LA SOLICITUD PARA CREAR UNA NUEVA 
    const reqClone = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`), });// ANEXAMOS EL BEARER TOKEN 
    // RETORNAMOS LA NUEVA SOLCITUD
    return next.handle(reqClone)
      // RECORREMOS LA RESPUESTA DEL BACK PARA CREAR UNA NUEVA RESPUESTA CON EL BODY INTERCEPTADO
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(err => {
          if (err.status == 401) {
            // REFRESH TOKEN AND THEN RELOAD PAGE
            this._loginService.refreshToken().subscribe(res => {
              this._storageSetvice.setItem('auth', { ...this._storageSetvice.getItem('auth'), token: res.token });
              Swal.fire('Reiniciaremos tu sesion', '', 'info').then(res => {
                window.location.reload()
              });
            })
          }
          const error = (err && err.error && err.error.message) || err.statusText;
          return throwError(error);
        })
      );
  }
}