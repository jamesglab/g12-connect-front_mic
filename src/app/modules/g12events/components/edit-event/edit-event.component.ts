import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {
  private unsubscribe: Subscription[] = [];
  private uploadImage: boolean;
  private validateChangeDate: boolean = false;

  public editEventForm: FormGroup = null;
  public event = null;
  public isLoading: boolean = false;
  public minDate: Date = null;
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
        init_date: [new Date(this.event.init_date)],
        finish_date: [new Date(this.event.finish_date)],
        is_translator: [this.event.is_translator],
        translators: this.fb.group({
          cop: [this.event.translators?.cop],
          usd: [this.event.translators?.usd],
        }),
        visibility: [this.event.visibility[0]],
        limit: [this.event.limit],
        order_by: [this.event.order_by || null, [Validators.required]],
        image_banner: [this.event.image_banner || null, [Validators.required]],
        location: [],
        massive_pay: [this.event.massive_pay],
        status: [this.event.status],
        view_hubilo: [this.event.view_hubilo || false],
        event_id_hubilo: [this.event.event_id_hubilo || null],
        code_modify: [null],
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

  //CONSULTAMOS LAS CATEFORIAS DEL EVENTO
  getCategories() {
    this.eventsService.getCategories().subscribe(
      (res: any) => {
        this.categories = res;
      },
      (err) => {
        console.log('tenemos error', err);
      }
    );
  }

  get form() {
    return this.editEventForm.controls;
  }

  //METODO PARA CREAR LOS CORTES EN EL FORMULARIO
  setCuts() {
    //RECORREMOS LOS CORTES QUE ESTAN EN 'financialCut' DEL EVENTO
    this.event.financialCut.map((cut) => {
      //PUSHEAMOS LOS FORMULARIOS QUE SE IRAN CREANDO PARA CADA CORTE
      //CREAMOS EL FORMULARIO REACTIVO CON LOS DIFERENTES CAMPOS DEL CORTE
      this.addCute(cut);
    });
  }

  addCute(cut?) {
    //ESTE METODO SE USA EN EL .HTML POR ESO LA VALIDACION DE CUT?
    this.cuts.push(
      new FormGroup({
        id: new FormControl(cut?.id || null),
        name: new FormControl(cut?.name || null),
        cop: new FormControl(cut?.prices.cop || null),
        usd: new FormControl(cut?.prices.usd || null),
        quantity: new FormControl(cut?.quantity || null),
        date_init: new FormControl(cut?.date_init || null),
        date_finish: new FormControl(cut?.date_finish || null),
        is_active: new FormControl(cut?.is_active ? cut.is_active : false),
        price_group_selected: new FormControl(
          cut?.is_group ? cut.is_group : false
        ),
        price_group_usd: new FormControl(cut?.price_group?.usd || null),
        price_group_cop: new FormControl(cut?.price_group?.cop || null),
        quantity_register_max: new FormControl(cut?.quantity_register_max || 1),
        quantity_register_min: new FormControl(cut?.quantity_register_min || 1),
        description: new FormControl(cut?.description || null),
        massive_pay: new FormControl(cut?.massive_pay || null),
        see_events: new FormControl(cut?.module_flags?.see_events || false),
        see_box: new FormControl(cut?.module_flags?.see_box || false),
        see_massive: new FormControl(cut?.module_flags?.see_massive || false),
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

  changeCutDate($event: MatDatepickerInputEvent<any>, i: number) {
    if (this.cuts.value[i].id) { //VERIFICAR QUE ES UN CORTE ANTIGUO
      this.validateChangeDate = true;
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
              cop: cut.price_group_cop,
              usd: cut.price_group_usd != '' ? cut.price_group_usd : 0,
            },
            module_flags: {
              see_box: cut.see_box,
              see_events: cut.see_events,
              see_massive: cut.see_massive,
            },
            quantity_register_max: cut.quantity_register_max,
            quantity_register_min: cut.quantity_register_min,
            is_group: cut.price_group_selected,
            description: cut.description,
            massive_pay: cut.massive_pay,
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
            module_flags: {
              see_box: cut.see_box,
              see_events: cut.see_events,
              see_massive: cut.see_massive,
            },
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

  deleteCute(i) {
    // this.cuts.removeAt(i);
  }

  drop(event: CdkDragDrop<[]>) {
    moveItemInArray(
      this.editEventForm.get('category').value,
      event.previousIndex,
      event.currentIndex
    );
  }

  formatNumber(n) {
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  formatCurrency(input: any, blur: string) {
    // get input value
    var input_val = input.target.value;

    // don't validate empty input
    if (input_val === '') {
      return;
    }

    // original length
    var original_len = input_val.length;

    // initial caret position
    var caret_pos = input.target.selectionStart;

    // check for decimal
    if (input_val.indexOf('.') >= 0) {
      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      var decimal_pos = input_val.indexOf('.');

      // split number by decimal point
      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = this.formatNumber(left_side);

      // validate right side
      right_side = this.formatNumber(right_side);

      // On blur make sure 2 numbers after decimal
      if (blur === 'blur') {
        right_side += '00';
      }

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val = '$' + left_side + '.' + right_side;
    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = this.formatNumber(input_val);
      input_val = '$' + input_val;

      // final formatting
      if (blur === 'blur') {
        input_val += '.00';
      }
    }

    // send updated string to input
    input.target.value = input_val;

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input.target.setSelectionRange(caret_pos, caret_pos);
  }

  async onSubmit() {
    if (this.editEventForm.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.validateChangeDate) {
      const { isConfirmed, isDenied } = await Swal.fire({
        title: 'Has cambiado las fechas en alguno de los cortes',
        text: '¿Tienes el código de confirmación ?',
        showConfirmButton: true,
        confirmButtonText: 'SI',
        showDenyButton: true,
        denyButtonText: 'NO',
      });

      if (isConfirmed) {
        this.showSwal('');
      } else if (isDenied) {
        const generateCodeSusbcr = this.eventsService
          .generateCodeModify()
          .subscribe(
            (res) => {
              this.showSwal(
                'Hemos envíado un código de verificación a tesorería. Ingresalo aquí abajo'
              );
            },
            (err) => {
              this.isLoading = false;
              throw err;
            }
          );
        this.unsubscribe.push(generateCodeSusbcr);
      } else {
        return;
      }
    } else {
      this.onUpdate();
    }
  }

  async showSwal(titleText: string) {
    const { value: code } = await Swal.fire({
      title: 'Ingresa tu código de verificación',
      titleText,
      input: 'text',
      inputLabel: 'Código',
      inputAutoTrim: true,
      inputValidator: (result) => !result && 'Ingresa un código',
    });

    if (code) {
      this.form.code_modify.setValue(code);
      this.onUpdate();
    }
  }

  async onUpdate() {
    // let cont_quantity = 0;
    // this.cuts.value.map((cute) => { cont_quantity = cont_quantity + parseInt(cute.quantity); });

    const { visibility } = this.editEventForm.getRawValue();
    this.form.visibility.setValue([visibility]);

    // if (cont_quantity < parseInt(this.editEventForm.value.limit)) {  }

    let cuts = this.cutsToSend();
    if (cuts) {
      var { code_modify } = this.editEventForm.getRawValue();
      var transaction_info = this.editEventForm.getRawValue();
      delete transaction_info.categorieAdd;
      delete transaction_info.code_modify;

      var { translators } = this.editEventForm.getRawValue();
      let cop = translators.cop.replace('$', '').replace(',', '');
      let usd = translators.usd.replace('$', '').replace(',', '.');
      transaction_info.translators = { cop, usd };  
      const addEventSubscr = this.eventsService
        .update(
          { transaction_info, cuts, image: this.event.image, code_modify },
          this.uploadImage
        )
        .subscribe(
          (res: any) => {
            this.showMessage(
              1,
              `El evento ${this.form.name.value} ha sido actualizado correctamente!`
            );
            this.modal.close('success');
            this.router.navigate(['g12events']);
          },
          (err) => {
            console.log("ERROR", err)
            this.isLoading = false;
            Swal.fire(
              err,
              '',
              'error'
            );
            throw err;
          }
        );
      this.unsubscribe.push(addEventSubscr);
    } else {
      this.isLoading = false;
      this.showMessage(2, 'Hay campos vacios requeridos en los cortes');
    }
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
