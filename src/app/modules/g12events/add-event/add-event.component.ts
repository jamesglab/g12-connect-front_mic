import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { G12eventsService } from '../_services/g12events.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
//import { Donation } from '../_models/donation.model';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  public addEventForm: FormGroup = null;
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];
  public select_cut = new FormControl(true);
  cuts = new FormArray([]);
  public minDate: Date;
  public maxDate: Date;
  categories = [];
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private eventsService: G12eventsService,
    private router: Router
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getCategories();
  }

  buildForm() {
    this.addEventForm = this.fb.group({
      type: ['G12_EVENT', [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      image: [null],
      massive_pay: [null],
      category: [[]],
      categorieAdd: [''],

      init_date: [],
      finish_date: [],
      // hour: ['', [Validators.required, hourValidation.bind(this)]],
      prices: this.fb.group({
        cop: [''],
        usd: [''],
      }),
      visibility: [null],
      limit: [null],
      location: [],
    });
  }

  get form() {
    return this.addEventForm.controls;
  }

  fileChangeEvent(image) {
    this.form.image.setValue(image.target.files[0]);
  }

  onSubmit() {
    if (this.addEventForm.invalid) {
      return;
    }
    let cont_quantity = 0;
    this.cuts.value.map((cute) => {
      cont_quantity = cont_quantity + parseInt(cute.quantity);
    });
    if (cont_quantity <= parseInt(this.addEventForm.value.limit)) {
      let cuts = this.cutsToSend();
      if (this.cuts.value.length == 0) {
        this.showMessage(2, 'No has creado cortes');

      } else {
        if (cuts) {
          const updateEventSubscr = this.eventsService
            .create({ transaction_info: this.addEventForm.getRawValue(), cuts })
            .subscribe(
              (res: any) => {
                this.showMessage(
                  1,
                  `El evento ${this.form.name.value} ha sido creado correctamente!`
                );
                this.router.navigate(['g12events']);
              },
              (err) => {
                Swal.fire(
                  err
                    ? err
                    : 'Ocurrio un error intenta mas tarde!',
                  '',
                  'error'
                );
              }
            );
          this.unsubscribe.push(updateEventSubscr);
        } else {
          this.showMessage(2, 'Hay campos vacios requeridos en los cortes');
        }
      }

    } else {
      this.showMessage(2, 'Verifica la capacidad de los cortes');
    }
  }

  getCategories() {
    this.eventsService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }
  cutsToSend() {
    let newCuts = [];
    let error = false;

    this.cuts.value.map((cut) => {
      if (cut.price_group_selected) {
        if (
          cut.name != '' &&
          cut.cop != '' &&
          cut.quantity != '' &&
          cut.date_init != '' &&
          cut.date_finish &&
          cut.price_group_cop != '' &&
          cut.price_group_usd != '' &&
          cut.quantity_register_max != '' &&
          cut.quantity_register_min != '' &&
          cut.description != ''
        ) {
          newCuts.push({
            massive_pay: cut.massive_pay,
            name: cut.name,
            prices: { cop: cut.cop, usd: cut.usd != '' ? cut.usd : null },
            quantity: cut.quantity,
            date_init: moment(cut.date_init),
            date_finish: moment(cut.date_finish),
            price_group: {
              cop: cut.price_group_cop, usd: cut.price_group_usd != '' ? cut.price_group_usd : null
            },
            quantity_register_max: cut.quantity_register_max,
            quantity_register_min: cut.quantity_register_min,
            is_group: cut.price_group_selected,
            description: cut.description

          });
        } else {
          error = true;
        }
      } else {
        if (
          cut.name != '' &&
          cut.cop != '' &&
          cut.quantity != '' &&
          cut.date_init != '' &&
          cut.date_finish &&
          cut.quantity_register_max != '' &&
          cut.quantity_register_min != '' &&
          cut.description != ''

        ) {
          newCuts.push({
            name: cut.name,
            prices: { cop: cut.cop, usd: cut.usd != '' ? cut.usd : null },
            quantity: cut.quantity,
            date_init: moment(cut.date_init),
            date_finish: moment(cut.date_finish),
            quantity_register_max: cut.quantity_register_max,
            quantity_register_min: cut.quantity_register_min,
            is_group: cut.price_group_selected,
            description: cut.description,
            massive_pay: cut.massive_pay,
          });
        } else {
          error = true;
        }
      }
    });

    if (error) {
      return false;
    } else {
      return newCuts;
    }
  }

  addCute() {
    this.cuts.push(
      new FormGroup({
        name: new FormControl(''),
        cop: new FormControl(''),
        usd: new FormControl(''),
        quantity: new FormControl(''),
        date_init: new FormControl(''),
        price_group_selected: new FormControl(false),
        price_group_usd: new FormControl(''),
        price_group_cop: new FormControl(''),
        date_finish: new FormControl(''),
        massive_pay: new FormControl(''),
        quantity_register_max: new FormControl(1),
        quantity_register_min: new FormControl(1),
        description: new FormControl(''),
      })
    );
  }
  deleteCute(i) {
    this.cuts.removeAt(i);
  }
  pushCategorie() {
    let found = false;
    this.addEventForm.get('category').value.map((item) => {
      if (item == this.addEventForm.get('categorieAdd').value) {
        found = true;
      }
    });
    if (!found) {
      this.addEventForm
        .get('category')
        .value.push(this.addEventForm.get('categorieAdd').value);
      this.addEventForm.get('categorieAdd').setValue('');
    }
  }
  drop(event: CdkDragDrop<[]>) {
    moveItemInArray(
      this.addEventForm.get('category').value,
      event.previousIndex,
      event.currentIndex
    );
  }
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(
      NotificationComponent,
      notificationConfig(type, message)
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
