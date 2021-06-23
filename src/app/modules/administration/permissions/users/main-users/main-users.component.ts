import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { numberOnly } from 'src/app/_helpers/tools/validators.tool';

import { AddUserComponent } from '../components/add-user/add-user.component';
import { AdminUsersService } from '../../../_services/admin-users.service';

@Component({
  selector: 'app-main-users',
  templateUrl: './main-users.component.html',
  styleUrls: ['./main-users.component.scss']
})
export class MainUsersComponent implements OnInit {

  public filterForm: FormGroup;
  public submitted = false;
  public isLoading = false;

  constructor(private modalService: NgbModal, private fb: FormBuilder, 
    private adminUsersService: AdminUsersService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.filterForm = this.fb.group({
      filter: [null, Validators.required],
      identification: [null],
      email: [null],
      status: [null]
    })
    this.cdr.detectChanges();
  }

  get form() {
    return this.filterForm.controls;
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }

  cleanFilter() {
    this.form.identification.setValue(null);
    this.form.identification.setErrors(null);
    this.form.email.setValue(null);
    this.form.email.setErrors(null);
    this.form.status.setValue(null);
    this.form.status.setErrors(null);
  }

  validateFields() {
    switch(this.form.filter.value){
      case '0':
        if(!this.form.identification.value)
        this.form.identification.setErrors({ required: true });
        break;
      case '1':
        if(!this.form.email.value)
        this.form.email.setErrors({ required: true });
        break;
      case '2':
        if(this.form.status.value === null)
        this.form.status.setErrors({ required: true });
        break;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.validateFields();
    if (this.filterForm.invalid) {
      return;
    }
    this.isLoading = true;
    let filter = {};
    for(let i in this.filterForm.getRawValue()){
      if(this.filterForm.getRawValue()[i] && i != "filter"){
        filter[i] = this.filterForm.getRawValue()[i];
      }
    }
    this.adminUsersService.filter = filter;
    this.adminUsersService.handleReload(); //TO MAKE QUERY THROW TABLE COMPONENT
  }

  handleCreate(event: any){
    event.preventDefault();
    const MODAL = this.modalService.open(AddUserComponent,{
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true
    })
    // MODAL.componentInstance.leaderItem = element;
    MODAL.result.then((data) => {
      if(data == 'success'){
        this.adminUsersService.handleReload();
      }
    }, (reason) => {
      console.log("Reason", reason)
      // on dismiss
    });
  }

}
