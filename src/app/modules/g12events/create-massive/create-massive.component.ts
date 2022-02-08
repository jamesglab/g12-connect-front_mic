import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { COUNTRIES } from 'src/app/_helpers/tools/countrys.tools';
import {
  MONTHS_CREDIT_CARD,
  YEARS_CREDIT_CARD,
} from 'src/app/_helpers/tools/utils.tool';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { G12eventsService } from '../_services/g12events.service';

@Component({
  selector: 'app-create-massive',
  templateUrl: './create-massive.component.html',
  styleUrls: ['./create-massive.component.scss'],
})
export class CreateMassiveComponent implements OnInit {
  public masive_form: FormGroup;

  //ARRAYS
  public events: [] = [];
  public countries: any[] = COUNTRIES; //LISTADO DE PAISES
  public monthsCard: any[] = MONTHS_CREDIT_CARD; //LISTADO DE MESES
  public yearsCard: any[] = YEARS_CREDIT_CARD; //LISTADO DE AÑOS
  public pse_banks: [] = [];
  public financial_cuts: [] = [];

  //CONDICIONALES
  public payment_type = 'card'; //TIPO DE PAGO
  public isLoading: boolean = false; //SPINNER DE LOADER

  constructor(
    private fb: FormBuilder,
    public _eventService: G12eventsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEvents();
    this.getPseBanks();
  }

  buildForm() {
    //CREAMOS EL FORMULARIO REACTIVO CON SUS CORRESPONDIENTES OBJETOS DE FORMULARIO
    this.masive_form = this.fb.group({
      event_information: this.fb.group({
        //INFORMACION DEL EVENTO
        event: [null, Validators.required],
        quantity_tickets: [1, Validators.required],
        cut: [null, Validators.required],
      }),
      donor_information: this.fb.group({
        //INFORMACION DEL DONANTE
        country: ['Colombia', Validators.required],
        document: [null, Validators.required],
        document_type: [null, Validators.required],
        name: [null, Validators.required],
        last_name: [null, Validators.required],
        email: [
          null,
          Validators.compose([Validators.required, Validators.email]),
        ],
        phone: [null, Validators.required],
        address: [null],
      }),
      payment_information: this.fb.group({
        //INFORMACION DE PAGO
        currency: [null, Validators.required],
        value: [null, Validators.required],
        // NO ANEXAMOS LOS VALIDADORES PARA DESPUES VALIDAR POR METODO DE PAGO SELECCIONAFO
        card: this.fb.group({
          //PAGO CON TARJETA DE cardO
          card_name: [null, Validators.required],
          card_number: [null, Validators.required],
          cvc: [null, Validators.required],
          month: [null, Validators.required],
          year: [null, Validators.required],
        }),
        pse: this.fb.group({
          //PAGO CON PSE
          bank: [null, Validators.required],
          type_person: ['0', Validators.required],
        }),
        cash: this.fb.group({
          //PAGO CON EFECTIVO
          point_payment: [null, Validators.required],
          add_days: [1],
        }),

        paypal: this.fb.group({
          //PAGO POR PAYPAL
        }),

        box: this.fb.group({
          //PAGO POR CAJA
        }),
      }),
    });
    this.subscribeSelectors();
  }

  ///////////////////////////////////////////
  // SUBSCRIPCIONES DE CAMPOS DEL FORMULARIO
  //////////////////////////////////////////
  subscribeSelectors() {
    // NOS SUBSCRIBIMOS A LOS CAMBIOS DEL EVENTO SELECCIONADO
    this.event_information_controls
      .get('event')
      .valueChanges.subscribe((event) => {
        this.payment_information_controls.get('value').reset();
        this.payment_information_controls.get('currency').reset();
        this.event_information_controls.get('cut').reset(); //REINICIAMOS EL CORTE SELECCIONADO
        this.financial_cuts = event.financialCut; //RENDERIZAMOS LOS CORTES SELECCIONADOS
      });

    // NOS SUBSCRIBIMOS A LOS CAMBIOS CUANDO SELECCIONEN EL CORTE
    this.event_information_controls.get('cut').valueChanges.subscribe((cut) => {
      // VALIDAMOS LA SELECCION DEL CORTE
      if (cut?.id) {
        //SETEAMOS EL VALOR DE LA MONEDA A PAGAR
        this.payment_information_controls
          .get('currency')
          .setValue(
            this.donor_information_value.country == 'Colombia' ? 'COP' : 'USD'
          );
        //SETEAMOS EL VALOR DEL PAGO
        this.payment_information_controls.get('value').setValue(
          (this.donor_information_value.country == 'Colombia'
            ? cut.prices['cop']
            : cut.prices['usd']) * //VALIDAMOS LA MONEDA A PAGAR POR EL PAIS SELECCIONADO
            this.event_information_controls.get('quantity_tickets').value //MULTIPLICAMOS EL VALOR POR LA CANTIDAD DE CUPOS
        );
      }
    });

    //NOS SUBSCRIBIMOS A LOS CAMBIOS DE LOS TICKETS
    this.event_information_controls
      .get('quantity_tickets')
      .valueChanges.subscribe((tickets) => {
        this.payment_information_controls.get('value').setValue(
          this.event_information_value?.cut?.prices //VALIDAMOS SI EL CORTE TIENE PRECIOS
            ? (this.donor_information_value.country == 'Colombia'
                ? this.event_information_value?.cut?.prices['cop']
                : this.event_information_value?.cut?.prices['usd']) * //VALIDAMOS LA MONEDA A PAGAR POR EL PAIS SELECCIONADO
                tickets
            : 0 //MULTIPLICAMOS EL VALOR POR LA CANTIDAD DE CUPOS
        );
      });

    //NOS SUBSCRIBIMOS A LOS VALORES DE EL PAIS QUE CAMBIEN
    this.donor_information_controls
      .get('country')
      .valueChanges.subscribe((country) => {
        this.payment_type = 'card';
        if (
          country != 'Colombia' &&
          !this.event_information_value.cut.prices['usd']
        ) {
          this.donor_information_controls.get('country').setValue('Colombia');
          Swal.fire('Precio del corte no disponible en dolares', '', 'info');
          return;
        }
        this.payment_information_controls
          .get('currency')
          .setValue(country == 'Colombia' ? 'COP' : 'USD');
        this.payment_information_controls
          .get('value')
          .setValue(
            (country == 'Colombia'
              ? this.event_information_value.cut.prices['cop']
              : this.event_information_value.cut.prices['usd']) *
              this.event_information_value.quantity_tickets
          );
      });
  }

