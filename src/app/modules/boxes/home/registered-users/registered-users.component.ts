import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailRegisterComponent } from '../detail-register/detail-register.component';
import { RegisterUserBoxComponent } from '../register-user-box/register-user-box.component';
import { BoxService } from '../services/g12events.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss'],
})
export class RegisteredUsersComponent implements OnInit {
  @Input() box;

  displayedColumns: string[] = [
    'position',
    'name',
    'name1',
    'name2',
    'name3',
    'name5',
    'name6',
    'weight',
    'symbol',
  ];
  dataSource = ELEMENT_DATA;

  constructor(
    private modalService: NgbModal,
    private _boxService: BoxService
  ) {}

  ngOnInit(): void {
    this.getTransactionsByBox();
  }

  getTransactionsByBox() {
    this._boxService.getTransactionsByBox(this.box.id).subscribe(
      (res) => {
        console.log('transacciones por caja', res);
      },
      (err) => {
        throw err;
      }
    );
  }
  openUsersModal(element) {
    const modale = this.modalService.open(DetailRegisterComponent, {
      centered: true,
      size: 'xl',
    });
  }

  registerUser() {
    const modale = this.modalService.open(RegisterUserBoxComponent, {
      centered: true,
      size: 'xl',
    });
    modale.componentInstance.box = this.box;
  }
}
