import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { getBase64 } from 'src/app/_helpers/tools/utils.tool';

import { G12eventsService } from '../../_services/g12events.service';
import { Donation } from '../../_models/donation.model';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  public editEventForm: FormGroup = null;
  public event = null;
  public isLoading: boolean = false;
  public minDate: Date;
  public categories = [];
  private unsubscribe: Subscription[] = [];
  cuts = new FormArray([]);

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private eventsService: G12eventsService,
    private router: Router, public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    console.log('edit event', this.event)
    this.getCategories();
    this.buildForm();
    this.setCuts();
  }

  buildForm() {
    this.editEventForm = this.fb.group({
      id: [this.event.id],
      type: ['G12_EVENT', [Validators.required]],
      category: [this.event.category || [], Validators.required],
      name: [this.event.name, [Validators.required]],
      description: [this.event.description],
      image: [this.event.image],
      code: [],
      categorieAdd: [''],
      base64: [],
      init_date: [this.event.init_date],
      finish_date: [this.event.finish_date],
      // hour: ['', [Validators.required, hourValidation.bind(this)]],
      prices: this.fb.group({
        cop: [this.event.prices.cop],
        usd: [this.event.prices.usd]
      }),
      visibility: [this.event.visibility],
      limit: [this.event.limit],
      location: [],
      status: [this.event.status.toString()]
    })
    if (this.event.image.url != "" && this.event.image.url) {
      this.form.base64.setValue(this.event.image.url)
    } else {
      this.form.base64.setValue("https://yt3.ggpht.com/ytc/AAUvwnjl325OZ-8UBHRf-8cmtxM2sXIznUWaoGxwcV4JGA=s900-c-k-c0x00ffffff-no-rj")
    }
    this.minDate = new Date(this.event.init_date);
  }
  getCategories() {
    this.eventsService.getCategories().subscribe((res: any) => {
      this.categories = res;
    })
  }

  setCuts() {
    this.event.financialCut.map(cut => {
      this.cuts.push(
        new FormGroup({
          id: new FormControl(cut.id ? cut.id : null),
          name: new FormControl(cut.name),
          cop: new FormControl(cut.prices.cop),
          usd: new FormControl(cut.prices.usd),
          quantity: new FormControl(cut.quantity),
          date_init: new FormControl(cut.date_init),
          date_finish: new FormControl(cut.date_finish),
          is_active: new FormControl(cut.is_active ? true : false)
        })
      );
    });
  }

  get form() {
    return this.editEventForm.controls;
  }

  async fileChangeEvent(image) {
    this.form.code.setValue(this.form.image.value.code);
    this.form.image.setValue(image.target.files[0]);
    this.form.base64.setValue(await getBase64(image));
  }

  handleNotFoundSource($event: any) {
    $event.target.src = "https://yt3.ggpht.com/ytc/AAUvwnjl325OZ-8UBHRf-8cmtxM2sXIznUWaoGxwcV4JGA=s900-c-k-c0x00ffffff-no-rj";
  }

  onSubmit() {
    if (this.editEventForm.invalid) {
      return;
    }

    let cont_quantity = 0;
    this.cuts.value.map(cute => {
      cont_quantity = cont_quantity + parseInt(cute.quantity);
    });
    delete this.editEventForm.getRawValue().categorieAdd;

    if (cont_quantity < parseInt(this.editEventForm.value.limit)) {
    }

    let cuts = this.cutsToSend();
    if (cuts) {
      const sendData = this.editEventForm.getRawValue();
      delete sendData.categorieAdd
      const addEventSubscr = this.eventsService.update({ transaction_info: sendData, cuts })
        .subscribe((res: any) => {
          console.log("UPDATEDDDDDD", res);
          this.showMessage(1, `El evento ${this.form.name.value} ha sido actualizado correctamente!`);
          this.modal.close("success");
          this.router.navigate(['g12events']);
        }, err => { throw err; });
      this.unsubscribe.push(addEventSubscr);
    } else {
      this.showMessage(2, 'Hay campos vacios requeridos en los cortes');
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
        if (cut.name != '' && cut.cop != '' && cut.quantity != '' && cut.date_init != '' && cut.date_finish) {
          newCuts.push({ is_active: cut.is_active, id: cut.id, name: cut.name, prices: { cop: cut.cop, usd: (cut.usd != '') ? cut.usd : null }, quantity: cut.quantity, date_init: moment(cut.date_init), date_finish: moment(cut.date_finish) })
        } else {
          error = true
        }
      });
    } else {
      newCuts.push({
        name: this.editEventForm.value.name,
        prices: { cop: this.editEventForm.value.cop, usd: (this.editEventForm.value.usd != '') ? this.editEventForm.value.usd : null },
        quantity: this.editEventForm.value.quantity,
        date_init: moment(this.editEventForm.value.date_init),
        date_finish: moment(this.editEventForm.value.date_finish)
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
        is_active: new FormControl(true),
        id: new FormControl(null),
        name: new FormControl(''),
        cop: new FormControl(''),
        usd: new FormControl(''),
        quantity: new FormControl(''),
        date_init: new FormControl(''),
        date_finish: new FormControl(''),
      })
    );
  }
  deleteCute(i) {
    console.log(this.cuts.controls[i])

    // this.cuts.removeAt(i);
  }
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  drop(event: CdkDragDrop<[]>) {
    moveItemInArray(this.editEventForm.get('category').value, event.previousIndex, event.currentIndex);
  }
  pushCategorie() {
    let found = false;
    this.editEventForm.get('category').value.map(item => {
      if (item == this.editEventForm.get('categorieAdd').value) { found = true }
    });
    if (!found) {
      this.editEventForm.get('category').value.push(this.editEventForm.get('categorieAdd').value);
      this.editEventForm.get('categorieAdd').setValue('');
    }
  }
}
