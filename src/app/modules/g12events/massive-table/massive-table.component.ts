import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserMassiveComponent } from './components/add-user/add-user.component';

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
]

@Component({
  selector: 'app-massive-table',
  templateUrl: './massive-table.component.html',
  styleUrls: ['./massive-table.component.scss']
})

export class MassiveTableComponent implements OnInit {
  displayedColumns: string[] = ['event', 'quantity', 'cut', 'status', 'detail'];
  dataSource = ELEMENT_DATA;
  constructor(private modalService: NgbModal) { }



  ngOnInit(): void {
  }

  redirectToAdd() {

  }

  //ABRIREMOS EL MODAL PARA CAGREGAR UN USUARIO
  addUser() {
    //CONSUMIMOS EL ENDPOINT DE DETALLE DE UN EVENTO 

    //CREAMOE EL MODAL Y ABRIMOS EL COMPONENTE DE EditEventComponent
    const MODAL = this.modalService.open(AddUserMassiveComponent, {
      size: 'lg',//TAMAÑO DEL MODAL
      centered: true// CENTRAMOS EL MODAL
    })

    MODAL.result.then((data) => { //CONSULTAMOS LA RESPUESTA DEL MODAL
      if (data == "success") {//SI LA DATA ES SUCCESS
        
      }
    });
  }
}
