import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EdithostleaderComponent } from '../edithostleader/edithostleader.component'

import { LeaderHost } from '../../../_models/leader.model';
import { UserModel } from '../../../../auth/_models/user.model';
import { Response } from '../../../../auth/_models/auth.model';
import { LeadersService } from '../../../_services/leaders.service';

@Component({
  selector: 'app-go-leaders-table',
  templateUrl: './go-leaders-table.component.html',
  styleUrls: ['./go-leaders-table.component.scss']
})
export class GoLeadersTableComponent implements OnInit {

  @Input() public search: String = "";
  @Input() public user: UserModel;
  @Output() public onRenderData: EventEmitter<any[]> = new EventEmitter();

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  public displayedColumns: String[] = ['document', 'name', 'email', 'phone', 'cellphone','edit'];
  public dataSource: MatTableDataSource<LeaderHost[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private _leaderService: LeadersService) { }

  ngOnInit(): void { this.getHostLeaders(); }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.search.firstChange) {
      this.applyFilter();
    }
  }

  getHostLeaders() {
    this.hasError = false;
    const leaderHostDataSubscr = this._leaderService
      .getHostLeaders({ idUser: this.user.idUser }).subscribe((res: Response) => {
        if (res.result) {
          res.entity.reverse()
          if(!this.dataSource){
            this.dataSource = new MatTableDataSource<LeaderHost[]>(res.entity);
            this.dataSource.paginator = this.paginator;
          }else{
            this.dataSource.data = res.entity;
          }
          this.onRenderData.emit(res.entity);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(leaderHostDataSubscr);
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
    this.onRenderData.emit(this.dataSource.filteredData);
  }

  handleEdit(element: LeaderHost){
    const MODAL = this.modalService.open(EdithostleaderComponent,{
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.leaderItem = element;
    MODAL.result.then((data) => {
      if(data == 'success'){
        this.getHostLeaders();
      }
    }, (reason) => {
      // on dismiss
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
