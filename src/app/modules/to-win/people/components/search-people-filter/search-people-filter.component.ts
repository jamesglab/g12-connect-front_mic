import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { numberOnly } from 'src/app/_helpers/tools/validators.tool';
import { searchPerson } from 'src/app/_helpers/tools/parsedata/parse-data-towin.tool';

import { PeopleService } from '../../../_services/people.service';
import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-search-people-filter',
  templateUrl: './search-people-filter.component.html',
  styleUrls: ['./search-people-filter.component.scss']
})
export class SearchPeopleFilterComponent implements OnInit {

  @Input() documentTypes: any[] = [];
  @Output() public person: EventEmitter<any> = new EventEmitter();

  public filterSelected: number = 3;
  public notFound: boolean = false;

  public searchUserForm: FormGroup;
  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private _peopleService: PeopleService) { }
  //DOCUMENTO,TELEFONO,EMAIL
  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges() {
    // console.log("DOCUMENTS TYPES", this.documentTypes);
  }

  buildForm() {
    this.searchUserForm = this.fb.group({
      Filter: ['', [Validators.required]],
      IdWin: [0],
      DocumentType: [''],
      DocumentNumber: [{ value: '', disabled: true }, [Validators.pattern(/^[A-Za-z0-9_-]*$/),Validators.maxLength(11)]],
      Email: ['', [Validators.email]],
      Phone: ['']
    })
    this.cdr.detectChanges();
  }

  numberOnly($event): boolean { return numberOnly($event); }

  setDisabled(): void {
    this.form.DocumentNumber.enable();
    this.cdr.detectChanges();
  }

  get form() {
    return this.searchUserForm.controls;
  }

  validateFields() {
    this.filterSelected = parseInt(this.filterSelected.toString());
    switch (this.filterSelected) {
      case 0:
        //Document
        this.form.DocumentType.setErrors(null);
        this.form.DocumentNumber.setErrors(null);
        if (!this.form.DocumentType.value) {
          this.form.DocumentType.setErrors({ required: true });
        }
        if (!this.form.DocumentNumber.value) {
          this.form.DocumentNumber.setErrors({ required: true });
        }
        this.form.Email.setValue('');
        this.form.Phone.setValue('');
        break;
      case 1:
        //Email
        this.form.Email.setErrors(null);
        if (!this.form.Email.value) {
          this.form.Email.setErrors({ required: true });
        }
        this.form.DocumentType.setValue('');
        this.form.DocumentNumber.setValue('');
        this.form.Phone.setValue('');
        break;
      default:
        // Phone
        this.form.Phone.setErrors(null);
        if (!this.form.Phone.value) {
          this.form.Phone.setErrors({ required: true });
        }
        this.form.DocumentType.setValue('');
        this.form.DocumentNumber.setValue('');
        this.form.Email.setValue('');
        break;
    }
  }

  cleanFilter(){
    this.form.Filter.setValue('');
    this.form.IdWin.setValue(0);
    this.form.DocumentType.setValue('');
    this.form.DocumentNumber.setValue('');
    this.form.Email.setValue('');
    this.form.Phone.setValue('');
  }

  onSubmit() {
    // console.log("Entra")
    this.validateFields();
    if (this.searchUserForm.invalid) {
      return;
    }
    this.getPersonByFilter();
  }

  getPersonByFilter() { 
    this.isLoading = true;
    this.notFound = false;
    const getPersonSubscr = this._peopleService
      .searchPerson(searchPerson(this.searchUserForm.getRawValue()))
      .subscribe((res: Response) => {
        this.isLoading = false;
        this.person.emit(res.entity[0]);
        this.cdr.detectChanges();
      }, err => {
        this.isLoading = false;
        this.notFound = true;
        this.cleanFilter();
        this.cdr.detectChanges();
        throw err;
      });
    this.unsubscribe.push(getPersonSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
