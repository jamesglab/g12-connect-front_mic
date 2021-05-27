import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicHeaderMenuConfig } from '../../configs/dynamic-header-menu.config';
import { validatePermission } from 'src/app/_helpers/tools/permission.tool';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';

const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicHeaderMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor(private storage: StorageService) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localeStorage
  // Default => from DynamicHeaderMenuConfig
  private loadMenu() {
    // console.log("OBJETOS DEL USUARIO", this.storage.getItem("user").objectsList);
    // DynamicHeaderMenuConfig.items.map((item: any) => {
    //   let validate = validatePermission(this.storage.getItem("user").objectsList, item.code);
    //   if (!validate) {
    //     item.show = false;
    //   } else {
    //     if (item.submenu) {
    //       item.submenu.map(subitem => {
    //         //FLAG
    //         ///////////////////I MUST ENHANCE THIS FUNCIONALITY////////////////////////////////////////////
    //         ///NO VALIDATE CODE-----
    //         if (subitem.code) {
    //           let _validate = validatePermission(this.storage.getItem("user").objectsList, subitem.code);
    //           if (!_validate) {
    //             subitem.show = false;
    //           }
    //         }
    //       })
    //     }
    //   }
    // });
    this.setMenu(DynamicHeaderMenuConfig);
  }

  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
