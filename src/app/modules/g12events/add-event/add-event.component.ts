import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
      name: [null, [Validators.required]],
      description: [null],
      image: [null],
      category: [[]],
      categorieAdd: [''],
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

  fileChangeEvent(image) {
    this.form.image.setValue(image.target.files[0]);
  }

  onSubmit() {
    console.log("FORMMMMMM", this.addEventForm)

    if (this.addEventForm.invalid) {
      return;
    }
    const updateEventSubscr = this.eventsService.create(this.addEventForm.getRawValue())
      .subscribe((res: any) => {
        console.log("REGISTEREDDD", res);
        this.showMessage(1, `El evento ${this.form.name.value} ha sido creado correctamente!`);
        this.router.navigate(['g12events']);
      }, err => { throw err; });
    this.unsubscribe.push(updateEventSubscr);
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
  pushCategorie() {
    this.addEventForm.get('category').value.push(this.addEventForm.get('categorieAdd').value);
    this.addEventForm.get('categorieAdd').setValue('');
  }
  drop(event: CdkDragDrop<[]>) {
    moveItemInArray(this.addEventForm.get('category').value, event.previousIndex, event.currentIndex);
  }
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
