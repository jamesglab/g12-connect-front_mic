import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { editHostLeader } from 'src/app/_helpers/tools/parsedata/parse-data-send.tool';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LeadersService } from '../../../_services/leaders.service';
import { LeaderHost } from '../../../_models/leader.model';
import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-edithostleader',
  templateUrl: './edithostleader.component.html',
  styleUrls: ['./edithostleader.component.scss']
})
export class EdithostleaderComponent implements OnInit {

  public leaderItem: LeaderHost = null;

  public ready: boolean = false;
  public submit: boolean = false;
  public editLeaderForm: FormGroup;

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private _leadersService: LeadersService) {
    this.isLoading$ = this._leadersService.isLoading$;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForm();
      this.ready = true;
    }, 200)
  }

  buildForm(): void {
    this.editLeaderForm = this.fb.group({
      names: [this.leaderItem.name, [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      surNames: [this.leaderItem.lastName, [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: [this.leaderItem.email,[Validators.required, Validators.email]],
      mobile: [this.leaderItem.movil, [Validators.required, Validators.pattern(/[0-9]/)]],
      phone: [this.leaderItem.phone, [Validators.pattern(/[0-9]/)]],
      address: [this.leaderItem.address, [Validators.required, Validators.minLength(8)]]
    });
  }

  get form() {
    return this.editLeaderForm.controls;
  }

  onSubmit() {
    // loading
    this.submit = true;
    if (this.editLeaderForm.invalid) {
      return
    }
    const updateGoSubscr = this._leadersService
      .updateHostLeader(editHostLeader({
        ...this.leaderItem,
      ...this.editLeaderForm.getRawValue()
       })).subscribe((res: Response) => {
        if(res){
          if(res.result){
            this.submit = false;
            this.showMessage(1,"¡El lider ha sido actualizado con exito!");
            this.modal.close('success');
          }else{
            this.showMessage(2, res.message[0]);
          }
        }else{
          this.showMessage(3)
        }
      });
    this.unsubscribe.push(updateGoSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
