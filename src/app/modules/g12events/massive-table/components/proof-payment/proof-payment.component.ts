import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';

@Component({
  selector: 'app-proof-payment',
  templateUrl: './proof-payment.component.html',
  styleUrls: ['./proof-payment.component.scss']
})
export class ProofPaymentComponent implements OnInit {

  public countries: any[] = COUNTRIES;//LISTADO DE PAISES
  public proof_form: FormGroup;
  constructor(private fb: FormBuilder, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.buildForm();
  }


  buildForm() {
    //CREAMOS EL FORMULARIO REACTIVO CON SUS CORRESPONDIENTES OBJETOS DE FORMULARIO
    this.proof_form = this.fb.group({
      donor_information: this.fb.group({//INFORMACION DEL DONANTE
        country: [{ value: null, disabled: true }],
        name: [{ value: null, disabled: true }],
        last_name: [{ value: null, disabled: true }],
        email: [{ value: null, disabled: true }],
        phone: [{ value: null, disabled: true }],
        address: [{ value: null, disabled: true }],
        postal_code: [{ value: null, disabled: true }]
      }),
      payment_information: this.fb.group({//INFORMACION DE PAGO
        currency: [{ value: null, disabled: true }],
        value: [{ value: null, disabled: true }],
        donation_medium:[{ value: null, disabled: true }],
        reference :[{ value: null, disabled: true }],
        event:[{ value: null, disabled: true }]
      })
    });
  }
}
