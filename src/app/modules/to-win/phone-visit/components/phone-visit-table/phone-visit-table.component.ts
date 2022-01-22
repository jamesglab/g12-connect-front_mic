import { Component, OnInit, ViewChild, Input,Output, EventEmitter, 
  SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PhoneVisit } from '../../../_models/phone-visit.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
//MODAL
import { ReportVisitComponent } from '../../components/report-visit/report-visit.component';

@Component({
  selector: 'app-phone-visit-table',
  templateUrl: './phone-visit-table.component.html',
  styleUrls: ['./phone-visit-table.component.scss']
})
export class PhoneVisitTableComponent implements OnInit {

  @Input() public search: String = "";
  @Input() public phoneVisitData: PhoneVisit[] = [];
  @Output() public reload: EventEmitter<boolean> = new EventEmitter();

  private unsubscribe: Subscription[] = [];
  public permisses: { [ key: string]: string } = this.storage.getItem("user").objectsList;

  public displayedColumns: String[] = ['name', 'leader', 'date', 'phone', 'mobile', 'actions'];
  public dataSource: MatTableDataSource<PhoneVisit>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private modalService: NgbModal, private storage: StorageService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPhoneVisitInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.phoneVisitData?.firstChange) {
      this.getPhoneVisitInfo();
    }
    if (!changes.search?.firstChange) {
      this.applyFilter();
    }
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  getPhoneVisitInfo(): void {
    if(!this.dataSource){
      this.dataSource = new MatTableDataSource<PhoneVisit>(this.phoneVisitData);
      this.dataSource.paginator = this.paginator;
    }else{
      this.dataSource.data = this.phoneVisitData;
    }
    this.cdr.detectChanges();
  }

  handleToReport(element, type: string){
    const MODAL = this.modalService.open(ReportVisitComponent,{
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.info = { element, settings: this.getTypeOfInfo(type) };
    MODAL.result.then((data) => {
      if(data == "success"){
        this.reload.emit(true);
      }
    });
  }

  getTypeOfInfo(type: string): any {
    switch(type){
      case 'call':
        return { title: "Reportar Llamada", type };

      case 'visited':
        return { title: "Reportar Visita", type };
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  
}
