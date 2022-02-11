import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import Swal from 'sweetalert2';
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
    private storageService: StorageService,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserBox();
  }

  getUserBox() {
    try {
      this._boxService.findBoxByUser().subscribe(
        (res) => {
          this.box = res;
          this.cdr.detectChanges();
        },
        (err) => {
          throw new Error(err);
        }
      );
    } catch (error) {
      Swal.fire(error.message ? error.message : 'Tenemos error', '', 'error');
    }
  }
}
