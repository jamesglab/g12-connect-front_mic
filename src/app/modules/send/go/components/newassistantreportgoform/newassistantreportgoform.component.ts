import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { numberOnly } from 'src/app/_helpers/tools/validators.tool'

import { MainService } from '../../../../_services/main.service';
import { LeadersService } from '../../../_services/leaders.service';
import { StorageService } from '../../../../auth/_services/storage.service';

import { Response } from '../../../../auth/_models/auth.model';
import { UserModel } from '../../../../auth/_models/user.model';
import { Assistant } from '../../../_models/assistant.model';
import { GoService } from '../../../_services/goservice.service';

@Component({
  selector: 'app-newassistantreportgoform',
  templateUrl: './newassistantreportgoform.component.html',
  styleUrls: ['./newassistantreportgoform.component.scss']
})
export class NewassistantreportgoformComponent implements OnInit {

  @Input() goId: number;
  @Output() newAssistantAdded: EventEmitter<Assistant> = new EventEmitter();
  public currentUser: UserModel = this._storageService.getItem("user");

  public newAssistantForm: FormGroup;
  public submitted: boolean = false;
  public documentTypes: { id: number, code: string, description: string }[] = [];
  public personTypes: { id: number, code: string, description: string }[] = [];

  public isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(private _leadersService: LeadersService, private _goService: GoService,
    private _storageService: StorageService, private _mainService: MainService,
    private snackBar: MatSnackBar, private fb: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { this.buildForm(); this.getDocumentTypes(); this.getPersonTypes(); }

  buildForm(): void {
    this.newAssistantForm = this.fb.group({
      idDocumentType: [null],
      documentNumber: [null, [Validators.pattern(/[a-zA-Z0-9-]+/), Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z+óÓííéÉáÁ ]+$/)]],
      phone: ['', [Validators.required]],
      go: [null, [Validators.required]],
      idPersonType: [null, [Validators.required]],
      idUser: [this.currentUser.idUser, [Validators.required]],
      edad: [null, [Validators.required, Validators.min(0)]],
      terms: [null, [Validators.required]]
    });
    this.cdr.detectChanges();
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }

  get form() {
    return this.newAssistantForm.controls;
  }

  getDocumentTypes() {
    const getDocTypesSubscr = this._mainService
      .getDocumentTypes().subscribe((res: Response) => {
        if (res.result) {
          this.documentTypes = res.entity;
          this.cdr.detectChanges();
        } else {
          console.log("Error", res)
        }
      });
    this.unsubscribe.push(getDocTypesSubscr);
  }

  getPersonTypes() {
    const getPersonTypesSubscr = this._mainService
      .getPersonTypes().subscribe((res: Response) => {
        if (res.result) {
          this.personTypes = res.entity;
        } else {
          console.log("Error", res)
        }
      });
    this.unsubscribe.push(getPersonTypesSubscr);
  }

  searchAssistant() {
    this.isLoading = false;
    const getPersonSubscr = this._goService
      .searchPerson({
        Filter: "DOCUMENTO", DocumentType: parseInt(this.form.idDocumentType.value),
        DocumentNumber: this.form.documentNumber.value, Email: null, Phone: null
      })
      .subscribe((res: Response) => {
        // console.log("RESPONSE USER", res);
        this.newAssistantForm.patchValue({
          email: res.entity[0].email,
          name: res.entity[0].names,
          lastName: res.entity[0].surNames,
          phone: res.entity[0].phone
        })
        this.cdr.detectChanges();
      }, err => {
        this.isLoading = false;
        this.cdr.detectChanges();
        throw err;
      });
    this.unsubscribe.push(getPersonSubscr);
  }

  onSubmit() {
    console.log("Entra al submit")
    this.submitted = true;
    this.validateTerms();
    this.setDefaultValues();
    if (this.newAssistantForm.invalid) {
      return;
    }

    this.parseAttrMustNumbers();
    const insertNewAssistantSubscr = this._goService
      .insertNewAssistantGo(this.newAssistantForm.getRawValue())
      .subscribe((res: Response) => {
        if (res) {
          if (res.result) {
            this.submitted = false;
            this.newAssistantAdded.emit(this.newAssistantForm.getRawValue());
            this.newAssistantForm.reset();
            this.showMessage(1, "¡El nuevo asistente se ha registrado correctamente!");
            this.cdr.detectChanges();
          } else {
            this.showMessage(2, res.message[0]);
          }
        } else {
          this.showMessage(3)
        }
      });
    this.unsubscribe.push(insertNewAssistantSubscr);
  }

  validateTerms() {
    const value = this.form.terms.value;
    if (!value) {
      this.newAssistantForm.controls.terms.setErrors({ required: true });
    } else {
      this.newAssistantForm.controls.terms.setErrors(null);
    }
  }

  setDefaultValues() {
    this.form.go.setValue(this.goId);
    this.form.idUser.setValue(this.currentUser.idUser);
  }

  parseAttrMustNumbers() {
    this.newAssistantForm.controls.idDocumentType.setValue(parseInt(this.newAssistantForm.controls.idDocumentType.value));
    this.newAssistantForm.controls.idPersonType.setValue(parseInt(this.newAssistantForm.controls.idPersonType.value));
    this.newAssistantForm.controls.edad.setValue(parseInt(this.newAssistantForm.controls.edad.value));
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
