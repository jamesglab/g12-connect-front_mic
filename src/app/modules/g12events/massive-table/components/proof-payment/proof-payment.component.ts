import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { G12eventsService } from '../../../_services/g12events.service';

@Component({
  selector: 'app-proof-payment',
  templateUrl: './proof-payment.component.html',
  styleUrls: ['./proof-payment.component.scss']
})
export class ProofPaymentComponent implements OnInit {

  public proof: any;
  constructor(private activeRoute: ActivatedRoute, private g12EventService: G12eventsService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    if (!this.proof) {
      `1`
      this.activeRoute.queryParams.subscribe((params) => {
        if (params.id_transaction) {
          this.validateTrasaction(params.id_transaction);
          localStorage.removeItem('reference');
        } else if (localStorage.getItem('reference')) {
          this.validateTrasaction(localStorage.getItem('reference'));
        }
      });
    }
  }

  //VALIDAMOS REFERENCIA DE PAGO
  validateTrasaction(params) {
    this.g12EventService.getTransactionInfo(params)
      .subscribe(res => {
        this.proof = res;
        this.cdr.detectChanges();
      }, err => {
        Swal.fire(err, '', 'error').then(res => {
          this.router.navigate(['/g12events/massive'])
          throw err;
        })
      })
  }

  //VALIDAMOS EL METODO DE CON EL QUE SE REALIZO LA DONACION
  validatePaymentMethod(payment_method) {
    console.log('validaremos metodo de pago',payment_method)
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
    } else if(payment_method.toUpperCase() == 'CAJAS MCI') {
      return 'Cajas MCI'
    }
    
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


}
