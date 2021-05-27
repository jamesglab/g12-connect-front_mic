import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { getFirstDayOfWeek, getCurrentDate } from 'src/app/_helpers/tools/utils.tool';

import { ToWinReportsService } from '../../_services/to-win-reports.service';
import { StorageService } from '../../../auth/_services/storage.service';
import { ExportService } from '../../../_services/export.service';

import { Response } from '../../../auth/_models/auth.model';

@Component({
  selector: 'app-to-win-reports-main',
  templateUrl: './to-win-reports-main.component.html',
  styleUrls: ['./to-win-reports-main.component.scss']
})
export class ToWinReportsMainComponent implements OnInit {

  public currentUser: any = this._storageService.getItem("user");

  public mainData: any[] = [];
  public currentLeader: any = null;
  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(private _toWinReportsService: ToWinReportsService, private _storageService: StorageService,
    private _exportService: ExportService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getStart();
  }

  getStart(): void {
    this.currentLeader = null;
    this.getMainReport({
      IdAccess: this.currentUser.idUser,
      StartDateWin: getFirstDayOfWeek('YYYY-MM-DD'),
      EndDateWin: getCurrentDate('YYYY-MM-DD')
    });
  }

  handleOnViewTeam($event: any): void {
    this.getMainReport({
      IdAccess: this.currentUser.idUser,
      StartDateWin: getFirstDayOfWeek('YYYY-MM-DD'),
      EndDateWin: getCurrentDate('YYYY-MM-DD'),
      IdLeader: $event.idLeader
    });
    this.currentLeader = $event;
  }

  handleOnFiltered($event: any): void {
    this.getMainReport({
      IdAccess: this.currentUser.idUser,
      ...$event
    })
  }

  getMainReport(data: {
    IdAccess: number,
    StartDateWin: string, EndDateWin: string, IdLeader?: number
  }): void {
    this.isLoading = true;
    const getMainReportSubscr = this._toWinReportsService
      .getMainReport(data)
      .subscribe((res: Response) => {
        this.isLoading = false;

        this.mainData = res.entity;
        this.currentLeader = res.entity[0];
        this.cdr.detectChanges();
      }, err => {
        this.isLoading = false;
        this.cdr.detectChanges();
        throw err;
      });
    this.unsubscribe.push(getMainReportSubscr);
  }

  downloadMainDataReport() {
    let header = { leader: "MIS 12", won: "GANADOS", calls: "LLAMADOS", visited: "VISITADOS" };
      let final = this._exportService.buildData(header, this.mainData);
      setTimeout(() => { this._exportService.exportAsExcelFile(final, 'myteam') }, 100);
      this.cdr.detectChanges();
  }

  getDownloadDetail() {
    this.isLoading = true;
    const reportCellsSubscr = this._toWinReportsService
      .getDownloadDetail({
        IdLeader: this.currentLeader.idLeader,
        StartDateWin: getFirstDayOfWeek('YYYY-MM-DD'), EndDateWin: getCurrentDate('YYYY-MM-DD')
      })
      .subscribe((res: Response) => {
        this.isLoading = false;
        console.log("RESPONSE", res);
        // if (res.result) {
        //   let header = {
        //     pastor: "PASTOR", leader: "LIDER 12", host: "ANFITRION",
        //     telLeaderCell: "TELEFONO LIDER", day: "DIA", type: "TIPO REUNION",
        //     assistant: "ASISTENTES", year: "AÑO", month: "MES",
        //     week: "SEMANA", done: "REALIZADA", topic: "TEMA"
        //   }
        //   let final = this._exportService.buildData(header, res.entity);
        //   setTimeout(() => { this._exportService.exportAsExcelFile(final, 'cellsConsolidated') }, 100);
        //   this.cdr.detectChanges();
        // }
      }, err => { this.isLoading = false; });
    this.unsubscribe.push(reportCellsSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
