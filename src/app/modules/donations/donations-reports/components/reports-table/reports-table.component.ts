import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss']
})
export class ReportsTableComponent implements OnInit {


  @Input() dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public search = new FormControl('', []);
  public displayedColumns: string[] = ['created_at', 'amount', 'payment_method', 'status', 'identification', 'name', 'last_name', 'email'];
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
  }
}
