import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from '../../../auth/_services/storage.service';
import { ExportService } from '../../../_services/export.service';

import { AddhostleaderComponent } from '../components/addhostleader/addhostleader.component';

import { LeaderHost } from '../../_models/leader.model';
import { UserModel } from '../../../auth/_models/user.model';

@Component({
  selector: 'app-goleaders',
  templateUrl: './goleaders.component.html',
  styleUrls: ['./goleaders.component.scss']
})
export class GoleadersComponent implements OnInit {

  public currentUser: UserModel = this._storageService.getItem("user");
  public currentLeaders: LeaderHost[] = []; 

  constructor(private _storageService: StorageService, private _exportService: ExportService,
    public modalService: NgbModal) { }

  ngOnInit(): void {}

  onRenderData($event: LeaderHost[]){
    this.currentLeaders = $event;
  }

  handleAdd(){
    const MODAL = this.modalService.open(AddhostleaderComponent,{
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.result.then((data) => {
      // on close
      // this.getHostLeaders();
    }, (reason) => {
      // on dismiss
    });
  }

  exportArchive(): void {
    let header = { 
      documentNumber: "Documento",
      name: "Nombre",
      lastName: "Apellido",
      email: "Correo",
      phone: "Teléfono",
      movil: "Celular",
    };
    let data = this._exportService.buildData(header, this.currentLeaders);
    setTimeout(()=>{ this._exportService.exportAsExcelFile(data,'consolidated') },200)
  }

}
