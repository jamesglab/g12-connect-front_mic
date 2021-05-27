import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { ReportsService } from '../../../_services/reports.service';
import { LeadersService } from '../../../_services/leaders.service';
import { ExportService } from '../../../../_services/export.service';
import { StorageService } from '../../../../auth/_services/storage.service';

import { Response } from '../../../../auth/_models/auth.model';
import { UserModel } from '../../../../auth/_models/user.model';

@Component({
  selector: 'app-leadersgoreport',
  templateUrl: './leadersgoreport.component.html',
  styleUrls: ['./leadersgoreport.component.scss']
})
export class LeadersgoreportComponent implements OnInit {

  private currentUser: UserModel = this._storageService.getItem("user");
  public isLoading$: boolean = false;
  public getReportForm: FormGroup;

  public leadersData: any[] = [];
  public _filteredLeadersData: any[] = [];
  public leadersForSelect: any[] = [];

  private unsubscribe: Subscription[] = [];

  constructor(private _reportsService: ReportsService, private _exportService: ExportService,
    private _storageService: StorageService,
    private _leadersService: LeadersService, private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {  }

  ngOnInit(): void { this.buildForm(); }

  buildForm(){
    this.getReportForm = this.fb.group({
      idUser: [this.currentUser.idUser],
      idLeader:[null, [Validators.required]]
    })
  }

  get form(){
    return this.getReportForm.controls;
  }

  getLeaderShipByMinistry(value: string){
    this.isLoading$ = true;
    this._leadersService.getLeaderShipByMinistry({ idUser: this.currentUser.idUser, red: value })
    .subscribe((res: Response) =>{
      this.isLoading$ = false;
      if(res){
        if(res.result){
          this.leadersForSelect = res.entity;
          this.cdr.detectChanges();
        }else{
          this.showMessage(res.notificationType, res.message[0]);
        }
      }else{
        this.showMessage(3, "No hemos encontrado datos");
      }
    });
  }

  onSubmit(){
    if(this.getReportForm.invalid){
      return;
    }
    this.form.idUser.setValue(this.currentUser.idUser)
    this.getTracingLeaderGO();
  }

  getTracingLeaderGO() {
    this.isLoading$ = true;
    const reportLeaderGOSubscr = this._reportsService
      .getTracingLeaderGO(this.getInsert())
      .subscribe((res: Response) => {
        this.isLoading$ = false;
        if (res) {
          if (res.result) {
            this.leadersData = res.entity;
            this._filteredLeadersData = res.entity;
            this.cdr.detectChanges();
          } else {
            this.showMessage(res.notificationType, res.message[0]);
          }
        } else {
          this.showMessage(3, "No hemos encontrado datos");
        }
      });
    this.unsubscribe.push(reportLeaderGOSubscr);
  }

  getInsert(){
    const { idUser, idLeader } = this.getReportForm.getRawValue();
    return { idUser, idLeader: parseInt(idLeader) };
  }

  onFilter(search: string){
    var toSearch = search.toLocaleLowerCase().trim();
    
    this._filteredLeadersData = this.leadersData.filter(filter => {
      return (filter.name.toLowerCase().trim().includes(toSearch)) ||
      (filter.code.trim().includes(toSearch))
    })
  }

  exportArchive(): void {
    let header = { 
      name: "Nombre",
      code: "Código",
      active: "Activas",
      inactive: "Inactivas",
      total: "Total",
    };
    let data = this._exportService.buildData(header, this._filteredLeadersData);
    setTimeout(()=>{ this._exportService.exportAsExcelFile(data,'consolidated') },200)
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
