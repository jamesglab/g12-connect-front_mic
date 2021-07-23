import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table-reports',
  templateUrl: './table-reports.component.html',
  styleUrls: ['./table-reports.component.scss']
})
export class TableReportsComponent implements OnInit {


  @Input() dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public search = new FormControl('', []);
  public displayedColumns: string[] = ['reference', 'status', 'identification', 'name', 'last_name', 'email'];
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }
  filter() {
    this.dataSource.filter = this.search.value.trim().toLowerCase();
  }
  pageChanged(event) {
    console.log('page event', event)
  }
}
