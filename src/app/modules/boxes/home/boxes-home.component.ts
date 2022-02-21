import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { StorageService } from '../../auth/_services/storage.service';
import { BoxService } from './_services/Boxes.service';

@Component({
  selector: 'app-boxes-home',
  templateUrl: './boxes-home.component.html',
  styleUrls: ['./boxes-home.component.scss'],
})

export class BoxesHomeComponent implements OnInit {

  public box: any;
  public events: any = [];

  constructor(
    private _boxService: BoxService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.validateUserBox();
    this.getEventsBox();
  }

  //VALIDAMOS LA CAJA DEL USUARIO
  validateUserBox() {
    this._boxService.findBoxByUser().subscribe((res: any) => {
      //ASIGNAMOS LA CAJA CONSULTADA DEL USUARIO
      this.box = res;
      console.log(this.box);
      this.cdr.detectChanges();
    }, err => {
      //MOSTRAMOS EL ERROR DE QUE EL USUARIO NO TIENE LA CAJA
      Swal.fire(err ? err : 'Usuario sin caja asignada', '', 'error');
      throw err;
    });
  }

  getEventsBox() {
    this._boxService.getEventsBox().subscribe((res: any) => {
      this.events = res;
      this.cdr.detectChanges();
    }, err => {
      throw err;
    });
  }
}
