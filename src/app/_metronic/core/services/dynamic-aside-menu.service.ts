
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';
import { validatePermission } from 'src/app/_helpers/tools/permission.tool';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';



import { handleError, header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';
import { decrypt } from 'src/app/_helpers/tools/encrypt.tool';

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
  private  loadMenu() {
    const { permissions } = this.storage.getItem("auth");



    // this.getPermissionsUser().subscribe(res=>{
    //   // console.log('tenemos respuesta')
    //   // console.log('ress',res)
    // },err=>{console.log('err',err)})

      DynamicAsideMenuConfig.items.map((item: any) => {
        let validate = validatePermission(permissions, item.code);
        if (!validate) {
          item.show = false;
        } else {
          if (item.submenu) {
            item.submenu.map(subitem => {
              if (subitem.code) {
                let validate = validatePermission(permissions, subitem.code);
                if (!validate) {
                  subitem.show = false;
                } else {
                  if (subitem.submenu) {
                    subitem.submenu.map(lastItem => {
                      if (lastItem.code) {
                        let validate = validatePermission(permissions, lastItem.code);
                        if (!validate) {
                          lastItem.show = false;
                        }
                      }
                    })
                  }
                }
              }
            })
          }
        }
      });
    this.setMenu(DynamicAsideMenuConfig);
  }


  // getPermissionsUser(): Observable<any> {
  //   return this.http
  //     .get<any>(`${environment.apiUrlG12Connect.users}/permissions`)
  //     .pipe(
  //       map((res) => {
  //         console.log('respuesta pipe',res)
  //         return res;
  //       }),
  //       catchError(handleError)
  //     );
  // }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
