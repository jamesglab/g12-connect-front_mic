import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-cut',
  templateUrl: './table-cut.component.html',
  styleUrls: ['./table-cut.component.scss']
})
export class TableCutComponent implements OnInit {
  @Input() dataSource;
  public displayedColumns: string[] = ['created_at', 'event', 'status', 'identification', 'name', 'last_name', 'email'];
  constructor() { }

  ngOnInit(): void {
  }

}
