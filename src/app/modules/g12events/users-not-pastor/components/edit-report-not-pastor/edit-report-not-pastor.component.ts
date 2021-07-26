import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { numberOnly } from 'src/app/_helpers/tools/validators.tool';
import { parseToObjectOtherObject } from 'src/app/_helpers/tools/utils.tool';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';

import { G12eventsService } from '../../../_services/g12events.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-report-not-pastor',
  templateUrl: './edit-report-not-pastor.component.html',
  styleUrls: ['./edit-report-not-pastor.component.scss']
})
export class EditReportNotPastorComponent implements OnInit {

  //FOR MIN & MAX VALIDATION
  public minDate: Date;
  public maxDate: Date;

  public report: any = null;
  public editUserForm: FormGroup = null;

  public countries: any[] = COUNTRIES;
  public churchTypes: any[] = []; //MCI - G12 - OTHERS
  public places: { [key: string]: string }[] = [];
  public placesObject: { [key: string]: any } = null; // FOR OBTAIN PLACES OBJECTS - NOT ID
  public pastors: { [key: string]: string }[] = [];
  public pastorsObject: { [key: string]: any } = null; //FOR OBTAIN PASTORS OBJECT - NOT CODE
  public leaders: { [key: string]: string }[] = [];
  public leadersObject: { [key: string]: any } = null; //FOR OBTAIN LEADER OBJECT - NOT ID

  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private fb: FormBuilder,
    private eventsService: G12eventsService, private cdr: ChangeDetectorRef) {
    this.minDate = new Date(1950, 0, 1);
    this.maxDate = new Date(new Date().getFullYear() - 5, 0, 1);
  }

  ngOnInit(): void {
    // console.log('report not pastor to edit', this.report)
    this.buildForm();
    this.getChurchTypes();
  }

  buildForm() {
    this.editUserForm = this.fb.group({
      user: this.fb.group({
        identification: [this.report.user.identification],
        name: [this.report.user.name],
        last_name: [this.report.user.last_name],
        phone: [this.report.user.phone],
        email: [this.report.user.email],
        country: [this.renderCountry(this.report.user.country)],
        birth_date: [new Date(this.report.user.birth_date)]
      }),
      typeChurch: [],
      headquarter:[],
      network: [],
      church: [],
      pastor: [],
      pastorName: [],
      churchName: [],
      leader: []
    })
  }

  get form() {
    return this.editUserForm.controls;
  }

  renderCountry(country){
    if(country){
      return country.toLowerCase();
    }
    return null;
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }

  getChurchTypes() {
    this.churchTypes = [{
      "idDetailMaster": 88, "idCountry": 240,
      "idMaster": 14, "code": "MCI", "description": "Iglesia MCI", "disposable": true
    },
    { "idDetailMaster": 89, "idCountry": 240, "idMaster": 14, "code": "G12", "description": "Iglesia G12", "disposable": true },
    { "idDetailMaster": 90, "idCountry": 240, "idMaster": 14, "code": "OT", "description": "Otra Iglesia", "disposable": true }
    ];
  }

  getPlaces(){
    var filter = "national";
    const { country } = this.form.user.value;
    // console.log("COUNTRYYYYY", country);
    if(!country){
      filter = "national";
    }else{
      if(country.toLowerCase() != "colombia"){
        filter = "international";
      }
    }
    const getPlacesSubscr = this.eventsService
    .getPlaces({ type: filter }).subscribe(async (res) => {
      this.placesObject = await parseToObjectOtherObject(res, 'id');
      this.places = res || [];
      this.cdr.detectChanges();
    }, err => { throw err; });
    this.unsubscribe.push(getPlacesSubscr);
  }

  getPastors() {
    this.pastors = [];
    if (this.form.network.value && this.form.headquarter.value) {
      const getCivilSubscr = this.eventsService
        .getLeadersOrPastors({ userCode: this.form.network.value, church: this.form.headquarter.value }).subscribe(async (res: any) => {
          this.pastorsObject = await parseToObjectOtherObject(res, 'user_code');
          this.pastors = res || [];
          this.form.pastor.enable();
          this.cdr.detectChanges();
        });
      this.unsubscribe.push(getCivilSubscr);
    }
  }

  getLeaders(userCode: string) {
    this.leaders = [];
    // this.isLoading.leaders = true;
    const getLeadersSubscr = this.eventsService
      .getLeadersOrPastors({ userCode, church: this.form.headquarter.value }).subscribe(async (res: any) => {
        // console.log("LEADERS OR PASTORS", res);
        this.leadersObject = await parseToObjectOtherObject(res, 'id');
        this.leaders = res || [];
        // this.isLoading.leaders = false;
        this.form.leader.enable();
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }

  setDataOnForm() { }

  onSubmit() {
    this.isLoading = true;
    if (this.editUserForm.invalid) {
      return;
    }
    this.updateUser();
    //GO TO UPDATE
  }

  updateUser() {
    let pastor, leader, church: any = null;
    if (this.form.typeChurch.value == '88') { //IN CASE OF SELECTED MCI CHURCHES
      pastor = this.pastorsObject[this.form.pastor.value];
      leader = this.leadersObject[this.form.leader.value];
      church = this.placesObject[this.form.headquarter.value];
    } else {
      // IN CASE OF SELECTED church g12 and other
      pastor = { name: this.form.pastorName.value }
      leader = { name: "NO APLICA, NO IGLESIA MCI" }
      church = { name: this.form.churchName.value }
    }
    let { country } = this.form.user.value;
    if(!country) this.form.country.setValue("colombia");

    // console.log("SE fueeee", { ...this.editUserForm.getRawValue(), ...{ pastor, leader, church } });
    const updateUserSubscr = this.eventsService
    .updateUser({ ...this.editUserForm.getRawValue(), ...{ pastor, leader, church } })
    .subscribe((res) => {  
      this.isLoading = false;
      // console.log("THE USER WAS UPDATED", res);
      this.closeModal("success");
     }, err => { this.isLoading = false; throw err; });
     this.unsubscribe.push(updateUserSubscr);
  }

  closeModal(status: any) {
    this.modal.close(status)
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
