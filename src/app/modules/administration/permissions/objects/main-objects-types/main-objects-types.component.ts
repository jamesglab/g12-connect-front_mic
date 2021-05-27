import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddObjectTypeComponent } from '../components/add-object-type/add-object-type.component';

@Component({
  selector: 'app-main-objects-types',
  templateUrl: './main-objects-types.component.html',
  styleUrls: ['./main-objects-types.component.scss']
})
export class MainObjectsTypesComponent implements OnInit {

  public reload: boolean = false;
  constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  handleCreate(event: any){
    event.preventDefault();
    const MODAL = this.modalService.open(AddObjectTypeComponent,{
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
