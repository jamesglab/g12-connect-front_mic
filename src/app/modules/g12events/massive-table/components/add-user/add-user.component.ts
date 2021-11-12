import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserMassiveComponent implements OnInit {

  public add_user: FormGroup;
  public leaders: [] = [];
  constructor(private fb: FormBuilder, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.buildForm();
  }

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.add_user = this.fb.group({
      register_type: [1, Validators.required],
      document: [null, Validators.required],
      document_type: [null, Validators.required],
      name: [null, Validators.required],
      last_name: [null, Validators.required],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      confirm_email: [null, Validators.compose([Validators.required, Validators.email])],
      leader: [null, Validators.required],
    });

  }


  addUser() {

  }


}
