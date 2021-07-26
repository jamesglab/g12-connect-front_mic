import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-report-not-pastor',
  templateUrl: './edit-report-not-pastor.component.html',
  styleUrls: ['./edit-report-not-pastor.component.scss']
})
export class EditReportNotPastorComponent implements OnInit {
  report: any;
  constructor() { }

  ngOnInit(): void {
    console.log('report not pastor to edit', this.report)
  }

}
