import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DonationsServices } from '../../../_services/donations.service';
@Component({
  selector: 'app-total-transactions',
  templateUrl: './total-transactions.component.html',
  styleUrls: ['./total-transactions.component.scss']
})
export class TotalTransactionsComponent implements OnInit {

  public total_transacitons : any = null;
  constructor(private _donationsServices : DonationsServices,private cdr: ChangeDetectorRef ) { }

  ngOnInit(): void {
    this.getTotalTransactions();
    
  }
  //usamos el endpoint que trae toda la data de las transaccion 
  getTotalTransactions(){
    this._donationsServices.getTotalTransactions().subscribe(res=>{
      this.total_transacitons = res;
      this.cdr.detectChanges();
    })
  }

}
