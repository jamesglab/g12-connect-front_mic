import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  parseToObject,
  numberOnly,
  toFailedStep,
} from 'src/app/_helpers/objects/validator.tool';
import {
  ADD_ASSISTANT,
  error_messages,
} from 'src/app/_helpers/objects/forms.objects';
import { COUNTRIES } from 'src/app/_helpers/tools/countrys.tools';

import { MainService } from 'src/app/modules/_services/main.service';
import Swal from 'sweetalert2';
import { G12eventsService } from '../../../_services/g12events.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-assistant',
  templateUrl: './add-assistant.component.html',
  styleUrls: ['./add-assistant.component.scss'],
})
export class AddAssistantComponent implements OnInit {
  public assistant: any = null; //REACTIVE FORM
  //FOR MIN & MAX VALIDATION
  public minDate: Date;
  public maxDate: Date;
  public events = [];
  public financialCuts = [];
  public countries: { [key: string]: any }[] = [];

  public assistantForm: FormGroup;
  public actualCute;
  // public documentTypes: { [key: string]: string }[] = [];
  public churchTypes: { [key: string]: string }[] = [];
  public cities: { [key: string]: string }[] = [];
  public places: { [key: string]: string }[] = [];
  public pastors: { [key: string]: string }[] = [];
  public pastorsObject: { [key: string]: string } = null; //FOR OBTAIN PASTORS ID - NOT CODE
  public leaders: { [key: string]: string }[] = [];
  public leadersObject: { [key: string]: string } = null; //FOR OBTAIN LEADER ID - NOT CODE
  // public filteredOptions: Observable<any[]>;
  public step: number = 0;
  public isMobile: boolean = false;
  private unsubscribe: Subscription[] = [];

  public disableds = [false, true, true, true];

  public disabled: boolean = true;

  // error_messages = {
  //   'companyName': [{ type: 'required', message: 'Nombre comercial requerido' },],
  //   'country': [{ type: 'required', message: 'Pais requerido' },],
  //   'city': [{ type: 'required', message: 'Ciudad requerida' }],
  //   'neighborhood': [{ type: 'required', message: 'Barrio/Colonia requerido ' }],
  //   'streetNumber': [{ type: 'required', message: 'Calle y numero requerido' },],
  //   'streetNumber2': [{ type: 'required', message: 'Calle y numero 2 requerido' },],
  //   'postalCode': [{ type: 'required', message: 'Codigo postal requerido' },],
  //   'agencyValidate': [{ type: 'required', message: 'Confirma el comercio' }],
  //   'NIP': [{ type: 'required', message: 'Confirma el  Nº de Identificación Fiscal ' }],
  // };

  constructor(
    private fb: FormBuilder,
    private mainService: G12eventsService,
    public modal: NgbActiveModal,
    private cdr: ChangeDetectorRef
  ) {
    this.minDate = new Date(1950, 0, 1);
    this.maxDate = new Date(new Date().getFullYear() - 5, 0, 1);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getEvents();
    // this.getDocumentTypes();
    this.getChurchTypes();
    this.getCountries();
    // this.filteredOptions = this.form.Leader.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value?.name),
    //     map(name => name ? this._filter(name) : this.leaders.slice())
    //   );
  }
  getCountries() {
    if (this.countries.length == 0) {
      this.countries = COUNTRIES || [];
    }
  }
  numberOnly($event): boolean {
    return numberOnly($event);
  }

  buildForm() {
    this.assistantForm = this.fb.group(ADD_ASSISTANT);
  }

