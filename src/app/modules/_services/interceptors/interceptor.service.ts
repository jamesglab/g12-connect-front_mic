import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private _storageSetvice: StorageService) { }
  // INTERCEDEMOS LA SOLICITUD REQUEST
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ACCEDEMOS AL TOKEN
    const token = this._storageSetvice.getItem('auth')?.token;
    // VALIDAMOS QUE EXISTA EL TOKEN 
    if (!token) {
      return next.handle(req);
    }
    // CLONAMOS LA SOLICITUD PARA CREAR UNA NUEVA 
    const headers = req.clone({
      // ANEXAMOS EL BEARER TOKEN
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // RETORNAMOS LA NUEVA SOLCITUD
    return next.handle(headers);
  }
} 