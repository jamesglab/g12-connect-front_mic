import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

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
  selector: 'app-report-status-go',
  templateUrl: './report-status-go.component.html',
  styleUrls: ['./report-status-go.component.scss']
})
export class ReportStatusGOComponent implements OnInit {

  private currentUser: UserModel = this._storageService.getItem("user");
  public isLoading$: boolean = false;

  public reportStatusForm: FormGroup;
  public submitted: boolean = false; 
  
  public leadersForSelect: any[] = [];

  public displayedColumns: String[] = ['leaderName','hostName','cellType','state','closingReasons'];
  public dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private unsubscribe: Subscription[] = [];

  constructor(private _reportsService: ReportsService, private _exportService: ExportService,
     private _leadersService: LeadersService,
    private _storageService: StorageService, private fb: FormBuilder, 
    private cdr: ChangeDetectorRef, private snackBar: MatSnackBar ) {  }

  ngOnInit(): void { this.buildForm(); }

  buildForm(){
    this.reportStatusForm = this.fb.group({
      idUser:[this.currentUser.idUser],
      IdLeader: [null, [Validators.required]],
      State: [null, [Validators.required]]
    });
  }

  get form(){
    return this.reportStatusForm.controls;
  }

  getLeaderShipByMinistry(value: string){
    this.isLoading$ = true;
    const leaderShipSubscr = this._leadersService.getLeaderShipByMinistry({ idUser: this.currentUser.idUser, red: value })
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
    this.unsubscribe.push(leaderShipSubscr);
  }

  onSubmit(){
    this.submitted = true;
    if(this.reportStatusForm.invalid){
      return;
    }
    this.form.idUser.setValue(this.currentUser.idUser);
    this.getStatusGoReport();
  }

  getStatusGoReport() {
    this.isLoading$ = true;
    const reportStatusSubscr = this._reportsService
      .getReportStatusGO(this.getInsert()).subscribe((res: Response) => {
        this.isLoading$ = false;
        // this.reportStatusForm.reset();
        this.submitted = false;
        if(res){
          if (res.result) {
            if(!this.dataSource){
              this.dataSource = new MatTableDataSource<any[]>(res.entity);
              this.dataSource.paginator = this.paginator;
            }else{
              this.dataSource.data = res.entity;
            }
            this.cdr.detectChanges();
          } else {
            this.showMessage(res.notificationType, res.message[0]);
          }
        }else{
          this.cdr.detectChanges();
            this.showMessage(3,"Lo sentimos, no existen datos");
            if(this.dataSource){
              this.dataSource.data = [];
            }
        }
      });
    this.unsubscribe.push(reportStatusSubscr);
  }

  getInsert(){
    const { idUser, IdLeader, State } = this.reportStatusForm.getRawValue();
    return { idUser, IdLeader: parseInt(IdLeader), State: (State == "1") };
  }

  applyFilter(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  exportArchive(): void {
    let header = { 
      hostName: "Lider 12",
      leaderName: "Lider Célula",
      cellType: "Tipo Célula",
      state: "Estado",
      closingReasons: "Razón de cierre",
    };
    let data = this._exportService.buildData(header, this.dataSource.data);
    setTimeout(()=>{ this._exportService.exportAsExcelFile(data,'consolidated') },200)
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
