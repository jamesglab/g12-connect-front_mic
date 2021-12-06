import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { StorageService } from '../../auth/_services/storage.service';
import { BoxService } from './services/Boxes.service';

@Component({
  selector: 'app-boxes-home',
  templateUrl: './boxes-home.component.html',
  styleUrls: ['./boxes-home.component.scss'],
})
export class BoxesHomeComponent implements OnInit {
  public box;

  constructor(
    private _boxService: BoxService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.validateUserBox();
  }

  //VALIDAMOS LA CAJA DEL USUARIO
  validateUserBox() {
    this._boxService.findBoxByUser().subscribe(
      (res) => {
        //ASIGNAMOS LA CAJA CONSULTADA DEL USUARIO
        this.box = res;
        this.cdr.detectChanges();
      },
      (err) => {
        //MOSTRAMOS EL ERROR DE QUE EL USUARIO NO TIENE LA CAJA
        Swal.fire(err ? err : 'Usuario sin caja asignada', '', 'error');
      }
    );
  }
}
