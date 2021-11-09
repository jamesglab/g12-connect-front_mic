import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddObjectComponent } from '../components/add-object/add-object.component';

@Component({
  selector: 'app-main-objects',
  templateUrl: './main-objects.component.html',
  styleUrls: ['./main-objects.component.scss']
})
export class MainObjectsComponent implements OnInit {

  public reload: boolean = false;
  constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  //METODO PARA ABRIR MODAL DE CREACION DE PERMISO 
  handleCreate(event: any){
    event.preventDefault();
    //CREAMOS EL MODAL Y ABRIMOS EL COMPONENTE DE AddObjectComponent 
    const MODAL = this.modalService.open(AddObjectComponent,{
      size: 'sm',
      centered: true
    })
    // MODAL.componentInstance.leaderItem = element;
    MODAL.result.then((data) => {
      if(data == 'success'){
        this.reload = true;
        this.cdr.detectChanges();
      }
    }, (reason) => {
      console.log("Reason", reason)
      // on dismiss
    });
  }

}
