import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { DAYS_OF_WEEK } from 'src/app/_helpers/items/forSelect';
import { hourValidation } from 'src/app/_helpers/tools/validators.tool';
import { toInsertHour } from 'src/app/_helpers/tools/utils.tool';

import { GoService } from '../../../_services/goservice.service';
import { Go, GoType } from '../../../_models/go.model';
import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-editgo',
  templateUrl: './editgo.component.html',
  styleUrls: ['./editgo.component.scss']
})
export class EditgoComponent implements OnInit {

  public goItem: Go = null;
  public daysOfWeek: { id: string, name: string }[] = DAYS_OF_WEEK;
  public goTypes: GoType[] = [];

  public ready: boolean = false;
  public submit: boolean = false;
  public editGoForm: FormGroup;

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];
  public hasError: boolean;

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private _goService: GoService) {
    this.isLoading$ = this._goService.isLoading$;
  }

  ngOnInit(): void {
    this.buildForm();
    this.getGoTypes();
  }

  buildForm(): void {
    setTimeout(() => {
      this.editGoForm = this.fb.group({
        IdGo: [this.goItem.id],
        DateOpening: [this.goItem.creationDate],
        Day: [this.goItem.day, [Validators.required]],
        Hour: [this.parseHourRender(this.goItem.hour), [Validators.required, hourValidation.bind(this)]],
        TypeGo: [this.goItem.idType.toString(), [Validators.required]],
        IdLeader: [this.goItem.idLeader],
        IdHost: [this.goItem.idHost],
        State: [this.goItem.status.toString(), [Validators.required]],
        ModificationUser: [1]
      });
      this.ready = true;
    }, 200)
  }

  get form() {
    return this.editGoForm.controls;
  }

  parseHourRender(hour: string) {
    return {
      "hour": parseInt(hour.split("T")[1].split(":")[0]),
      "minute": parseInt(hour.split("T")[1].split(":")[1]),
      "second": 0
    }
  }

  getGoTypes() {
    this.hasError = false;
    const goTypesSubscr = this._goService
      .getGoTypes().subscribe((res: Response) => {
        if (res.result) {
          this.goTypes = res.entity || [];
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(goTypesSubscr);
  }

  onSubmit() {

    this.submit = true;
    if (this.editGoForm.invalid) {
      return;
    }
    const updateGoSubscr = this._goService
      .updateGo(this.parseDataToInsert())
      .subscribe((res: Response) => {
        if (res.result) {
          this.submit = false;
          this.showMessage(1, "¡La GO ha sido actualizada con exito!");
          setTimeout(() => { this.modal.close("success"); })
        } else {
          this.showMessage(2, res.message[0]);
        }
      }, err => {
        this.showMessage(3, err.error.message);
      });
    this.unsubscribe.push(updateGoSubscr);
  }

  parseDataToInsert() {
    const { Hour, State, TypeGo } = this.editGoForm.getRawValue();
    return {
      ...this.editGoForm.getRawValue(),
      IdGo: this.goItem.id,
      Hour: toInsertHour(Hour),
      TypeGo: parseInt(TypeGo),
      State: (State == "true"),
      ModificationUser: 1
    }
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
