import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';



@Component({
  selector: 'app-cupons-table',
  templateUrl: './cupons-table.component.html',
  styleUrls: ['./cupons-table.component.scss']
})
export class CuponsTableComponent implements OnInit {

  displayedColumns: string[] = ['code', 'payment_ref','method_payment' ,'status', 'description', 'name_event'];
  @Input() dataSource = [];
  @Input() count: number = 0;
  @Output() paginator = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {

  }

  emitPage(event) {
    this.paginator.emit(event)
  }
  validateStatus(status) {
    if (parseInt(status) == 1) {
      return 'Aprobado'
    } else if (parseInt(status) == 2) {
      return 'En proceso'
    } else if (parseInt(status) == 3) {
      return 'Cancelado/Declinado'
    }
  }

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
