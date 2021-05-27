import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../../auth/_services/storage.service';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GoService } from '../../../_services/goservice.service';
import { Go } from '../../../_models/go.model';
import { UserModel } from '../../../../auth/_models/user.model';
import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-closego',
  templateUrl: './closego.component.html',
  styleUrls: ['./closego.component.scss']
})
export class ClosegoComponent implements OnInit {

  public goItem: Go = null;
  public currentUser: UserModel = this._storageService.getItem("user");

  public ready: boolean = false;
  public submit: boolean = false;
  public closeGoForm: FormGroup;

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  constructor(public modal: NgbActiveModal, public fb: FormBuilder,
    private _storageService: StorageService, 
    private snackBar: MatSnackBar, private _goService: GoService ) { 
    this.isLoading$ = this._goService.isLoading$;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    setTimeout(()=>{
      this.closeGoForm = this.fb.group({
        reazon: [null, [Validators.required, Validators.pattern(/[a-zA-Z0-9-óíé]+/)]],
      });
      this.ready = true;
    },200)
  }

  get form() {
    return this.closeGoForm.controls;
  }

  onSubmit() {

    this.submit = true;
    if (this.closeGoForm.invalid) {
      return
    }
    const { id } = this.goItem;
    const deleteGoSubscr = this._goService
      .deleteGo({ IdCelula: id, MotivoCierre: this.form.reazon.value, IdUsuarioModificacion: this.currentUser.idUser })
      .subscribe((res: Response) => {
        if(res){
          if (res.result) {
            // Try after
            this.showMessage(1,"¡Se ha cerrado la GO!");
            this.modal.close();
          } else {
            this.showMessage(2, res.message[0]);
          }
        }else{
          this.showMessage(3)
        }
      });
    this.unsubscribe.push(deleteGoSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
