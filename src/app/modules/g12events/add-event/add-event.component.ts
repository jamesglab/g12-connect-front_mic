import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatSnackBar } from "@angular/material/snack-bar";

import { NotificationComponent } from "src/app/pages/_layout/components/notification/notification.component";
import { notificationConfig } from "src/app/_helpers/tools/utils.tool";
import { G12eventsService } from "../_services/g12events.service";
import * as moment from "moment";
import Swal from "sweetalert2";
//import { Donation } from '../_models/donation.model';

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
})
export class AddEventComponent implements OnInit {

  public addEventForm: FormGroup = null;
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];
  public select_cut = new FormControl(true);
  public cuts = new FormArray([]);
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

  //CREAOS EL FORMULARIO
  buildForm() {
    this.addEventForm = this.fb.group({
      type: ["G12_EVENT", [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      image: [null],
      category: [[]],
      categorieAdd: [""],
      init_date: [],
      finish_date: [],
      is_translator: [false],
      translators: this.fb.group({
        cop: [""],
        usd: [""]
      }),
      prices: this.fb.group({
        cop: [""],
        usd: [""],
      }),
      order_by: [null, [Validators.required]],
      image_banner: [null],
      visibility: [null],
      limit: [null],
      location: [],
      view_hubilo: [false],
      event_id_hubilo: [null],
    });
  }

  //CONSULTAMOS LAS CATEGORIAS DE LOS EVENTOS DISPONIBLES
  getCategories() {
    this.eventsService.getCategories().subscribe((res: any) => {
      this.categories = res;
    }, err => { throw err; });
  }

  //ACCEDEMOS A LOS CONTROLES DEL FOMULARIO
  get form() {
    return this.addEventForm.controls;
  }

  //CREAMO LA IMAGEN QUE VIENE DEL INPUT
  fileChangeEvent(image) {
    this.form.image.setValue(image.target.files[0]);
  }

  //VAMIDAMOS LOS CORTES QUE SERAN CREADOS
  cutsToSend() {
    let newCuts = [];
    let error = false;

    this.cuts.value.map((cut) => {
      if (cut.price_group_selected) {
        if (
          cut.name != "" &&
          cut.cop != "" &&
          cut.quantity != "" &&
          cut.date_init != "" &&
          cut.date_finish &&
          cut.price_group_cop != "" &&
          cut.price_group_usd != "" &&
          cut.quantity_register_max != "" &&
          cut.quantity_register_min != "" &&
          cut.description != ""
        ) {
          newCuts.push({
            name: cut.name,
            prices: { cop: cut.cop, usd: cut.usd != "" ? cut.usd : null },
            quantity: cut.quantity,
            date_init: moment(cut.date_init),
            date_finish: moment(cut.date_finish),
            price_group: {
              cop: cut.price_group_cop,
              usd: cut.price_group_usd != "" ? cut.price_group_usd : null,
            },
            module_flags: {
              see_box: cut.see_box,
              see_events: cut.see_events,
              see_massive: cut.see_massive
            },
            quantity_register_max: cut.quantity_register_max,
            quantity_register_min: cut.quantity_register_min,
            is_group: cut.price_group_selected,
            description: cut.description,
          });
        } else {
          error = true;
        }
      } else {
        if (
          cut.name != "" &&
          cut.cop != "" &&
          cut.quantity != "" &&
          cut.date_init != "" &&
          cut.date_finish &&
          cut.quantity_register_max != "" &&
          cut.quantity_register_min != "" &&
          cut.description != ""
        ) {
          newCuts.push({
            name: cut.name,
            prices: { cop: cut.cop, usd: cut.usd != "" ? cut.usd : null },
            quantity: cut.quantity,
            date_init: moment(cut.date_init),
            date_finish: moment(cut.date_finish),
            quantity_register_max: cut.quantity_register_max,
            quantity_register_min: cut.quantity_register_min,
            is_group: cut.price_group_selected,
            module_flags: {
              see_box: cut.see_box,
              see_events: cut.see_events,
              see_massive: cut.see_massive
            },
            description: cut.description,
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

  //MÉTODO PARA AGEGA UN NUEVO CORTE CON LOS CONTROLADORES NECESARIOS
  addCute() {
    this.cuts.push(
      new FormGroup({
        name: new FormControl(""),
        cop: new FormControl(""),
        usd: new FormControl(""),
        quantity: new FormControl(""),
        date_init: new FormControl(""),
        price_group_selected: new FormControl(false),
        price_group_usd: new FormControl(""),
        price_group_cop: new FormControl(""),
        date_finish: new FormControl(""),
        quantity_register_max: new FormControl(1),
        quantity_register_min: new FormControl(1),
        description: new FormControl(""),
        see_events: new FormControl(false),
        see_box: new FormControl(false),
        see_massive: new FormControl(false)
      })
    );
  }

  deleteCute(i) {
    this.cuts.removeAt(i);
  }

  pushCategorie() {
    let found = false;
    this.addEventForm.get("category").value.map((item) => {
      if (item == this.addEventForm.get("categorieAdd").value) {
        found = true;
      }
    });
    if (!found) {
      this.addEventForm
        .get("category")
        .value.push(this.addEventForm.get("categorieAdd").value);
      this.addEventForm.get("categorieAdd").setValue("");
    }
  }

  drop(event: CdkDragDrop<[]>) {
    moveItemInArray(
      this.addEventForm.get("category").value,
      event.previousIndex,
      event.currentIndex
    );
  }

  formatNumber(n) {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  formatCurrency(input: any, blur: string) {

    // get input value
    var input_val = input.target.value;

    // don't validate empty input
    if (input_val === "") { return; }

    // original length
    var original_len = input_val.length;

    // initial caret position 
    var caret_pos = input.target.selectionStart;

    // check for decimal
    if (input_val.indexOf(".") >= 0) {

      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      var decimal_pos = input_val.indexOf(".");

      // split number by decimal point
      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = this.formatNumber(left_side);

      // validate right side
      right_side = this.formatNumber(right_side);

      // On blur make sure 2 numbers after decimal
      if (blur === "blur") {
        right_side += "00";
      }

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val = "$" + left_side + "." + right_side;

    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = this.formatNumber(input_val);
      input_val = "$" + input_val;

      // final formatting
      if (blur === "blur") {
        input_val += ".00";
      }
    }

    // send updated string to input
    input.target.value = input_val;

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input.target.setSelectionRange(caret_pos, caret_pos);
  }

  //CREACION DEL EVENTO
  onSubmit() {
    //VALIDAMOS SI LOS CAMPOS EN EL FORMULARIO ESTAN COMPLETOS
    this.isLoading = true;
    if (this.addEventForm.invalid) {
      return;
    }

    //CONTADOR DE LOS CUPOS EN EL EVENTO
    let cont_quantity = 0;
    //VALIDAMOS LA CANTIDAD DE LOS USUASRIOS DISPONBLES EN LOS COTES
    this.cuts.value.map((cute) => {
      cont_quantity = cont_quantity + parseInt(cute.quantity);
    });

    //VALIDAMOS EL LIMITE DE USUARIOS POR A CANTIDAD DE LOS CORTES CREADOS
    if (cont_quantity <= parseInt(this.addEventForm.value.limit)) {
      //VALIDAMOS LA CREACION DE LOS CORTES
      let cuts = this.cutsToSend();
      // VALIDAMOS QUE EXISTAN CORTES
      if (this.cuts.value.length == 0) {
        //MOSRAMOS EL ERROR DE LOS CORTES
        this.isLoading = false;
        this.showMessage(2, "No has creado cortes");
      } else {

        if (cuts) {
          //CREAMOS EL EVENTO CON LOS DETALLES DEL EVENTO Y LOS CORTES
          var { translators } = this.addEventForm.getRawValue();
          let cop = translators.cop.replace("$", "").replace(",", "");
          let usd = translators.usd.replace("$", "").replace(",", ".");

          const updateEventSubscr = this.eventsService
            .create({ transaction_info: { ...this.addEventForm.getRawValue(), translators: { cop, usd } }, cuts })
            .subscribe(
              (res: any) => {
                this.isLoading = false;
                //MOSTRAMOS EL MENSAJE DE CREACION DEL EVENTO
                this.showMessage(
                  1,
                  `El evento ${this.form.name.value} ha sido creado correctamente!`
                );
                this.router.navigate(["g12events"]);
              },
              (err) => {
                this.isLoading = false;
                //MOSTRAMOS EL ERROR DE NO CREACION DEL EVENTO
                Swal.fire(
                  err ? err : "Ocurrio un error intenta mas tarde!",
                  "",
                  "error"
                );
              }
            );
          this.unsubscribe.push(updateEventSubscr);
        } else {
          this.isLoading = false;
          this.showMessage(2, "Hay campos vacios requeridos en los cortes");
        }

      }
    } else {
      this.isLoading = false;
      this.showMessage(2, "Verifica la capacidad de los cortes");
    }

  }

  //PODEMOS MOSTRAR UN MENSAJE
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
