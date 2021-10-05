import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserMinistryComponent } from '../edit-user-ministry/edit-user-ministry.component';

@Component({
  selector: 'app-ministry',
  templateUrl: './ministry.component.html',
  styleUrls: ['./ministry.component.scss']
})

export class MinistryComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'last_name', 'phone', 'options'];

  @Input() user: any;
  @Input() ministry;
  @Input() count;
  @Output() paginator = new EventEmitter<any>();

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }


  openUser() {
    const MODAL = this.modalService.open(EditUserMinistryComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    MODAL.componentInstance.user = this.user;
    // MODAL.result.then((data) => {
    //   if (data == "success") {
    //     this.getAllEvents();
    //   }
    // });

  }

  paginationOut(event) {
    this.paginator.emit(event);
  }

}
