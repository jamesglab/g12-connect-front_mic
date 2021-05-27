import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { getFirstDayOfWeek, getCurrentDate } from 'src/app/_helpers/tools/utils.tool';
import { formatToFilter } from 'src/app/_helpers/tools/parsedata/parse-data-towin.tool';

import { StorageService } from '../../../../auth/_services/storage.service';
import { PhoneVisitService } from '../../../_services/phone-visit.service';
import { PeopleService } from '../../../_services/people.service';
import { LeadersService } from '../../../../send/_services/leaders.service';

import { PhoneVisit } from '../../../_models/phone-visit.model';
import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-manage-phone-visit',
  templateUrl: './manage-phone-visit.component.html',
  styleUrls: ['./manage-phone-visit.component.scss']
})
export class ManagePhoneVisitComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  //FOR MIN & MAX VALIDATION
  public minDateS: Date;
  public maxDateS: Date;
  public minDateE: Date;
  public maxDateE: Date;

  public phoneVisitData: PhoneVisit[] = [];
  public zones: any[] = [];
  public pastors: any[] = [];

  public filterForm: FormGroup;
  public notFound: boolean = false;
  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(private _phoneVisitService: PhoneVisitService, private _leadersService: LeadersService,
    private _storageService: StorageService, private _peopleService: PeopleService, 
    private fb: FormBuilder, private cdr: ChangeDetectorRef) { 
      this.minDateS = new Date(new Date().getFullYear() - 1, 0, 1);
      this.maxDateS = new Date();
      this.minDateE = new Date(new Date().getFullYear(), 0, 1);
      this.maxDateE = new Date();
    }

  ngOnInit(): void {
    this.buildForm();
    this.getToStart();
    this.getZones();
    this.getPastors();
  }

  buildForm(): void {
      this.filterForm = this.fb.group({
        StartDateWin: ['',[Validators.required]],
        EndDateWin: ['', [Validators.required]],
        IdLeader: [null, [Validators.required]],
        IdZone: [null],
        Call: [null],
        Visited: [null]
      });
  }

  get form() {
    return this.filterForm.controls;
  }

  getToStart(){
    this.getPhoneVisitData({
      StartDateWin: getFirstDayOfWeek('YYYY-MM-DD'),
      EndDateWin: getCurrentDate('YYYY-MM-DD'),
      IdLeader: this.currentUser.idLider,
    });
  }

  getPhoneVisitData(data: any) {
    this.isLoading = true;
    console.log("SE FUE A RECARGAR")
    const getDataSubscr = this._phoneVisitService
      .getPhoneVisitData(data).subscribe((res: Response) => {
        this.isLoading = false;
        this.phoneVisitData = res.entity;
        this.cdr.detectChanges();
      }, err => {
        this.notFound = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getDataSubscr);
  }

  getZones() {
    const getCivilSubscr = this._peopleService
      .getZone(this.currentUser.idSede).subscribe((res: Response) => {
        this.zones = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getCivilSubscr);
  }

  getPastors() {
    const getCivilSubscr = this._leadersService
      .getLeaderShips({ idUser: this.currentUser.idUser }).subscribe((res: Response) => {
        this.pastors = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getCivilSubscr);
  }

  onSubmit(){
    if(this.filterForm.invalid){
      return;
    }
    this.getPhoneVisitData(formatToFilter(this.filterForm.getRawValue()));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
