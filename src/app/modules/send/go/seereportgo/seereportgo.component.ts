import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { parseMonth } from 'src/app/_helpers/tools/utils.tool';

import { GoService } from '../../_services/goservice.service';
import { ExportService } from '../../../_services/export.service';

import { SeeReportGo } from '../../_models/go.model';
import { Response } from '../../../auth/_models/auth.model';

@Component({
  selector: 'app-seereportgo',
  templateUrl: './seereportgo.component.html',
  styleUrls: ['./seereportgo.component.scss']
})
export class SeereportgoComponent implements OnInit {

  private _id: number;

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  public displayedColumns: String[] = ['topic', 'year', 'month', 'week', 'isRealized','attendess'];

  public dataSource: MatTableDataSource<SeeReportGo[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private _goService: GoService, private _exportService: ExportService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.getDataReportByGo();
  }

  getDataReportByGo(){
    const seeReportGoSubscr = this._goService
      .getDataReportByGo({ idGo: this._id }).subscribe((res: Response) => {
        if (res.result) {
          res.entity.map((item) => { item.month = parseMonth(item.month); })
          if(!this.dataSource){
            this.dataSource = new MatTableDataSource<SeeReportGo[]>(res.entity || []);
            this.dataSource.paginator = this.paginator;
          }else{
            this.dataSource.data = res.entity || [];
          }
        } else {
          //error
        }
      });
    this.unsubscribe.push(seeReportGoSubscr);
  }

  applyFilter(value: string) {
    this.dataSource.filter =  value.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }
  
  exportArchive(): void {
    let header = { 
      topic: "Tema",
      year: "Año",
      month: "Mes",
      week: "Semana",
      done: "Realizada",
      numberAttendess: "No. Asistentes"
    };
    let data = this._exportService.buildData(header, this.dataSource.data);
    setTimeout(()=>{ this._exportService.exportAsExcelFile(data,'consolidated') },200)
  }

}
