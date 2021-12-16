import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { BoxService } from '../_services/Boxes.service';

@Component({
  selector: 'app-box-reports',
  templateUrl: './box-reports.component.html',
  styleUrls: ['./box-reports.component.scss'],
})
export class BoxReportsComponent implements OnInit {
  public box;
  public permissions = this.storageService.getItem('permissions');
  constructor(
    public _boxService: BoxService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getUserBox();
  }

  getUserBox() {
    this._boxService.findBoxByUser().subscribe((res) => {
      this.box = res;
    });
  }
}
