import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table-reports',
  templateUrl: './table-reports.component.html',
  styleUrls: ['./table-reports.component.scss']
})
export class TableReportsComponent implements OnInit {


  @Input() dataSource: any;
  @Output() paginator = new EventEmitter<any>();
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() count = 0;
  public search = new FormControl('', []);
  public displayedColumns: string[] = ['payment_method', 'reference', 'status', 'identification', 'name', 'last_name', 'email'];
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges() {
    // if (this.dataSource) {
    //   this.dataSource.paginator = this.paginator;
    // }
  }

  // filter() {
  //   this.dataSource.filter = this.search.value.trim().toLowerCase();
  // }

  emitPage(event) {
    this.paginator.emit(event);

  }
}
