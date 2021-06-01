import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';

import { G12eventsService } from '../_services/g12events.service';
//import { Donation } from '../_models/donation.model';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  public addEventForm: FormGroup = null;
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar,
    private eventsService: G12eventsService, private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.addEventForm = this.fb.group({
      type: ['G12_EVENT', [Validators.required]],
      category: ['EVENTOS G12', Validators.required],
      name: [null, [Validators.required]],
      description: [null],
      image: [null],
      // hour: ['', [Validators.required, hourValidation.bind(this)]],
      prices: this.fb.group({
        cop: [''],
        usd: ['']
      }),
      visibility: [['eventosg12']],
      limit: [null],
      location: [],
    })
  }

  get form() {
    return this.addEventForm.controls;
  }

  onSubmit() {

    if (this.addEventForm.invalid) {
      return;
    }
    const addEventSubscr = this.eventsService.create(this.addEventForm.getRawValue())
    .subscribe((res: any) => {
      console.log("REGISTEREDD", res);
      this.showMessage(1, "!El nuevo evento ha sido registrado con exito¡");
      this.router.navigate(['g12events']);
    }, err => { throw err; });
    this.unsubscribe.push(addEventSubscr);
    // const addGoSubscr = this._goService.insertGo(this.addGoForm.getRawValue())
    //   .subscribe((res: Response) => {
    //     if (res.result) {
    //       this.showMessage(1, "!La nueva célula ha sido registrada con exito¡");
    //       this.router.navigate(['send'])
    //     } else {
    //       this.form.creationUser.setValue(this.currentUser.idUser);
    //       this.form.modificationUser.setValue(this.currentUser.idUser);
    //       this.showMessage(res.notificationType, res.message[0])
    //     }
    //   }, err => {
    //     this.form.creationUser.setValue(this.currentUser.idUser);
    //     this.form.modificationUser.setValue(this.currentUser.idUser);
    //     this.showMessage(3, err.error.message);
    //   })
    // this.unsubscribe.push(addGoSubscr);
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
