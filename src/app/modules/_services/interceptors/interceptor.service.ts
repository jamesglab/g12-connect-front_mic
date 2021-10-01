import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { map } from 'rxjs/operators';
// import { encryptDataConection, decrypt } from 'src/app/_helpers/tools/encrypt.tool';
// import { environment } from 'src/environments/environment';

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
    const reqClone = req.clone({
      // ANEXAMOS EL BEARER TOKEN
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    }

    );
    // RETORNAMOS LA NUEVA SOLCITUD
    return next.handle(reqClone)
      // RECORREMOS LA RESPUESTA DEL BACK PARA CREAR UNA NUEVA RESPUESTA CON EL BODY INTERCEPTADO
      .pipe(
        map((res) => {
          console.log('tenemos respuesta del back intercedido', res)
          return res;
        }),
      );
  }

  // METODO PARA DESENCRIPTAR LA RESPUESTA DEL USUARIO
  // private desencriptData(event: HttpEvent<any>) {
  //   if (event instanceof HttpResponse && event.body) {
  //     return event.clone({ body: decrypt(event.body, environment.SECRETENCRYPT) });
  //   } else {
  //     return event;
  //   }
  // }
}