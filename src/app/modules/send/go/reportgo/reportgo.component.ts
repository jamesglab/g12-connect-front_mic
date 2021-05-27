import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GoService } from '../../_services/goservice.service';

import { Response } from '../../../auth/_models/auth.model';
import { UserModel } from '../../../auth/_models/user.model';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';

@Component({
  selector: 'app-reportgo',
  templateUrl: './reportgo.component.html',
  styleUrls: ['./reportgo.component.scss']
})
export class ReportgoComponent implements OnInit {

  public _id: number;
  public currentUser: UserModel = this._storageService.getItem("user");

  public assistantsArrived: { idMember: number }[] = []; // PEOPLE THAT ASSITS TO GO
  public assistants: {}[] = []; //ALL PEOPLE OF GO

  private unsubscribe: Subscription[] = [];

  constructor(private route: ActivatedRoute, private _goService: GoService,
    private _storageService: StorageService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.getAssistants();
  }

  getAssistants() {
    const assistantsListSubscr = this._goService
      .getAssistantsList({ id: this._id }).subscribe((res: Response) => {
        if (res.result) {
          this.assistants = res.entity;
          this.cdr.detectChanges();
        } else {
          //show notification 
        }
      });
    this.unsubscribe.push(assistantsListSubscr);
  }

  markListAssistant(element) {
    if(element.status){
      this.assistantsArrived.push(element.member);
    }else{
      let index = this.assistantsArrived.findIndex(item => item.idMember === element.member.idMember);
      this.assistantsArrived.splice(index, 1);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