  //////////////////////////////
  //CONSULTAS AL BACKEND
  //////////////////////////////

  //CONSULTAMOS LOS EVENTOS QUE TENGAN MASSIVOS DISPONIBLES
  getEvents() {
    this._eventService.getEventsMassive().subscribe(
      (res) => {
        console.log(res)
        this.events = res; //AGREGAMOS LOS EVENTOS
      },
      (err) => {
        console.log('tuvimos un errror', err);
      }
    );
  }

  //CONSULTAMOS LOS BANCOS DE PSE
  getPseBanks() {
    if (this.pse_banks.length == 0) {
      this._eventService.getPseBanks().subscribe(
        (res) => {
          this.pse_banks = res;
        },
        (err) => {
          console.log('tuvimos un errror', err);
        }
      );
    }
  }

  //CREAMOS EL PAGO
  submit() {
    if (this.event_information_value.quantity_tickets <= 0) {
      Swal.fire('Revisa los tiquetes que vas a comprar', '', 'info');
      return;
    }
    if (
      this.donor_information_controls.invalid ||
      this.event_information_controls.invalid ||
      this.payment_information_controls.get(this.payment_type).invalid
    ) {
      Swal.fire('Campos requeridos incompletos', '', 'info');
      return;
    }
    this.isLoading = true;
    this._eventService
      .createMassive({
        event_information: this.event_information_value,
        donor_information: {
          ...this.donor_information_value,
          email: this.donor_information_value.email.toLowerCase(),
        }, //HACEMOS UN DESTRUCTING DE LA INFORMACION DEL USUARIO Y ENVIAMOS EL EMAIL COMO LOWECASE
        payment_information: {
          platform: 'G12CONNECT',
          //EN EL VALOR VALIDAMOS EM METODO DE PAGO Y SI ES POR CREDITO Y NACIONAL MULTIPLICAMOS EL VALOR POR CENTAVOS DE DOLAR Y SI NO ENVIAMOS EL VALOR NORMAL
          value:
            this.donor_information_value.country != 'Colombia' &&
            this.payment_type == 'card'
              ? this.payment_information_value.value * 100
              : this.payment_information_value.value,
          currency: this.payment_information_value.currency,
          url_response: environment.url_response,
          payment_type:
            this.payment_type == 'card'
              ? this.donor_information_value.country == 'Colombia'
                ? 'epayco_credit'
                : 'stripe_credit'
              : this.payment_type,
          ...this.payment_information_value[this.payment_type],
        },
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          if (res.url) {
            window.open(res.url, '_blank');
            Swal.fire({
              title: res.message ? res.message : 'Transacción exitosa',
              text: '¿No puedes visualizar el metodo de pago?',
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: 'Abrir',
              cancelButtonText: 'Cerrar',
              icon: 'success',
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              // this.masive_form.reset();
              // this.payment_information_controls.get('cash').get('add_days').setValue(1);
              // this.donor_information_controls.get('country').setValue('Colombia');
              this.payment_type = 'card';
              if (result.isConfirmed) {
                localStorage.setItem('reference', res.ref);
                window.open(res.url, '_blank');
                this.router.navigate(['/g12events/massive']);
              } else {
                this.router.navigate(['/g12events/massive']);
              }
            });
          } else {
            Swal.fire(
              res.message ? res.message : 'Transacción exitosa',
              res.ref ? `Referencia de pago : ${res?.ref}` : '',
              'success'
            ).then((res) => {
              this.router.navigate(['/g12events/massive']);

              // this.masive_form.reset();
              // this.payment_information_controls.get('cash').get('add_days').setValue(1);
              // this.donor_information_controls.get('country').setValue('Colombia');
            });
          }
        },
        (err) => {
          Swal.fire(
            err ? err : 'No se pudo ejecutar la transaccion',
            '',
            'error'
          );
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      );
  }

  // /////////////////////////////////////////////
  //ACCESO A LOS VALORES Y CONTROLES DEL FORMULARIO
  // /////////////////////////////////////////////

  //DEVOLVEMOS LOS CONTROLES DE EL DONANTE
  get event_information_controls() {
    return this.masive_form.get('event_information');
  }

  get event_information_value() {
    return this.masive_form.get('event_information').value;
  }

  get donor_information_controls() {
    return this.masive_form.get('donor_information');
  }
  //DEVOLVEMOS LOS VALORES DEL DONANTE
  get donor_information_value() {
    return this.masive_form.get('donor_information').value;
  }

  //RETORNAMOS LOS VALORES DEL PAGO
  get payment_information_value() {
    return this.masive_form.get('payment_information').value;
  }

  // RETORNAMOS LOS CONTROLES DEL PAGO
  get payment_information_controls() {
    return this.masive_form.get('payment_information');
  }

  validateNumber(e) {
    if (e.key.match(/[0-9]/i) === null) {
      // Si la tecla pulsada no es la correcta, eliminado la pulsación
      e.preventDefault();
    }
  }
}