  get form() {
    return this.assistantForm.controls;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth <= 550) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }



  // getDocumentTypes() {
  //   const getDocumentTypesSubscr = this.mainService
  //     .getDocumentTypes().subscribe((res: any) => {
  //       this.documentTypes = res.entity || [];
  //       this.cdr.detectChanges();
  //     })
  //   this.unsubscribe.push(getDocumentTypesSubscr);
  // }

  getChurchTypes() {
    const getChurchTypesSubcr = this.mainService
      .getChurchTypes()
      .subscribe((res: any) => {
        this.churchTypes = res.entity || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getChurchTypesSubcr);
  }

  getCities() {
    if (this.cities.length == 0) {
      const getCitiesSubscr = this.mainService
        .getCities()
        .subscribe((res: any) => {
          this.cities = res || [];
          this.cdr.detectChanges();
        });
      this.unsubscribe.push(getCitiesSubscr);
    }
  }
  setFinancialCuts() {
    console.log('evento', this.assistantForm.getRawValue().payment_data.event);

    this.events.map((event) => {
      if (event.id == this.assistantForm.getRawValue().payment_data.event.id) {
        this.financialCuts = event.financialCut;
      }
    });
  }
  getPlaces(): void {
    const filter = { '1': 'national', '2': 'international' };
    const getPlacesSubscr = this.mainService
      .getPlaces({ type: filter[this.form.registerType.value] })
      .subscribe(
        (res) => {
          this.places = res;
          this.cdr.detectChanges();
        },
        (err) => {
          throw err;
        }
      );
    // const getPlaceSubscr = this.mainService
    //   .getPlaces({ Type: 'NACIONALES' }).subscribe((nationals: any) => {

    //     const getBogSubscr = this.mainService
    //       .getPlaces({ Type: 'BOGOTA' }).subscribe((bogota: any) => {

    //         nationals.entity.push(bogota.entity[0]);
    //         const compare = (a, b) => a.name.localeCompare(b.name);
    //         nationals.entity.sort(compare);

    //         this.places = nationals.entity || [];
    //         this.cdr.detectChanges();
    //       }, err => {
    //         throw err;
    //       });
    //     this.unsubscribe.push(getBogSubscr);
    //   });
    this.unsubscribe.push(getPlacesSubscr);
  }

  getPastors() {
    this.pastors = [];
    if (this.form.network.value && this.form.headquarters.value) {
      const getCivilSubscr = this.mainService
        .getLeadersOrPastors({
          userCode: this.form.network.value,
          church: this.form.headquarters.value.id,
        })
        .subscribe(async (res: any) => {
          // this.pastorsObject = await parseToObject(res.entity, 'code', 'id');
          this.pastors = res || [];
          this.form.pastor.enable();
          this.cdr.detectChanges();
        });
      this.unsubscribe.push(getCivilSubscr);
    }
  }

  getLeaders(userCode: any) {
    console.log('suer code', userCode);
    this.leaders = [];
    // this.isLoading.leaders = true;
    const getLeadersSubscr = this.mainService
      .getLeadersOrPastors({
        userCode: userCode.user_code,
        church: this.form.headquarters.value.id,
      })
      .subscribe(async (res: any) => {
        // this.leadersObject = await parseToObject(res.entity, 'code', 'id');
        this.leaders = res || [];
        // this.isLoading.leaders = false;
        this.form.leader.enable();
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }

  handleRegisterType() {
    const value = this.form.registerType.value;
    this.form.documentNumber.setValidators(null);
    this.form.city.setValidators(null);
    this.form.city.setValue(null);
    this.form.country.setValue(null);
    if (value === '1') {
      //NACIONAL
      this.form.documentNumber.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9a-zA-Z\s,-]+$/),
        Validators.minLength(6),
        Validators.maxLength(13),
      ]);
      this.form.city.setValidators([Validators.required]);
    } else {
      this.form.documentNumber.setValidators(null);
      this.form.documentNumber.setErrors(null);
      this.form.city.setValidators(null);
      this.form.city.setErrors(null);
    }
  }

  submit() {
    if (this.assistantForm.invalid) {
      this.setStep(toFailedStep(this.form));
      return;
    }
    const formAssistant = this.assistantForm.getRawValue();
    const sendObject = {
      user: {
        identification: formAssistant.documentNumber,
        name: formAssistant.name,
        last_name: formAssistant.lastName,
        gender: formAssistant.gender,
        email: formAssistant.email,
        phone: formAssistant.mobile,
        birth_date: moment(formAssistant.dateBirth).format('YYYY/MM/DD'),
        pastor: formAssistant.pastor,
        leader: formAssistant.leader,
        church: formAssistant.headquarters,
        city: formAssistant.registerType == '1' ? formAssistant.city : null,
        country:
          formAssistant.registerType == '2' ? formAssistant.country : 'COLOMBIA',
      },
      payment: {
        platform: formAssistant.payment_data.platform,
        payment_ref: formAssistant.payment_data.payment_ref,
        payment_method: formAssistant.payment_data.payment_method,
        payment_gateway: formAssistant.payment_data.payment_gateway,
        currency: formAssistant.payment_data.currency,
      },
      donation: formAssistant.payment_data.event,
      financial_cut: formAssistant.payment_data.financial_cut,
    };

    this.mainService.createUserWithPaymentAdmin(sendObject).subscribe((res) => {
      console.log('user', res);
      Swal.fire('Se creo el usuario', res.response, 'success');
      this.modal.close();
    });
  }

  getEvents() {
    this.mainService.getAll({ type: 'G12_EVENT' }).subscribe(
      (res) => {
        this.events = res || [];
      },
      (err) => {
        throw err;
      }
    );
  }


  changueCut() {
    this.actualCute = this.assistantForm.controls.payment_data.get('financial_cut').value;
    this.cdr.detectChanges();
  }

  setStep(index: number, init?) {
    // this.step = index;
    // console.log('steap initS', index)
    // // if (init) {
    // var validateSteapForm = this.validateFormErrors(index);
    // console.log("validate", validateSteapForm)
    // if (validateSteapForm) {
    this.step = index;
    // }
  }

  async nextStep() {
    var disable = this.step + 1;

    var validateSteapForm = this.validateFormErrors(this.step);

    if (validateSteapForm) {
      this.disableds[disable] = false;
      this.step++;
    }
  }

  prevStep() {
    var validateSteapForm = this.validateFormErrors(this.step);
    if (validateSteapForm) {
      this.step--;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  validateFormErrors(validate) {
    let errorText = '';
    console.log('errorsss', this.assistantForm.controls);
    Object.keys(this.assistantForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors =
        this.assistantForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          if (error_messages[validate][key]) {
            error_messages[validate][key].map((res) => {
              if (res.type == keyError)
                errorText = `${errorText} <br>- ${res.message}`;
            });
          }
        });
      }
    });
    if (errorText != '') {
      setTimeout(() => {
        Swal.fire('Verifique los siguientes datos:', errorText, 'error');
      }, 500);
      return false;
    } else {
      return true;
    }
  }
}
