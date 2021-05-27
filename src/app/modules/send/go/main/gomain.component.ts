import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../auth/_services/storage.service';
import { UserModel } from '../../../auth/_models/user.model';

@Component({
  selector: 'app-go-main',
  templateUrl: './gomain.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
})
export class GoMainComponent implements OnInit {

  public currentUser: UserModel = this._storageService.getItem("user");
  public showVideo: boolean = true;
  
  constructor(private route: Router, private _storageService: StorageService) { }

  ngOnInit(): void {}

  handleNewGo(){
    this.route.navigate(['send/go/new'])
  }

}
