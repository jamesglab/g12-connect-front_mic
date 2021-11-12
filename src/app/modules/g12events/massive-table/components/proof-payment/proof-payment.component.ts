import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proof-payment',
  templateUrl: './proof-payment.component.html',
  styleUrls: ['./proof-payment.component.scss']
})
export class ProofPaymentComponent implements OnInit {

  public proof: any;
  constructor() { }

  ngOnInit(): void {

  }

  //VALIDAMOS EL METODO DE CON EL QUE SE REALIZO LA DONACION
  validatePaymentMethod(payment_method) {
    if (payment_method.toLowerCase() == 'credit') {
      return 'Tarjeta de credito'
    } else if (payment_method.toLowerCase() == 'pse') {
      return 'PSE'
    } else if (payment_method.toLowerCase() == 'cash') {
      return 'Efectivo'
    } else if (payment_method.toLowerCase() == 'administration') {
      return 'Administración'
    } else if (payment_method.toLowerCase() == 'code') {
      return 'Codigo'
    }
  }


}
