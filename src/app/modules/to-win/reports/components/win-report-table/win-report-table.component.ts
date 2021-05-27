import { Component, OnInit, Input, Output, ViewChild, 
  SimpleChanges, ChangeDetectorRef, EventEmitter } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { SeeDetailWinnedComponent } from '../see-detail-winned/see-detail-winned.component';

@Component({
  selector: 'app-win-report-table',
  templateUrl: './win-report-table.component.html',
  styleUrls: ['./win-report-table.component.scss']
})
export class WinReportTableComponent implements OnInit {

  @Input() public search: String = "";
  @Input() public mainData: any[] = [];
  @Output() public onViewTeam: EventEmitter<any> = new EventEmitter();

  public displayedColumns: String[] = ['all12', 'winned', 'called', 'visited', 'actions'];
  public dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.renderMainData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.mainData?.firstChange) {
      this.renderMainData();
    }
    if (!changes.search?.firstChange) {
      this.applyFilter();
    }
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  renderMainData(): void {
    if(!this.dataSource){
      this.dataSource = new MatTableDataSource<any>(this.mainData);
      this.dataSource.paginator = this.paginator;
    }else{
      this.dataSource.data = this.mainData;
    }
    this.cdr.detectChanges();
  }

  getTwelveTeam(element: any): void {
    this.onViewTeam.emit(element);
  }

  handleToWinnedDetail(element: any){
    const MODAL = this.modalService.open(SeeDetailWinnedComponent,{
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.element = element;
    MODAL.result.then((data) => {
      if(data == "success"){
        //reload data
      }
    }, (err) => {});
  }

}
