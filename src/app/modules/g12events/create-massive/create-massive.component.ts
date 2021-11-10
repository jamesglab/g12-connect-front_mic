import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRIES } from 'src/app/_helpers/tools/countrys.tools';
import { MONTHS_CREDIT_CARD, YEARS_CREDIT_CARD } from 'src/app/_helpers/tools/utils.tool';
import { G12eventsService } from '../_services/g12events.service';

@Component({
  selector: 'app-create-massive',
  templateUrl: './create-massive.component.html',
  styleUrls: ['./create-massive.component.scss']
})
export class CreateMassiveComponent implements OnInit {
  public masive_form: FormGroup;

  //ARRAYS
  public events: [] = [];
  public countries: any[] = COUNTRIES;//LISTADO DE PAISES
  public monthsCreditCard: any[] = MONTHS_CREDIT_CARD;//LISTADO DE MESES
  public yearsCreditCard: any[] = YEARS_CREDIT_CARD;//LISTADO DE AÑOS
  public pse_banks: [] = [];
  public financial_cuts: [] = [];

  //CONDICIONALES
  public payment = 'credit';
  public isLoading: boolean = false;

  constructor(private fb: FormBuilder, public _eventService: G12eventsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getEvents();
    this.getPseBanks();
  }

  buildForm() {
    //CREAMOS EL FORMULARIO REACTIVO CON SUS CORRESPONDIENTES OBJETOS DE FORMULARIO
    this.masive_form = this.fb.group({
      event_information: this.fb.group({//INFORMACION DEL EVENTO
        event: [null, Validators.required],
        quantity_tickets: [1, Validators.required],
        cut: [null, Validators.required],

      }),
      donor: this.fb.group({//INFORMACION DEL DONANTE
        country: ['Colombia', Validators.required],
        document: [null, Validators.required],
        document_type: [null, Validators.required],
        name: [null, Validators.required],
        last_name: [null, Validators.required],
        email: [null, Validators.required, Validators.email],
        phone: [null, Validators.required],
        address: [null, Validators.required],
        postal_code: [null, Validators.required],
      }),
      payment: this.fb.group({//INFORMACION DE PAGO
        currency: [{ value: null, disabled: true }, Validators.required],
        value: [{ value: null, disabled: true }, Validators.required],
        // NO ANEXAMOS LOS VALIDADORES PARA DESPUES VALIDAR POR METODO DE PAGO SELECCIONAFO
        credit: this.fb.group({ //PAGO CON TARJETA DE CREDITO 
          name: [null, Validators.required],
          number: [null, Validators.required],
          code: [null, Validators.required],
          month: [null, Validators.required],
          year: [null, Validators.required],
        }),
        pse: this.fb.group({ //PAGO CON PSE 
          bank: [null, Validators.required],
          type_person: ['0', Validators.required],
        }),
        cash: this.fb.group({ //PAGO CON EFECTIVO
          type_cash: [null, Validators.required]
        }),
      })
    });
    this.subscribeSelectors()
  }

  ///////////////////////////////////////////
  // SUBSCRIPCIONES DE CAMPOS DEL FORMULARIO
  //////////////////////////////////////////
  subscribeSelectors() {
    // NOS SUBSCRIBIMOS A LOS CAMBIOS DEL EVENTO SELECCIONADO
    this.event_information_controls.get('event').valueChanges.subscribe(event => {
      this.payment_controls.get('value').reset();
      this.payment_controls.get('currency').reset();
      this.event_information_controls.get('cut').reset();//REINICIAMOS EL CORTE SELECCIONADO
      this.financial_cuts = event.financialCut;//RENDERIZAMOS LOS CORTES SELECCIONADOS
    });

    // NOS SUBSCRIBIMOS A LOS CAMBIOS CUANDO SELECCIONEN EL CORTE
    this.event_information_controls.get('cut').valueChanges.subscribe(cut => {
      // VALIDAMOS LA SELECCION DEL CORTE
      if (cut?.id) {
        //SETEAMOS EL VALOR DE LA MONEDA A PAGAR
        this.payment_controls.get('currency').setValue(this.donor_value.country == 'Colombia' ? 'COP' : 'USD');
        //SETEAMOS EL VALOR DEL PAGO
        this.payment_controls.get('value').setValue(
          (this.donor_value.country == 'Colombia' ? cut.prices['cop'] : cut.prices['usd']) //VALIDAMOS LA MONEDA A PAGAR POR EL PAIS SELECCIONADO
          * this.event_information_controls.get('quantity_tickets').value//MULTIPLICAMOS EL VALOR POR LA CANTIDAD DE CUPOS
        );
      }
    });

    //NOS SUBSCRIBIMOS A LOS CAMBIOS DE LOS TICKETS
    this.event_information_controls.get('quantity_tickets').valueChanges.subscribe(tickets => {
      this.payment_controls.get('value').setValue(
        this.event_information_value?.cut?.prices ? //VALIDAMOS SI EL CORTE TIENE PRECIOS
          (this.donor_value.country == 'Colombia' ? this.event_information_value?.cut?.prices['cop'] : this.event_information_value?.cut?.prices['usd']) //VALIDAMOS LA MONEDA A PAGAR POR EL PAIS SELECCIONADO
          * tickets : 0//MULTIPLICAMOS EL VALOR POR LA CANTIDAD DE CUPOS
      );
    })

    //NOS SUBSCRIBIMOS A LOS VALORES DE EL PAIS QUE CAMBIEN
    this.donor_controls.get('country').valueChanges.subscribe(country => {
      this.payment_controls.get('currency').setValue(country == 'Colombia' ? 'COP' : 'USD');
      this.payment_controls.get('value').setValue((country == 'Colombia' ? this.event_information_value.cut.prices['cop'] : this.event_information_value.cut.prices['usd']) *
        this.event_information_value.quantity_tickets
      );
    })
  }

  //////////////////////////////
  //CONSULTAS AL BACKEND
  //////////////////////////////

  //CONSULTAMOS LOS EVENTOS
  getEvents() {
    this._eventService.getFilter({ type: 'G12_EVENT' }).subscribe(res => {
      this.events = res;//AGREGAMOS LOS EVENTOS
    }, err => {
      console.log('tuvimos un errror', err);
    });
  }

  //CONSULTAMOS LOS BANCOS DE PSE
  getPseBanks() {
    this._eventService.getPseBanks().subscribe(res => {
      this.pse_banks = res;
    }, err => {
      console.log('tuvimos un errror', err);
    });
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

  get donor_controls() {
    return this.masive_form.get('donor');
  }
  //DEVOLVEMOS LOS VALORES DEL DONANTE
  get donor_value() {
    return this.masive_form.get('donor').value;
  }

  //RETORNAMOS LOS VALORES DEL PAGO 
  get payment_value() {
    return this.masive_form.get('payment').value;
  }

  // RETORNAMOS LOS CONTROLES DEL PAGO
  get payment_controls() {
    return this.masive_form.get('payment')
  }
  submit() {
    // this.isLoading = true;
    console.log('form', this.masive_form)
  }
}
