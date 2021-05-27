import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { MainService } from '../../../_services/main.service';
import { Response } from '../../../auth/_models/auth.model';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.scss']
})
export class SearchPeopleComponent implements OnInit {

  public _person: any = null;
  public documentTypes: any[] = [];

  private unsubscribe: Subscription[] = [];

  constructor(private _mainService: MainService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void { this.getDocumentTypes(); }

  getDocumentTypes() {
    const getDocSubscr = this._mainService
      .getDocumentTypes().subscribe((res: Response) => {
        this.documentTypes = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getDocSubscr);
  }

  setPerson($event){
    this._person = null;
    setTimeout(() => {
      this._person = $event;
      this.cdr.detectChanges();
    },1000);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
