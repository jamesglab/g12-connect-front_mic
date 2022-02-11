import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModaleTransactionComponent } from '../modale-transaction/modale-transaction.component';

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss']
})
export class ReportsTableComponent implements OnInit {


  @Input() dataSource: any;
  @Input() count: any;


  @Output() emitPage = new EventEmitter<any>()
  public search = new FormControl('', []);
  public displayedColumns: string[] = [
    'reference',
    'document',
    'phone',
    'email',
    'offering_value',
    'offering_type',
    'payment',
    'created_at',
    'country',
    'actions'
  ];
  constructor(
    private modalService: NgbModal

  ) { }

  ngOnInit(): void {
    setTimeout(() => {
    }, 1000);
  }
  filter() {
    // this.dataSource.filter = this.search.value.trim().toLowerCase();
  }
  pageChanged(event) {
  }

  emitPageData(paginator) {
    this.emitPage.emit(paginator)
  }


  openModaleCheck(element) {
    
    const MODAL = this.modalService.open(ModaleTransactionComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.transaction = element.transaction;

  }
}
