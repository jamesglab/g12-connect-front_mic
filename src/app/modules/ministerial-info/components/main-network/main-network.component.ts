import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/modules/_services/user.service';
import { EditUserMinistryComponent } from '../edit-user-ministry/edit-user-ministry.component';

@Component({
  selector: 'app-main-network',
  templateUrl: './main-network.component.html',
  styleUrls: ['./main-network.component.scss']
})
export class MainNetworkComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'last_name', 'phone', 'options'];
  @Input() leaders;
  constructor(private _userService: UserService, private modalService: NgbModal,) { }

  ngOnInit(): void {
  }


  openUser(element, i) {
    this._userService.finOne({ id: element.id }).subscribe(res => {
      const modal  = this.modalService.open(EditUserMinistryComponent,{
        windowClass: 'fadeIn',
        size: 'xl',
        backdrop: true,
        keyboard: true,
        centered: true
      }) 
      modal.componentInstance.user = res ;
    })
  }
}
