
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicAsideMenuConfigOriginal } from '../../configs/dynamic-aside-menu.config';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { handleError, header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor(private storage: StorageService, private http: HttpClient) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  public loadMenu() {

    this.getPermissionsUser().subscribe(res => {

      const DynamicAsideMenuConfig = DynamicAsideMenuConfigOriginal;
      // ASIGNAMOS LOS VALORES DEL OBJETO EN UN ARRAY
      let permissionsArray = Object.keys(res);
      // RECORREMOS LOS MODULOS PRINCIPALES
      DynamicAsideMenuConfig.items.map((item: any) => {
        // VALIDAMOS QUE EL PERMISO PARA ACCEDER AL MODULO SE ENCUENTRE 
        item.show = permissionsArray.find(permission => item.code == permission) ? true : false;
        // VALIDAMOS LOS OBJETOS EN EL SUBMENU SEGUNDO NIVEL
        if (item.submenu) {
          // RECORREMOS LOS OBJETOS DEL SEGUNDO NIVEL
          item.submenu.map(submenu2Lvl => {
            // SI EL PERMISO SE ENCUENTRA EN EL MODULO LO RENDERIZA
            submenu2Lvl.show = permissionsArray.find(permission => submenu2Lvl.code == permission) ? true : false;
            // VALIDAMOS EL TERCER NIVEL
            if (submenu2Lvl.submenu) {
              // RECORREMOS LOS OBJETOS DEL TERCER NIVEL
              submenu2Lvl.submenu.map(submenu3Lvl => {
                // VALIDAMOS QUE EL OBJETO SE ENCUENTRE EN LOS PERMISOS 
                submenu3Lvl.show = permissionsArray.find(permission => submenu3Lvl.code == permission) ? true : false
              });
            }
          });
        }
      });


      this.setMenu(DynamicAsideMenuConfig);

    }, err => {
      if (err.status == 401) {
        console.log('aqui hacemos el refresh token')
      }
    });


  }


  getPermissionsUser(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrlG12Connect.users}/permissions`)
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  public setMenu(menuConfig) {

    // if (this.menuConfigSubject.value){
    // this.menuConfigSubject.unsubscribe();
    // }
    this.menuConfigSubject.next(menuConfig);
  }

  public getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
