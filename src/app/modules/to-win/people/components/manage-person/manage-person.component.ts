import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { numberOnly, toFailedStep } from 'src/app/_helpers/tools/validators.tool';
import { renderUpdatePerson, updatePerson } from 'src/app/_helpers/tools/parsedata/parse-data-towin.tool';
import { UPDATE_PERSON_FORM } from 'src/app/_helpers/items/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Person } from '../../../_models/people.model';

import { StorageService } from '../../../../auth/_services/storage.service';
import { MainService } from '../../../../_services/main.service';
import { LeadersService } from '../../../../send/_services/leaders.service';
import { PeopleService } from '../../../_services/people.service';
import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-manage-person',
  templateUrl: './manage-person.component.html',
  styleUrls: ['./manage-person.component.scss']
})
export class ManagePersonComponent implements OnInit {

  public currentUser: any = this._storageService.getItem("user");
  @Input() public person: Person = null;
  @Output() public updated: EventEmitter<any> = new EventEmitter();
  public updateDoc: boolean = false;

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

  public managePersonForm: FormGroup;
  public step: number = 0;

  public isLoading: any = { leaders: false, insert: false };
  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder, private _peopleService: PeopleService,
    private _leadersService: LeadersService, private _mainService: MainService,
    private _storageService: StorageService, private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef) { 
      this.minDate = new Date(1950, 0, 1);
      this.maxDate = new Date();
    }

  ngOnInit(): void {
    this.buildForm();
    this.renderData();
    this.getDocumentTypes();
    this.getZone();
    this.getCivilStatus();
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
    this.managePersonForm = this.fb.group(UPDATE_PERSON_FORM);
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
    return this.managePersonForm.controls;
  }

  renderData() {
    console.log("person", this.person)
    this.managePersonForm.patchValue(renderUpdatePerson(this.person));
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

  onSubmit() {
    this.form.idWin.setValue(this.person.idWin);
    if (this.managePersonForm.invalid) {
      this.setStep(toFailedStep(this.form));
      return;
    }
    const updatePersonSubscr = this._peopleService
      .updatePerson(updatePerson(this.managePersonForm.getRawValue())).subscribe((res: Response) => {
        if (res.result) {
          this.showMessage(1, "La información de "+ this.form.names.value + " ha sido actualizada con exito!");
          //EMIT EVENT
          this.updated.emit(true);
        } else {
          this.showMessage(res.notificationType, res.message[0])
        }
      }, err => {
        throw err;
      });
    this.unsubscribe.push(updatePersonSubscr);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
