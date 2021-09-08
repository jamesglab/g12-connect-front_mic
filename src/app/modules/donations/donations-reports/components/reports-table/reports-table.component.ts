import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

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
    'country'
  ];
  constructor() { }

  ngOnInit(): void {
  }
  filter() {
    // this.dataSource.filter = this.search.value.trim().toLowerCase();
  }
  pageChanged(event) {
  }

  emitPageData(paginator) {
    this.emitPage.emit(paginator)
  }
}
