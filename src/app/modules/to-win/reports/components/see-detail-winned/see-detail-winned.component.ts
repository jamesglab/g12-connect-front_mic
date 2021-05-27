import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { getFirstDayOfWeek, getCurrentDate } from 'src/app/_helpers/tools/utils.tool';

import { ToWinReportsService } from '../../../_services/to-win-reports.service';
import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-see-detail-winned',
  templateUrl: './see-detail-winned.component.html',
  styleUrls: ['./see-detail-winned.component.scss']
})
export class SeeDetailWinnedComponent implements OnInit {

  public element: any = null;
  public detailData: any[] = [];
  public showNoWin: boolean = false;

  public displayedColumns: String[] = ['name', 'leader', 'phone', 'movil', 'address'];
  public dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private _toWinReportsService: ToWinReportsService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getData({ IdLeader: this.element.idLeader,
      StartDateWin: getFirstDayOfWeek('YYYY-MM-DD'),
      EndDateWin: getCurrentDate('YYYY-MM-DD')
    });
    this.cdr.detectChanges();
  }

  getData(data: { IdLeader: number, StartDateWin: string, EndDateWin: string }): void {
    const getPersonSubscr = this._toWinReportsService
      .getViewDetail(data).subscribe((res: Response) => {
        this.detailData = res.entity;
        this.renderData();
        this.cdr.detectChanges();
      }, err => {
        this.showNoWin = true;
        setTimeout(() => { this.showNoWin = false; }, 4000);
      });
    this.unsubscribe.push(getPersonSubscr);
  }

  renderData() {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<any>(this.detailData);
      this.dataSource.paginator = this.paginator;
    } else {
      this.dataSource.data = this.detailData;
    }
  }

  applyFilter(search: string) {
    if(this.dataSource){
      this.dataSource.filter = search.trim().toLowerCase();
      if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
