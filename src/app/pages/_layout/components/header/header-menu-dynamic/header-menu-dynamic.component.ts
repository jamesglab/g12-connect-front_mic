import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../../../../modules/auth/_services/storage.service';
import { LayoutService, DynamicAsideMenuService,DynamicHeaderMenuService } from '../../../../../_metronic/core';

@Component({
  selector: 'app-header-menu-dynamic',
  templateUrl: './header-menu-dynamic.component.html',
  styleUrls: ['./header-menu-dynamic.component.scss']
})
export class HeaderMenuDynamicComponent implements OnInit, OnDestroy {

  public currentUser: any = this.storageService.getItem("user");
  subscriptions: Subscription[] = [];
  currentUrl: string;
  menuConfig: any;

  ulCSSClasses: string;
  rootArrowEnabled: boolean;
  headerMenuDesktopToggle: string;

  constructor(
    private storageService: StorageService,
    private layout: LayoutService,
    private router: Router,
    private menu: DynamicAsideMenuService,//SE CAMBIO EL SERVICIO PARA CONSUMIR UN SOLO ENDPOINT    ESTABA DynamicHeaderMenuService 
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.ulCSSClasses = this.layout.getStringCSSClasses('header_menu_nav');
    this.rootArrowEnabled = this.layout.getProp('header.menu.self.rootArrow');
    this.headerMenuDesktopToggle = this.layout.getProp(
      'header.menu.desktop.toggle'
    );

    // router subscription
    this.currentUrl = this.router.url.split(/[?#]/)[0];
    const routerSubscr = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(routerSubscr);

    // menu load
    const menuSubscr = this.menu.menuConfig$.subscribe(res => {
      this.menuConfig = res;
      this.cdr.detectChanges();

    });
    this.subscriptions.push(menuSubscr);
  }

  isMenuItemActive(path) {
    if (!this.currentUrl || !path) {
      return false;
    }

    if (this.currentUrl === path) {
      return true;
    }

    if (this.currentUrl.indexOf(path) > -1) {
      return true;
    }

    return false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
