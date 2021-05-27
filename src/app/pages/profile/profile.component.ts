import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../modules/_services/user.service';
import { StorageService } from '../../modules/auth/_services/storage.service';

import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { UserModel, ProfileUser } from '../../modules/auth/_models/user.model';
import { Response } from '../../modules/auth/_models/auth.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private currentUser: UserModel = this._storageService.getItem("user"); 
  public _user: ProfileUser;

  private unsubscribe: Subscription[] = [];

  constructor( private _storageService: StorageService, private _userService: UserService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { this.getUserInfo(); }

  getUserInfo(){
    const getUserInfoSubscr = this._userService
    .getUserInfo({ idUser: this.currentUser.idUser }).subscribe((res: Response) => {
      if (res.result) {
        this._user = res.entity[0];
        // console.log("profile", this._user);
        this.cdr.detectChanges();
      } else {
        // console.log("Error", res)
      }
    });
  this.unsubscribe.push(getUserInfoSubscr);
  }

  onChangePassword(){
    const MODAL = this.modalService.open(UpdatePasswordComponent,{
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    // MODAL.componentInstance.goItem = element;
    MODAL.result.then((data) => {
      if(data == "success"){
        // this.getGoData();
      }
    }, (reason) => {
      console.log("Reason", reason)
    });
  }

}
