import { Component, Input, OnInit } from '@angular/core';
import { BoxService } from '../_services/Boxes.service';

@Component({
  selector: 'app-box-reports',
  templateUrl: './box-reports.component.html',
  styleUrls: ['./box-reports.component.scss'],
})
export class BoxReportsComponent implements OnInit {
  @Input() box;
  constructor(public _boxService: BoxService) {}

  ngOnInit(): void {
    this.getUserBox();
  }

  getUserBox() {
    this._boxService.findBoxByUser().subscribe((res) => {
      this.box = res;
    });
  }
}
