import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { G12eventsService } from '../_services/g12events.service';
import * as moment from 'moment';
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
  select_cut = new FormControl(false);
  cuts = new FormArray([]);
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
      initDate: [],
      finishDate: [],
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
    console.log("select", this.cuts)


    if (this.addEventForm.invalid) {
      return;
    }
    let cont_quantity = 0;
    this.cuts.value.map(cute => {
      cont_quantity = cont_quantity + parseInt(cute.quantity);
    });
    if (cont_quantity < parseInt(this.addEventForm.value.limit)) {
      let cuts = this.cutsToSend();
      if (cuts) {
        this.addEventForm.get('initDate').setValue(moment(this.addEventForm.get('initDate').value));
        this.addEventForm.get('finishDate').setValue(moment(this.addEventForm.get('finishDate').value));
        const updateEventSubscr = this.eventsService.create({ transaction_info: this.addEventForm.getRawValue(), cuts })
          .subscribe((res: any) => {
            console.log("REGISTEREDDD", res);
            this.showMessage(1, `El evento ${this.form.name.value} ha sido creado correctamente!`);
            this.router.navigate(['g12events']);
          }, err => { throw err; });
        this.unsubscribe.push(updateEventSubscr);
      } else {
        this.showMessage(2, 'Hay campos vacios requeridos en los cortes');
      }
    } else {
      this.showMessage(2, 'Verifica la capacidad de los cortes');
    }

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

  cutsToSend() {
    let newCuts = [];
    let error = false;
    if (this.cuts.value.length > 0) {
      this.cuts.value.map(cut => {
        if (cut.name != '' && cut.cop != '' && cut.quantity != '' && cut.initDate != '' && cut.finishDate) {
          newCuts.push({ name: cut.name, prices: { cop: cut.cop, usd: (cut.usd != '') ? cut.usd : null }, quantity: cut.quantity, initDate: moment(cut.initDate), finishDate: moment(cut.finishDate) })
        } else {
          error = true
        }
      });
    } else {
      newCuts.push({
        name: this.addEventForm.value.name,
        prices: { cop: this.addEventForm.value.cop, usd: (this.addEventForm.value.usd != '') ? this.addEventForm.value.usd : null },
        quantity: this.addEventForm.value.quantity,
        initDate: moment(this.addEventForm.value.initDate),
        finishDate: moment(this.addEventForm.value.finishDate)
      });
    }
    if (error) {
      return false
    } else {
      return newCuts
    }
  }
  addCute() {
    this.cuts.push(
      new FormGroup({
        name: new FormControl(''),
        cop: new FormControl(''),
        usd: new FormControl(''),
        quantity: new FormControl(''),
        initDate: new FormControl(''),
        finishDate: new FormControl(''),
      })
    );
  }
  deleteCute(i) {
    this.cuts.removeAt(i)
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
