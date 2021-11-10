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
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {

  private unsubscribe: Subscription[] = [];
  private uploadImage: boolean;

  public editEventForm: FormGroup = null;
  public event = null;
  public isLoading: boolean = false;
  public minDate: Date;
  public categories = [];
  public cuts = new FormArray([]); //CREAMOS EL FORM ARRAY PARA RECORRER LOS FORMULARIOS REACTIVOS QUE SE CREEN


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private eventsService: G12eventsService,
    private router: Router,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.buildForm();
    this.setCuts();
  }

  // CREAMOS EL FORMULARIO REACTIVO
  buildForm() {
    //CREAMOS EL FORMULARIO REACTIVO CON SUS CORRESPONDIENTES VALIDADORES Y SETEAMOS LOS DATOS DEL FORMULARIO
    this.editEventForm = this.fb.group({
      id: [this.event.id],
      type: ['G12_EVENT', [Validators.required]],
      category: [this.event.category || [], Validators.required],
      name: [this.event.name, [Validators.required]],
      description: [this.event.description],
      image: [this.event.image],
      categorieAdd: [''],
      base64: [],
      init_date: [this.event.init_date],
      finish_date: [this.event.finish_date],
      visibility: [this.event.visibility[0]],
      limit: [this.event.limit],
      location: [],
      status: [this.event.status],
    });
    //VALIDAMOS LA IMAGEN DEL EVENTO Y LA SETEAMOS EN BASE64
    if (this.event.image.url != '' && this.event.image.url) {
      this.form.base64.setValue(this.event.image.url);
    } else {
      this.form.base64.setValue(
        'https://yt3.ggpht.com/ytc/AAUvwnjl325OZ-8UBHRf-8cmtxM2sXIznUWaoGxwcV4JGA=s900-c-k-c0x00ffffff-no-rj'
      );
    }
    //ANEXAMOS EL MIN DATE PRA VALIDAR EL INICIO DEL EVENTO
    this.minDate = new Date(this.event.init_date);
  }

  //METODO PARA CREAR LOS CORTES EN EL FORMULARIO
  setCuts() {
    //RECORREMOS LOS CORTES QUE ESTAN EN 'financialCut' DEL EVENTO
    this.event.financialCut.map((cut) => {
      //PUSHEAMOS LOS FORMULARIOS QUE SE IRAN CREANDO PARA CADA CORTE
        //CREAMOS EL FORMULARIO REACTIVO CON LOS DIFERENTES CAMPOS DEL CORTE
        this.addCute(cut)
    });
  }

  addCute(cut?) {
    this.cuts.push(
      new FormGroup({
        id: new FormControl(cut.id ? cut.id : null),
        name: new FormControl(cut ? cut.name : null),
        cop: new FormControl(cut ? cut.prices.cop : null),
        usd: new FormControl(cut ? cut.prices.usd : null),
        quantity: new FormControl(cut ? cut.quantity : null),
        date_init: new FormControl(cut ? cut.date_init : null),
        date_finish: new FormControl(cut ? cut.date_finish : null),
        is_active: new FormControl(cut ? cut.is_active ? true : false : null),
        price_group_selected: new FormControl(cut ? cut.is_group : false),
        price_group_usd: new FormControl(cut ? cut.price_group?.usd : null),
        price_group_cop: new FormControl(cut ? cut.price_group?.cop : null),
        quantity_register_max: new FormControl(cut ? cut.quantity_register_max : 1),
        quantity_register_min: new FormControl(cut ? cut.quantity_register_min : 1),
        description: new FormControl(cut ? cut.description : null),
      })
    );
  }


  async fileChangeEvent(image) {
    this.form.image.setValue(image.target.files[0]);
    this.form.base64.setValue(await getBase64(image));
    this.uploadImage = true;
  }

  handleNotFoundSource($event: any) {
    $event.target.src =
      'https://yt3.ggpht.com/ytc/AAUvwnjl325OZ-8UBHRf-8cmtxM2sXIznUWaoGxwcV4JGA=s900-c-k-c0x00ffffff-no-rj';
  }

  onSubmit() {
    if (this.editEventForm.invalid) {
      return;
    }

    let cont_quantity = 0;
    this.cuts.value.map((cute) => {
      cont_quantity = cont_quantity + parseInt(cute.quantity);
    });
    delete this.editEventForm.getRawValue().categorieAdd;
    const { visibility } = this.editEventForm.getRawValue();
    this.form.visibility.setValue([visibility]);

    if (cont_quantity < parseInt(this.editEventForm.value.limit)) {
    }

    let cuts = this.cutsToSend();
    if (cuts) {
      const sendData = this.editEventForm.getRawValue();
      delete sendData.categorieAdd;
      const addEventSubscr = this.eventsService.update(
        { transaction_info: sendData, cuts, image: this.event.image },
        this.uploadImage
      )
        .subscribe(
          (res: any) => {
            console.log('UPDATEDDDDDD', res);
            this.showMessage(
              1,
              `El evento ${this.form.name.value} ha sido actualizado correctamente!`
            );
            this.modal.close('success');
            this.router.navigate(['g12events']);
          },
          (err) => {
            Swal.fire(
              err.error.error ? err.error.error : 'error inesperado',
              '',
              'error'
            );
            throw err;
          }
        );
      this.unsubscribe.push(addEventSubscr);
    } else {
      this.showMessage(2, 'Hay campos vacios requeridos en los cortes');
    }
  }

  cutsToSend() {
    let newCuts = [];
    let error = false;

    this.cuts.value.map((cut) => {
      if (cut.price_group_selected) {
        if (
          cut.name != '' &&
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
            id: cut.id,
            is_active: cut.is_active,
            name: cut.name,
            prices: { cop: cut.cop, usd: cut.usd != '' ? cut.usd : 0 },
            quantity: cut.quantity,
            date_init: moment(cut.date_init),
            date_finish: moment(cut.date_finish),
            price_group: {
              cop: cut.price_group_cop, usd: cut.price_group_usd != '' ? cut.price_group_usd : 0
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
          cut.quantity != '' &&
          cut.date_init != '' &&
          cut.date_finish &&
          cut.quantity_register_max != '' &&
          cut.quantity_register_min != '' &&
          cut.description != ''

        ) {
          newCuts.push({
            id: cut.id,
            is_active: cut.is_active,
            name: cut.name,
            prices: { cop: cut.cop, usd: cut.usd != '' ? cut.usd : 0 },
            quantity: cut.quantity,
            date_init: moment(cut.date_init),
            date_finish: moment(cut.date_finish),
            quantity_register_max: cut.quantity_register_max,
            quantity_register_min: cut.quantity_register_min,
            is_group: cut.price_group_selected,
            description: cut.description
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



  deleteCute(i) {
    console.log(this.cuts.controls[i]);

    // this.cuts.removeAt(i);
  }
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(
      NotificationComponent,
      notificationConfig(type, message)
    );
  }



  drop(event: CdkDragDrop<[]>) {
    moveItemInArray(
      this.editEventForm.get('category').value,
      event.previousIndex,
      event.currentIndex
    );
  }
  pushCategorie() {
    let found = false;
    this.editEventForm.get('category').value.map((item) => {
      if (item == this.editEventForm.get('categorieAdd').value) {
        found = true;
      }
    });
    if (!found) {
      this.editEventForm
        .get('category')
        .value.push(this.editEventForm.get('categorieAdd').value);
      this.editEventForm.get('categorieAdd').setValue('');
    }
  }

  //CONSULTAMOS LAS CATEFORIAS DEL EVENTO
  getCategories() {
    this.eventsService.getCategories().subscribe((res: any) => {
      this.categories = res;
    }, err => { console.log('tenemos error', err) });
  }

  get form() {
    return this.editEventForm.controls;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
