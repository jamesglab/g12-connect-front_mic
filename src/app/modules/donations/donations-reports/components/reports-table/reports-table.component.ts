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
  public displayedColumns: string[] = [
    'reference',
    'name',
    'last_name',
    'document',
    'phone',
    'email',
    'offering_value',
    'offering_type',
    'payment',
    'created_at',
    'petition',
    'country'
  ];
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
