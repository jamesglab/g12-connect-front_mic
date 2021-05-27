import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { numberOnly, toFailedStep } from 'src/app/_helpers/tools/validators.tool';
import { renderUpdatePerson, updatePerson, insertReportVisit } from 'src/app/_helpers/tools/parsedata/parse-data-towin.tool';
import { REPORT_PHONE_VISIT } from 'src/app/_helpers/items/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from '../../../../auth/_models/auth.model';

import { StorageService } from '../../../../auth/_services/storage.service';
import { MainService } from '../../../../_services/main.service';
import { PhoneVisitService } from '../../../_services/phone-visit.service';
import { PeopleService } from '../../../_services/people.service';

@Component({
  selector: 'app-report-visit',
  templateUrl: './report-visit.component.html',
  styleUrls: ['./report-visit.component.scss']
})
export class ReportVisitComponent implements OnInit {

  public currentUser: any = this._storageService.getItem("user");

  public documentTypes: any[] = [];
  public results: any[] = [];
  public civilStatus: any[] = [];
  public zones: any[] = [];
  public meetings: any[] = [];

  public reportVisitForm: FormGroup;
  public info: any = null;
  public step: number = 3;

  public isLoading: any = { insert: false };

  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    private _phoneVisitService: PhoneVisitService, private _storageService: StorageService,
    private _peopleService: PeopleService, private _mainService: MainService,
    public fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.buildForm();
    this.getPersonData();
    this.getDocumentTypes();
    this.getZone();
    this.getCivilStatus();
    this.getMeetings();
    this.getResultsPhoneVisit();
    this.validateIfReportAgain();
  }

  buildForm() {
    this.reportVisitForm = this.fb.group(REPORT_PHONE_VISIT);
  }

  numberOnly($event): boolean { return numberOnly($event); }

  get form() {
    return this.reportVisitForm.controls;
  }

  renderData(person) {
    this.reportVisitForm.patchValue(renderUpdatePerson(person));
    this.validateDisabled();
  }

  validateDisabled(): void {

    let docNumber: string = this.form.documentNumber.value;
    let person: string = this.form.personInvites.value;
    let meet: string = this.form.idMeeting.value;
    let petition: string = this.form.petition.value;

    if (!docNumber) {
      this.form.idDocumentType.enable();
      this.form.documentNumber.enable();
    }
    if (!person) {
      this.form.personInvites.enable();
    }
    if (!meet || meet == "0") {
      this.form.idMeeting.enable();
    }
    if (!petition) {
      this.form.petition.enable();
    }
  }

  validateIfReportAgain(){
    if(this.info.element[this.info.settings.type]){
     this.info.isAgain = true;
    }
  }

  getPersonData() {
    const getPersonSubscr = this._peopleService
      .searchPerson({ Filter: "IDGANAR", IdWin: this.info.element.idWin }).subscribe((res: Response) => {
        this.renderData(res.entity[0])
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getPersonSubscr);
  }

  getDocumentTypes() {
    const getDocSubscr = this._mainService
      .getDocumentTypes().subscribe((res: Response) => {
        this.documentTypes = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getDocSubscr);
  }

  getCivilStatus() {
    const getCivilSubscr = this._mainService
      .getCivilStatus().subscribe((res: Response) => {
        this.civilStatus = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getCivilSubscr);
  }

  getZone() {
    const getCivilSubscr = this._peopleService
      .getZone(this.currentUser.idSede).subscribe((res: Response) => {
        this.zones = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getCivilSubscr);
  }

  getMeetings() {
    const getMeetingSubscr = this._mainService
      .getMeetings(this.currentUser.idSede).subscribe((res: Response) => {
        this.meetings = res.entity || [];
        this.cdr.detectChanges();
      })
    this.unsubscribe.push(getMeetingSubscr);
  }

  getResultsPhoneVisit() {
    const getResultsDataSubscr = this._phoneVisitService
      .getPhoneVisitResults().subscribe((res: Response) => {
        this.results = res.entity || [];
        this.cdr.detectChanges();
      }, err => { throw err; });
    this.unsubscribe.push(getResultsDataSubscr);
  }

  onSubmit() {
    this.form.IdWin.setValue(this.info.element.idWin);
    this.form.IdUser.setValue(this.currentUser.idUser);
    if (this.reportVisitForm.invalid) {
      this.setStep(toFailedStep(this.form));
      return;
    }
    const updatePersonSubscr = this._peopleService
      .updatePerson(updatePerson(this.reportVisitForm.getRawValue())).subscribe((res: Response) => {
        if (res.result) {
          this.showMessage(1, "La información de " + this.form.names.value + " ha sido actualizada con exito!");
          this.addPhoneVisit();
        } else {
          this.showMessage(res.notificationType, res.message[0])
        }
      }, err => {
        // this.showMessage(3, err.error.entity[0].message)
        throw err;
      });
    this.unsubscribe.push(updatePersonSubscr);
  }

  addPhoneVisit() {
    const updatePersonSubscr = this._phoneVisitService
      .addPhoneVisit(insertReportVisit(this.reportVisitForm.getRawValue(), this.info.settings.type)).subscribe((res: Response) => {
        if (res.result) {
          this.showMessage(1, "La fono-visita ha sido registrada con exito!");
          this.modal.close("success")
        } else {
          this.showMessage(res.notificationType, res.message[0])
        }
      }, err => {
        throw err;
      });
    this.unsubscribe.push(updatePersonSubscr);
  }

  setStep(index: number) { this.step = index; }

  nextStep() { this.step++; }

  prevStep() { this.step--; }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
