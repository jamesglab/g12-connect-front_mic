import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoleComponent } from '../components/add-role/add-role.component';
import { AdminRolesService } from '../../../_services/admin-roles.service';

@Component({
  selector: 'app-main-roles',
  templateUrl: './main-roles.component.html',
  styleUrls: ['./main-roles.component.scss']
})
export class MainRolesComponent implements OnInit {

  constructor(private modalService: NgbModal, private adminRolesService: AdminRolesService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  //CREAMOS UN ROL
  handleCreate(event: any) {
    event.preventDefault();
    const MODAL = this.modalService.open(AddRoleComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    // MODAL.componentInstance.leaderItem = element;
    MODAL.result.then((data) => {
      if (data == 'success') {
        //RECARGAMOS LOS DATOS DE LA TABLA
        this.adminRolesService.handleReload();
        this.cdr.detectChanges();
      }
    });
  }

}
