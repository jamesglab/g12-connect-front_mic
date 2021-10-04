import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChartType } from '../../models/apex.model';
import { DonationsServices } from '../../../_services/donations.service';
import { totalDonutValues, validateChartValues } from '../../models/data';

@Component({
  selector: 'app-donut-transactions',
  templateUrl: './donut-transactions.component.html',
  styleUrls: ['./donut-transactions.component.scss']
})
export class DonutTransactionsComponent implements OnInit {

  public totalDonutValues: ChartType;
  maxDate = new Date();
  public filter = new FormControl(2, []);
  public currency = new FormControl('COP', []);
  public showChart = false;
  public range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) {
    //construimos la estructura de la chart
    this.totalDonutValues = totalDonutValues;

  }

  ngOnInit(): void {
    this.getTransactionsFilter();
  }

  //metodo para optener las transacciones por filtro
  getTransactionsFilter() {
    const filter = this.filter.value;
    const currency = this.currency.value;
    // no se ejecuta cuando el filtro es 6 por que se necesita el rango de fechas
    // se usa el getDateRange()
    if (filter != 6) {
      // se ejecuta el filtro de las transacciones por estados y tipo de moneda(currency)
      // 1 hoy
      // 2 semana
      // 3 mes
      // 4 año
      // 5 todo
      this._donationsServices.getTotalValueTransactions({ filter, currency }).subscribe(res => {
        // se renderizan las series y los labels que necesita la chart para mostrarse
        this.showChart = validateChartValues(res['series']);
        this.totalDonutValues.series = res['series'];
        this.totalDonutValues.labels = res['labels'];
        // se hace un detectChangues para cambiar la grafica por cada consulta
        this.cdr.detectChanges();
      });
    }
  }

  //metodo para traer las transacciones por rango de fechas
  getDateRage() {
    if (this.range.get('end').value) {
      const init_date = new Date(this.range.get('start').value).getTime();
      const finish_date = new Date(this.range.get('end').value.set("hours", 23)
        .set("minutes", 59)
        .set("seconds", 59)).getTime();
      const currency = this.currency.value;
      // Validamos si se ejecuta el metodo cuando se selecciona una fecha final mayor a la inicial
      if (finish_date >= init_date) {
        // el endPoint nos filtra por rango de fechas y moneda cuando el filtro esta en 6
        this._donationsServices.getTotalValueTransactions({ filter: 6, init_date, finish_date, currency }).subscribe(res => {
          // se renderizan las series y los labels que necesita la chart para mostrarse
          this.totalDonutValues.series = res['series'];
          this.showChart = validateChartValues(res['series']);
          this.totalDonutValues.labels = res['labels'];
          // se hace un detectChangues para cambiar la grafica por cada consulta
          this.cdr.detectChanges();
        });
      }
    }
  }
}
