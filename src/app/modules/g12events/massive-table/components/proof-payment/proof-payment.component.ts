import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { G12eventsService } from '../../../_services/g12events.service';

@Component({
  selector: 'app-proof-payment',
  templateUrl: './proof-payment.component.html',
  styleUrls: ['./proof-payment.component.scss']
})
export class ProofPaymentComponent implements OnInit {

  public proof: any;
  constructor(private route: ActivatedRoute, private g12EventService: G12eventsService, private cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!this.proof){
      this.route.queryParams.subscribe((params) => {
        if (params.id){
          this.validateTrasaction(params.id);
          localStorage.removeItem('reference')  
        }else if (localStorage.getItem('reference')) {
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
        console.log('referencia ',res)
      }, err => { throw err; })
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
