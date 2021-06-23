import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { numberOnly, MustMatch } from 'src/app/_helpers/tools/validators.tool';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { Response } from 'src/app/modules/auth/_models/auth.model';
import { MainService } from 'src/app/modules/_services/main.service';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { AdminUsersService } from '../../../../_services/admin-users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  private currentUser: any = this._storageService.getItem("user");
  public createUserForm: FormGroup;
  public documentTypes: any[] = [];
  public userTypes: any[] = [];

  public hidePassword: boolean = true;
  public hideRePassword: boolean = true;

  public userExists: boolean = false;
  public showNoExists: boolean = false;
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private snackBar: MatSnackBar,
    public fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _mainService: MainService, private _storageService: StorageService,
    private _adminUserService: AdminUsersService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getDocumentTypes();
    this.getUserTypes();
  }

  buildForm() {
    this.createUserForm = this.fb.group({
      DocumentType: [null],
      DocumentNumber: [null],
      Names: [{ value: null, disabled: true }], //FOR RENDER
      SurNames: [{ value: null, disabled: true }], // FOR RENDER
      Type: [{ value: null, disabled: true }], // FOR RENDER
      Nickname: [null, [Validators.required, Validators.email]],
      Password: [null, [Validators.required, Validators.maxLength(100)]],
      repassword: [null, [Validators.required, Validators.maxLength(100)]],
      IdWin: [null, [Validators.required]],
      UserCreate: [null],
      Available: [true],
      TypeUser: [null, [Validators.required]]
    }, { validators: [MustMatch('Password', 'repassword')] });
  }

  get form() {
    return this.createUserForm.controls;
  }

  getDocumentTypes() {
    const getDocTypesSubscr = this._mainService
      .getDocumentTypes().subscribe((res: Response) => {
        if (res.result) {
          console.log("DOCUMENTS", res.entity)
          this.documentTypes = res.entity;
          this.cdr.detectChanges();
        }
      }, err => { throw err });
    this.unsubscribe.push(getDocTypesSubscr);
  }

  getUserTypes() {
    // const getUserTypesSubscr = this._adminUserService
    //   .getUserTypes().subscribe((res: Response) => {
    //     if (res.result) {
    //       this.userTypes = res.entity;
    //       this.cdr.detectChanges();
    //     }
    //   }, err => { throw err; });
    // this.unsubscribe.push(getUserTypesSubscr);
  }

  searchUser() {
    this.isLoading = true;
    this.userExists = false;
    const getPersonSubscr = this._mainService
      .searchPerson({
        Filter: "DOCUMENTO", DocumentType: parseInt(this.form.DocumentType.value),
        DocumentNumber: this.form.DocumentNumber.value, Email: null, Phone: null
      })
      .subscribe((res: Response) => {
        // console.log("RESPONSE USER", res);
        console.log("xdxdxd", res.entity[0])
        this.createUserForm.patchValue({
          IdWin: res.entity[0].idWin,
          Nickname: res.entity[0].email,
          Names: res.entity[0].names,
          SurNames: res.entity[0].surNames,
        })
        this.isLoading = false;
        this.userExists = true;
        this.cdr.detectChanges();
      }, err => {
        this.isLoading = false;
        this.showNoExists = true;
        this.cdr.detectChanges();
        throw err;
      });
    this.unsubscribe.push(getPersonSubscr);
  }

  setUserType(){
    this.userTypes.map(type => {
      if(parseInt(this.form.TypeUser.value) == type.idType){
        this.form.Type.setValue(type.name);
      }
    })
  }

  onSubmit() {
    // loading
    // this.submit = true;
    if (this.createUserForm.invalid) {
      return
    }

    this.form.UserCreate.setValue(this.currentUser.idUser);
    this.form.TypeUser.setValue(parseInt(this.form.TypeUser.value));

    const createUserSubscr = this._adminUserService
      .createUser(this.createUserForm.getRawValue()).subscribe((res: Response) => {
        if(res){
          if(res.result){
            this.showMessage(1,"¡El usuario ha sido creado correctamente!");
            this.modal.close('success');
          }else{
            this.showMessage(2, res.message[0]);
          }
        }else{
          this.showMessage(3)
        }
      }, err => this.showMessage(3));
    this.unsubscribe.push(createUserSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
