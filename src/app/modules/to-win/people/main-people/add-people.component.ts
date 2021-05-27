import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

import { numberOnly, toFailedStep } from 'src/app/_helpers/tools/validators.tool';
import { ADD_PERSON_FORM } from 'src/app/_helpers/items/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { insertPerson } from 'src/app/_helpers/tools/parsedata/parse-data-towin.tool';

import { StorageService } from '../../../auth/_services/storage.service';
import { MainService } from '../../../_services/main.service';
import { GoService } from '../../../send/_services/goservice.service';
import { LeadersService } from '../../../send/_services/leaders.service';
import { PeopleService } from '../../_services/people.service';
import { Response } from '../../../auth/_models/auth.model';

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styles: []
})
export class AddPeopleComponent implements OnInit {

  public currentUser: any = this._storageService.getItem("user");
  //FOR MIN & MAX VALIDATION
  public minDate: Date;
  public maxDate: Date;

  public documentTypes: any[] = [];
  public civilStatus: any[] = [];
  public zones: any[] = [];
  public pastors: any[] = [];

  public leaders: any[] = [];
  public filteredOptions: Observable<any[]>;
  public meetings: any[] = [];

  public newPersonForm: FormGroup;
  public step: number = 0;

  public isLoading: any = { leaders: false, insert: false };

  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder, private _peopleService: PeopleService,
    private _leadersService: LeadersService, private _mainService: MainService,
    private _goService: GoService, private _storageService: StorageService, 
    private snackBar: MatSnackBar, private cdr: ChangeDetectorRef, 
    private router: Router) {
    this.minDate = new Date(1950, 0, 1);
    this.maxDate = new Date(new Date().getFullYear() - 10, 0, 1);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getDocumentTypes();
    this.getCivilStatus();
    this.getZone();
    this.getPastors();
    this.getMeetings();
    this.filteredOptions = this.form.idLeader.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.name),
        map(name => name ? this._filter(name) : this.leaders.slice())
      );
  }

  buildForm() {
    this.newPersonForm = this.fb.group(ADD_PERSON_FORM);
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.leaders.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(leader: any): string {
    return leader && leader.name ? leader.name : '';
  }

  numberOnly($event): boolean { return numberOnly($event); }

  get form() {
    return this.newPersonForm.controls;
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
    //this.currentUser.idSede
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

  getPastors() {
    const getCivilSubscr = this._leadersService
      .getLeaderShips({ idUser: this.currentUser.idUser }).subscribe((res: Response) => {
        this.pastors = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getCivilSubscr);
  }

  getLeaders(Code: string, IdSede: number) {
    this.isLoading.leaders = true;
    const getCivilSubscr = this._leadersService
      .getLeaderByPastor({ Code, IdSede }).subscribe((res: Response) => {
        this.leaders = res.entity || [];
        this.isLoading.leaders = false;
        this.form.idLeader.enable();
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getCivilSubscr);
  }

  searchAssistant() {
    const getPersonSubscr = this._goService
      .searchPerson({
        Filter: "DOCUMENTO", DocumentType: parseInt(this.form.idDocumentType.value),
        DocumentNumber: this.form.documentNumber.value, Email: null, Phone: null
      })
      .subscribe((res: Response) => {
        this.showMessage(3,"Lo sentimos, la persona que intentas registrar ya existe.");
        this.form.idDocumentType.setValue(null);
        this.form.documentNumber.setValue(null);
        this.cdr.detectChanges();
      }, err => {
        this.cdr.detectChanges();
        throw err;
      });
    this.unsubscribe.push(getPersonSubscr);
  }

  onSubmit() {

    this.form.idChurchType.setValue(88);
    this.form.idUserCreation.setValue(this.currentUser.idUser)
    if (this.newPersonForm.invalid) {
      this.setStep(toFailedStep(this.form));
      return;
    }
    const insertPeopleSubscr = this._peopleService
      .insertPerson(insertPerson(this.newPersonForm.getRawValue())).subscribe((res: Response) => {
        if (res.result) {
          this.showMessage(1, "La información de " + this.form.names.value + " ha sido registrada con éxito!");
          // this.newPersonForm.reset();
          // this.form.idLeader.disable();
          this.router.navigate(['/to-win/people/phone-visit']);
        } else {
          this.showMessage(res.notificationType, res.message[0])
        }
      }, err => {
        this.showMessage(3, err.error.entity[0].message || "Lo sentimos, no hemos podido registrar la información");
        throw err;
      });

    this.unsubscribe.push(insertPeopleSubscr);
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
