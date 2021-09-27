import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../modules/_services/user.service';
import { StorageService } from '../../modules/auth/_services/storage.service';

import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { UserModel, ProfileUser } from '../../modules/auth/_models/user.model';
import { Response } from '../../modules/auth/_models/auth.model';
import { parseToObjectOtherObject } from 'src/app/_helpers/tools/validators.tool';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private currentUser: UserModel = this._storageService.getItem("user");
  public user = this._storageService.getItem("auth").user;// PENDIENTE ENDPOINT DE USUARIO

  private unsubscribe: Subscription[] = [];
  public editUserForm: FormGroup = null;
  public documentTypes = ['CC', 'TI', 'CE'];
  public churchTypes = [{
    "idDetailMaster": 88, "idCountry": 240,
    "idMaster": 14, "code": "MCI", "description": "Iglesia MCI", "disposable": true
  },
  { "idDetailMaster": 89, "idCountry": 240, "idMaster": 14, "code": "G12", "description": "Iglesia G12", "disposable": true },
  { "idDetailMaster": 90, "idCountry": 240, "idMaster": 14, "code": "OT", "description": "Otra Iglesia", "disposable": true }
  ];
  public minDate = new Date(1950, 0, 1);
  public maxDate = new Date(new Date().getFullYear() - 5, 0, 1);

  public leaders: any[];
  public pastors: any[];

  places: any[];
  public countries: any[] = COUNTRIES;
  constructor(private _storageService: StorageService, private userService: UserService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef, private fb: FormBuilder,) {

  }

  ngOnInit(): void {
    this.buildForm();
    this.getPlaces();
    console.log('user',this.user)
  }


  buildForm() {
    this.editUserForm = this.fb.group({
      user: this.fb.group({
        id: [this.user.id],
        documentType: [this.user.document_type],
        identification: [this.user.identification],
        name: [this.user.name],
        last_name: [this.user.last_name],
        gender: [this.user.gender],
        phone: [this.user.phone],
        birth_date: [new Date(this.user.birth_date)]
      }),
      contact_information: this.fb.group({
        address: [this.user.address],
        phone: [this.user.phone],
        email: [this.user.email],
      }),
      ministerialInfo: this.fb.group({
        country: [this.renderCountry(this.user.country)],
        network: [(this.user.gender == 'M') ? '01' : '02'],
        leader: [null],
        headquarter: [null],
        pastor: [null],
        typeChurch: [(this.churchTypes.find(tCh => tCh.code.toUpperCase() == this?.user?.type_church?.toUpperCase()))?.idDetailMaster],
        pastorName: [(this?.user?.type_church?.toUpperCase() != 'MCI') ? null : null],
        churchName: [(this?.user?.type_church?.toUpperCase() != 'MCI') ? null : null],
      }),
    });
    if (this?.user?.type_church?.toUpperCase() == 'MCI') {
      this.getPlaces(true);
    }
  }

  


  renderCountry(country) {
    if (country) {
      return country.toLowerCase();
    }
    return null;
  }

  onChangePassword() {
    const MODAL = this.modalService.open(UpdatePasswordComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    // MODAL.componentInstance.goItem = element;
    MODAL.result.then((data) => {
      if (data == "success") {
        // this.getGoData();
      }
    }, (reason) => {
      console.log("Reason", reason)
    });
  }



  getPlaces(setvalue?) {
    var filter = "national";
    const { country } = this.user;
    console.log("COUNTRYYYYY", country);
    if (!country) {
      filter = "national";
    } else {
      if (country.toLowerCase() != "colombia") {
        filter = "international";
      }
    }
    const getPlacesSubscr = this.userService
      .getPlaces({ type: filter }).subscribe(async (res) => {
        this.places = res || [];

        if (setvalue){
          this.editUserForm.get('ministerialInfo').get('headquarter').setValue(res.find(ch => ch.id == this.user.church_id));
        }
        this.cdr.detectChanges();
      }, err => { throw err; });
    this.unsubscribe.push(getPlacesSubscr);
  }

  getPastors(valid?) {
    this.pastors = [];
    if (this.ministerialInfo.network && this.ministerialInfo.headquarter) {
      const getCivilSubscr = this.userService
        .getLeadersOrPastors({ userCode: this.ministerialInfo.network, church: this.ministerialInfo.headquarter.id }).subscribe(async (res: any) => {
          this.pastors = res || [];
          this.cdr.detectChanges();
        });
      this.unsubscribe.push(getCivilSubscr);
    }
  }

  // DEVOLVEMOS LOS VALORES MINISTERIALES DEL FORMULARIO
  get ministerialInfo() {
    return this.editUserForm.value.ministerialInfo;
  }

  

  getLeaders(pastor, valid?) {
    this.leaders = [];
    const getLeadersSubscr = this.userService
      .getLeadersOrPastors({ userCode: pastor.user_code, church: this.ministerialInfo.headquarter.id }).subscribe(async (res: any) => {
        this.leaders = res || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }

}
