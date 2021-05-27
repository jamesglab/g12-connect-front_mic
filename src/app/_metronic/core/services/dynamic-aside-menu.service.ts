import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';
import { validatePermission } from 'src/app/_helpers/tools/permission.tool';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor(private storage: StorageService) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  private loadMenu() {
    // console.log("OBJETOS DEL USUARIO", this.storage.getItem("user").objectsList);
    // DynamicAsideMenuConfig.items.map((item: any) => {
    //   let validate = validatePermission(this.storage.getItem("user").objectsList, item.code);
    //   if(!validate){
    //     item.show = false;
    //   }else{
    //     if(item.submenu){
    //       item.submenu.map(subitem => {
    //         //FLAG
    //         ///////////////////I MUST ENHANCE THIS FUNCIONALITY////////////////////////////////////////////
    //         ///NO VALIDATE CODE-----
    //         if(subitem.code){
    //           let _validate = validatePermission(this.storage.getItem("user").objectsList, subitem.code);
    //           if(!_validate){
    //             subitem.show = false;
    //           }
    //         }
    //       })
    //     }
    //   }
    // });
    this.setMenu(DynamicAsideMenuConfig);
  }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
