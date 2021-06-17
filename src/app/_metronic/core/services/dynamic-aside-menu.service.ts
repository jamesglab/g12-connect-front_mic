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
    const { permisses } = this.storage.getItem("auth");
    DynamicAsideMenuConfig.items.map((item: any) => {
      let validate = validatePermission(permisses, item.code);
      if (!validate) {
        item.show = false;
      } else {
        if (item.submenu) {
          item.submenu.map(subitem => {
            if(subitem.code){
              let validate = validatePermission(permisses, subitem.code);
              if(!validate){
                subitem.show = false;
              }else{
                if(subitem.submenu){
                  subitem.submenu.map(lastItem => {
                    if(lastItem.code){
                      let validate = validatePermission(permisses, lastItem.code);
                      if(!validate){
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


  private setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
