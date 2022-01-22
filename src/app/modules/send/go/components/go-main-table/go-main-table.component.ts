import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditgoComponent } from '../editgo/editgo.component';
// import { ReportgoComponent } from '../reportgo/reportgo.component';
import { ClosegoComponent } from '../closego/closego.component';

import { Go } from '../../../_models/go.model';
import { Response } from '../../../../auth/_models/auth.model';
import { UserModel } from '../../../../auth/_models/user.model';

import { GoService } from '../../../_services/goservice.service';

@Component({
  selector: 'app-go-main-table',
  templateUrl: './go-main-table.component.html',
  styleUrls: ['./go-main-table.component.scss']
})
export class GoMainTableComponent implements OnInit {

  @Input() public search: String = "";
  @Input() public user: UserModel;

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  //'report','seeReport','close'
  public displayedColumns: String[] = ['leader12', 'leadergo', 'day', 'contact', 'type', 'status', 'actions'];
  public dataSource: MatTableDataSource<Go[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private _goService: GoService, private router: Router, private modalService: NgbModal) {
    this.isLoading$ = this._goService.isLoading$;
  }

  ngOnInit(): void {
    this.getGoData();
  }

  getGoData() {
    this.hasError = false;
    const goDataSubscr = this._goService
      .getGo(this.user.idUser).subscribe((res: Response) => {
        if (res.result) {
          res.entity.reverse();
          if(!this.dataSource){ 
            this.dataSource = new MatTableDataSource<Go[]>(res.entity);
            this.dataSource.paginator = this.paginator;
          }else{
            this.dataSource.data = res.entity;
          }
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(goDataSubscr);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.search.firstChange) {
      this.applyFilter();
    }
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  parseDate(date: string): number {
    return new Date(date).getTime();
  }

  parseGoType(type: number){
    const types = { 
      1: "GO",
      2: "G12",
      5: "CÉLULA", // TEST
      4: "CÉLULA" // PRODUCTION
     }
     return types[type];
  }

  handleEdit(element: Go) {
    const MODAL = this.modalService.open(EditgoComponent,{
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.goItem = element;
    MODAL.result.then((data) => {
      if(data == "success"){
        this.getGoData();
      }
    });
  }

  handleReportGO(element: Go){
    this.router.navigate(['send/go/to-report', element.id])
    // const MODAL = this.modalService.open(ReportgoComponent,{
    //   windowClass: 'fadeIn',
    //   size: 'lg',
    //   backdrop: true,
    //   keyboard: true,
    //   centered: true
    // })
    // MODAL.result.then((data) => {
    //   // on close
    //   this.getGoData();
    // }, (reason) => {
    //   // on dismiss
    // });
  }

  handleSeeReportGo(element: Go){
    this.router.navigate(['send/go/reports', element.id])
  }

  handleClose(element: Go) {
   const MODAL = this.modalService.open(ClosegoComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.goItem = element;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
