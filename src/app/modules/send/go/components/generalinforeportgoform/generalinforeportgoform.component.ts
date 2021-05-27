import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { GoService } from '../../../_services/goservice.service';
import { WEEKS_OF_MONTH, GET_MONTHS, YEARS } from 'src/app/_helpers/items/forSelect';

import { Response } from '../../../../auth/_models/auth.model';
import { UserModel } from '../../../../auth/_models/user.model';

@Component({
  selector: 'app-generalinforeportgoform',
  templateUrl: './generalinforeportgoform.component.html',
  styleUrls: ['./generalinforeportgoform.component.scss']
})
export class GeneralinforeportgoformComponent implements OnInit {

  @Input() public goId: number;
  @Input() public currentUser: UserModel;
  @Input() public assistants: { idMember: number }[] = [];

  public generalInfoForm: FormGroup;
  public weeksOfMonth: {}[] = [];
  public monthsforSelect: {}[] = GET_MONTHS(new Date().getFullYear());
  public yearsforSelect: {}[] = YEARS();

  public isLoading$: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(private _goService: GoService, private snackBar: MatSnackBar,
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
    // this.getCellById();
  }

  buildForm() {
    this.generalInfoForm = this.fb.group({
      done: [null, [Validators.required]],
      moth: [null, [Validators.required]],
      week: [{ value: '', disabled: true }, [Validators.required]],
      theme: ['', [Validators.required, Validators.pattern(/[a-zA-ZáÁóÓíÍ]/)]],
      idGo: [null, [Validators.required]],
      listAssistant: [[]],
      year: [null, [Validators.required]]
    })
  }

  get form() {
    return this.generalInfoForm.controls;
  }

  ngOnChanges(changes: SimpleChanges) { }

  setDisabled(select: string){
      if(select == "month"){
      this.weeksOfMonth = WEEKS_OF_MONTH(this.form.moth.value, parseInt(this.form.year.value));
      this.form.week.enable();
    }
  }

  onChangeYear(year: string): void {
    this.monthsforSelect = GET_MONTHS(parseInt(year));
    this.weeksOfMonth = WEEKS_OF_MONTH(this.form.moth.value, parseInt(year))
  }

  // getCellById(){
  //   const getCellByIdSubscr = this._goService
  //   .getCellById({ IdUser: this.currentUser.idUser, IdGo: this.goId })
  //   .subscribe((res: Response) => {
  //     this.weeksOfMonth = 
  //   }, err => { 
  //     this.showMessage(3, err.error.message); 
  //   });
  //   this.unsubscribe.push(getCellByIdSubscr);
  // }

  onSubmit(): void {
    this.form.idGo.setValue(this.goId);
    this.form.listAssistant.setValue(this.assistants);
    if (this.generalInfoForm.invalid) {
      return;
    }
    this.parseAttrMustNumbers();
    const insertGoReportSubscr = this._goService
      .insertReportOfGo(this.generalInfoForm.getRawValue())
      .subscribe((res: Response) => {
          if (res.result) {
            this.showMessage(1, "¡La información ha sido registrada correctamente!");
            this.router.navigate(['send'])
          } else {
            this.showMessage(2, res.message[0]);
          }
      }, err => {
        this.showMessage(3, err.error.message);
      });
    this.unsubscribe.push(insertGoReportSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  parseAttrMustNumbers(): void {
    this.generalInfoForm.controls.done.setValue((String(this.generalInfoForm.controls.done.value) == "true"));
    this.generalInfoForm.controls.moth.setValue(parseInt(this.generalInfoForm.controls.moth.value));
    this.generalInfoForm.controls.week.setValue(parseInt(this.generalInfoForm.controls.week.value));
    this.generalInfoForm.controls.year.setValue(parseInt(this.generalInfoForm.controls.year.value));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
