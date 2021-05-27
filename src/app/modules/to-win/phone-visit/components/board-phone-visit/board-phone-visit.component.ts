import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Subscription } from 'rxjs';

import { CURRENT_MONTH, getLastThreeMonths, getCurrentWeekBoard } from 'src/app/_helpers/tools/utils.tool';

import { PhoneVisitService } from '../../../_services/phone-visit.service';
import { StorageService } from '../../../../auth/_services/storage.service';

import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-board-phone-visit',
  templateUrl: './board-phone-visit.component.html',
  styleUrls: ['./board-phone-visit.component.scss']
})
export class BoardPhoneVisitComponent implements OnInit {

  public currentUser: any = this._storageService.getItem("user");

  public boardData: any = {};

  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(private _phoneVisitService: PhoneVisitService, private _storageService: StorageService, 
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getBoardData();
  }

  currentMonth() {
    return CURRENT_MONTH;
  }

  getLastThreeMonths(){
    return getLastThreeMonths();
  }

  getCurrentWeekBoard(){
    return getCurrentWeekBoard();
  }

  getBoardData() {
    this.isLoading = true;
    const getBoardSubscr = this._phoneVisitService
      .getBoardData(this.currentUser.idUser)
      .subscribe((res: Response) => {
        this.isLoading = false;
        this.boardData = res.entity[0];
        this.cdr.detectChanges();
      }, err => {
        this.isLoading = false;
        this.cdr.detectChanges();
        throw err;
      });
    this.unsubscribe.push(getBoardSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
