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

  handleCreate(event: any){
    event.preventDefault();
    const MODAL = this.modalService.open(AddObjectComponent,{
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
