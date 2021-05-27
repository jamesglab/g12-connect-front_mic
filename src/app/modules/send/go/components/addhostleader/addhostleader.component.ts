import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from '../../../../auth/_services/storage.service';
import { LeadersService } from '../../../_services/leaders.service';
import { MainService } from '../../../../_services/main.service';

import { LeaderHost } from '../../../_models/leader.model';
import { Response } from '../../../../auth/_models/auth.model';
import { UserModel } from '../../../../auth/_models/user.model';

@Component({
  selector: 'app-addhostleader',
  templateUrl: './addhostleader.component.html',
  styleUrls: ['./addhostleader.component.scss']
})
export class AddhostleaderComponent implements OnInit {

  private currentUser: UserModel = this._storageService.getItem("user");
  public ready: boolean = false;
  public submit: boolean = false;
  public addLeaderForm: FormGroup;

  public documentTypes: { code: string, description: string, id: number }[] = [];

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  constructor(public modal: NgbActiveModal, public fb: FormBuilder, private _storageService: StorageService,
    private _leadersService: LeadersService, private _mainService: MainService
    ,private snackBar: MatSnackBar) {
    this.isLoading$ = this._leadersService.isLoading$;
  }

  ngOnInit(): void {
    this.buildForm();
    this.getDocumentTypes();
  }

  buildForm(): void {
    this.addLeaderForm = this.fb.group({
      documentType: [null, [Validators.required]],
      document: [null, [Validators.required, Validators.pattern(/[0-9]/), Validators.minLength(6)]],
    });
  }

  get form() {
    return this.addLeaderForm.controls;
  }

  getDocumentTypes() {
    this.hasError = false;
    const getDocTypesSubscr = this._mainService
      .getDocumentTypes().subscribe((res: Response) => {
        if (res.result) {
          this.ready = true;
          this.documentTypes = res.entity;
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(getDocTypesSubscr);
  }

  onSubmit() {
    // loading
    this.submit = true;
    if (this.addLeaderForm.invalid) {
      return;
    }
    this.hasError = false;
    const { documentType } = this.addLeaderForm.getRawValue();
    const getHostLeaderSubscr = this._leadersService
      .getHostLeader({ ...this.addLeaderForm.getRawValue(), documentType: parseInt(documentType), idUser: this.currentUser.idUser })
      .subscribe((res: Response) => {
        if (res) {
          if (res.result) {
            this.insertLeader(res.entity[0]);
          } else {
            this.showMessage(2, res.message[0]);
          }
        }
      }, err => {
        this.showMessage(3, err.error.message);
      });
    this.unsubscribe.push(getHostLeaderSubscr);
  }

  insertLeader(leaderHost: LeaderHost) {
    const insertHostLeaderSubscr = this._leadersService
      .insertHostLeader({ idUser: this.currentUser.idUser, ganarMCI: leaderHost.idGanarMCI })
      .subscribe((res: Response) => {
        if (res) {
          if (res.result) {
            this.showMessage(1, "El lider ha sido registrado con exito");
            this.modal.close('success');
          }else{
            this.showMessage(res.notificationType,res.message[0]);
          }
        }
      }, err => {
        this.showMessage(3, err.error.message);
      })
    this.unsubscribe.push(insertHostLeaderSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
