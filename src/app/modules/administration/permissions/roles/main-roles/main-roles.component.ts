import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoleComponent } from '../components/add-role/add-role.component';

@Component({
  selector: 'app-main-roles',
  templateUrl: './main-roles.component.html',
  styleUrls: ['./main-roles.component.scss']
})
export class MainRolesComponent implements OnInit {

  public reload: boolean = false;
  constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  handleCreate(event: any){
    event.preventDefault();
    const MODAL = this.modalService.open(AddRoleComponent,{
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
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
