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
    const { permissions } = this.storage.getItem("auth");
    DynamicHeaderMenuConfig.items.map((item: any) => {
      let validate = validatePermission(permissions, item.code);
      if (!validate) {
        item.show = false;
      } else {
        if (item.submenu) {
          item.submenu.map(subitem => {
            if(subitem.code){
              let validate = validatePermission(permissions, subitem.code);
              if(!validate){
                subitem.show = false;
              }else{
                if(subitem.submenu){
                  subitem.submenu.map(lastItem => {
                    if(lastItem.code){
                      let validate = validatePermission(permissions, lastItem.code);
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
    this.setMenu(DynamicHeaderMenuConfig);
  }

  public  setMenu(menuConfig) {
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
