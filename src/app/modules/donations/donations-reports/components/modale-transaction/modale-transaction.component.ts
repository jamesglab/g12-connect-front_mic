import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modale-transaction',
  templateUrl: './modale-transaction.component.html',
  styleUrls: ['./modale-transaction.component.scss']
})
export class ModaleTransactionComponent implements OnInit {
  transaction: any;
  constructor() { }

  ngOnInit(): void {
    console.log('tenemos la transaccion', this.transaction)
  }

}
