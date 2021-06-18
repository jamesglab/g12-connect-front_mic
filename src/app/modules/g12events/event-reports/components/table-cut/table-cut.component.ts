import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table-cut',
  templateUrl: './table-cut.component.html',
  styleUrls: ['./table-cut.component.scss']
})
export class TableCutComponent implements OnInit {
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
