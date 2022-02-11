import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { getCurrentDate, toInsertHour, toInsertDate } from 'src/app/_helpers/tools/utils.tool';
import { hourValidation } from 'src/app/_helpers/tools/validators.tool';
import { DAYS_OF_WEEK } from 'src/app/_helpers/items/forSelect';

import { LeadersService } from '../../_services/leaders.service';
import { GoService } from '../../_services/goservice.service';
import { StorageService } from '../../../auth/_services/storage.service';

import { UserModel } from '../../../auth/_models/user.model';
import { Response } from '../../../auth/_models/auth.model';
import { LeaderHost } from '../../_models/leader.model';
import { GoType } from '../../_models/go.model';

@Component({
  selector: 'app-addgo',
  templateUrl: './addgo.component.html',
  styleUrls: ['./addgo.component.scss']
})
export class AddgoComponent implements OnInit {

  public currentUser: UserModel = this._storageService.getItem("user");
  public addGoForm: FormGroup;

  //FOR MIN & MAX VALIDATION
  public minDate: Date;
  public maxDate: Date;
  public showVideo: boolean = true;
  
  public daysOfWeek: {}[] = DAYS_OF_WEEK;
  public leaderShips: { code: string, id: number, name: string }[] = [];
  public hostLeaders: LeaderHost[] = [];
  public goTypes: GoType[] = [];

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  constructor(private _leadersService: LeadersService, private _goService: GoService,
    private _storageService: StorageService, public fb: FormBuilder,
    private router: Router, private snackBar: MatSnackBar) {
    this.isLoading$ = this._leadersService.isLoading$;
    const currentDate = new Date();
    this.minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getGoTypes();
    this.getLeaderShips();
    this.buildForm();
  }

  buildForm() {
    this.addGoForm = this.fb.group({
      typeGo: [null, [Validators.required]],
      leader: [null, [Validators.required]],
      host: [{ value: null, disabled: true }, [Validators.required]],
      openingDate: [{ value: '', disabled: true }, [Validators.required]],
      day: ['', [Validators.required]],
      hour: ['', [Validators.required, hourValidation.bind(this)]],
      statu: [true],
      creationUser: [this.currentUser.idUser],
      modificationUser: [this.currentUser.idUser],
      creationDate: [],
      modificationDate: [],
      reasonsClosing: [""]
    })
  }

  get form() {
    return this.addGoForm.controls;
  }

  getGoTypes() {
    this.hasError = false;
    const goTypesSubscr = this._goService
      .getGoTypes().subscribe((res: Response) => {
        if (res.result) {
          res.entity.map(item => {
            if(item.idType == 5 || item.idType == 4){
              item.codigo = "CÉLULA";
            }
          })
          this.goTypes = res.entity || [];
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(goTypesSubscr);
  }

  getLeaderShips() {
    this.hasError = false;
    const leaderShipsDataSubscr = this._leadersService
      .getLeaderShips({ idUser: this.currentUser.idUser }).subscribe((res: Response) => {
        if (res.result) {
          this.leaderShips = res.entity || [];
        } else {
          this.hasError = true;
          this.leaderShips = [];
        }
      });
    this.unsubscribe.push(leaderShipsDataSubscr);
  }

  getHostLeadersX(idLeader: string) {
    this.hasError = false;
    const leaderHostDataSubscr = this._leadersService
      .getHostLeadersX({ idLeader: parseInt(idLeader) }).subscribe((res: Response) => {
        this.hostLeaders = res.entity || [];
        this.form.host.enable();
      }, err => {
        this.hostLeaders = [];
        this.form.host.enable();
        this.showMessage(2, "No hemos podido encontrar lideres asociados")
        // this.showMessage(3, err.error.message);
      });
    this.unsubscribe.push(leaderHostDataSubscr);
  }

  onSubmit() {

    if (this.addGoForm.invalid) {
      return;
    }

    this.parseAttrToInsert();
    const addGoSubscr = this._goService.insertGo(this.addGoForm.getRawValue())
      .subscribe((res: Response) => {
        if (res.result) {
          this.showMessage(1, "!La nueva célula ha sido registrada con exito¡");
          this.router.navigate(['send'])
        } else {
          this.form.creationUser.setValue(this.currentUser.idUser);
          this.form.modificationUser.setValue(this.currentUser.idUser);
          this.showMessage(res.notificationType, res.message[0])
        }
      }, err => {
        this.form.creationUser.setValue(this.currentUser.idUser);
        this.form.modificationUser.setValue(this.currentUser.idUser);
        this.showMessage(3, err.error.message);
      })
    this.unsubscribe.push(addGoSubscr);
  }

  parseAttrToInsert() {
    this.addGoForm.controls.hour.setValue(getCurrentDate("YYYY-MM-DD") + "T" + toInsertHour(this.addGoForm.controls.hour.value));
    this.addGoForm.controls.leader.setValue(parseInt(this.addGoForm.controls.leader.value));
    this.addGoForm.controls.host.setValue(parseInt(this.addGoForm.controls.host.value));
    this.addGoForm.controls.typeGo.setValue(parseInt(this.addGoForm.controls.typeGo.value));
    this.addGoForm.controls.openingDate.setValue(toInsertDate(this.addGoForm.controls.openingDate.value, "YYYY-MM-DDTHH:mm:ss"));
    this.addGoForm.controls.creationDate.setValue(getCurrentDate("YYYY-MM-DD"));
    this.addGoForm.controls.modificationDate.setValue(getCurrentDate("YYYY-MM-DD"));
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
