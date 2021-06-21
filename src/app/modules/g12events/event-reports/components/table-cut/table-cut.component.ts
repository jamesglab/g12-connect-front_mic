import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-cut',
  templateUrl: './table-cut.component.html',
  styleUrls: ['./table-cut.component.scss']
})
export class TableCutComponent implements OnInit {
  @Input() dataSource: any;
  dataSourceTable: any = new MatTableDataSource<any[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public search = new FormControl('', []);
  public displayedColumns: string[] = ['created_at', 'event', 'payment_method', 'status', 'identification', 'name', 'last_name', 'email'];
  constructor() { 
    
  }

  ngOnInit(): void {

  }
  ngOnChanges() {
    this.dataSourceTable.data = this.dataSource;
    this.dataSourceTable.paginator = this.paginator;

  }
  filter() {
    this.dataSourceTable.filter = this.search.value.trim().toLowerCase();
  }
}
