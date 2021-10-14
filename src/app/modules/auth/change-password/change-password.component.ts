import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { numberOnly } from 'src/app/_helpers/tools/validators.tool';
import Swal from 'sweetalert2';

import { MainService } from '../../_services/main.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated

})
export class ChangePasswordComponent implements OnInit {

  public changuePasswordForm: FormGroup;
  public errorMessage: String = "";
  public isLoading$: Observable<boolean>;

  public documentTypes: any[] = [];
  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder, private _mainService: MainService,
    private authService: AuthService, private cdr: ChangeDetectorRef,
    private _authService: AuthService,
    private activeRoute: ActivatedRoute,
    private routing: Router

  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.changuePasswordForm.controls;
  }

  initForm() {
    if (this.activeRoute.snapshot.queryParams?.url) {
      this.changuePasswordForm = this.fb.group({
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ]),
        ],
        encrypt: [this.activeRoute.snapshot.queryParams?.url],
        confirm_password: []
      });
    } else {
      this.routing.navigate(['auth'])
    }
  }

  get form() {
    return this.changuePasswordForm.controls;
  }

  numberOnly(event): boolean {
    return numberOnly(event);
  }

  submit() {
    const { password, confirm_password, encrypt } = this.changuePasswordForm.getRawValue();
    if (password == confirm_password) {
      this.authService.changuePassword({encrypt,password}).subscribe(res => {
        Swal.fire('Contraseña actualizada', res.message, 'success').then(r => {
          this.routing.navigate(['auth'])
        })
      }, err => {
        Swal.fire('Error', err.error.message, 'error').then(p => {
          this.routing.navigate(['auth'])
        })
      })
    } else {
      Swal.fire('La confirmación de contraseña no coincide','','info')
    }

  }
}
