import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-reports',
  templateUrl: './table-reports.component.html',
  styleUrls: ['./table-reports.component.scss']
})
export class TableReportsComponent implements OnInit {

  
  @Input() dataSource: any;
  public search = new FormControl('', []);
  public displayedColumns: string[] = ['created_at', 'event', 'payment_method',  'status', 'identification', 'name', 'last_name', 'email'];
  constructor() { }

  ngOnInit(): void {
  }

  filter() {
    this.dataSource.filter = this.search.value.trim().toLowerCase();
  }

}
