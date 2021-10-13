import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChartType } from '../../models/apex.model';
import { DonationsServices } from '../../../_services/donations.service';
import { validateChartValues, donutChart } from '../../models/data';


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
        if (this.showChart) {
          // CREAMOS LA DONA
          this.createDonut(res['series'], res['labels'], currency)
        }
        // se hace un detectChangues para cambiar la grafica por cada consulta
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
          this.showChart = validateChartValues(res['series']);
          if (this.showChart) {
            // CREAMOS LA DONA
            this.createDonut(res['series'], res['labels'], currency)
          }
          // se hace un detectChangues para cambiar la grafica por cada consulta
          this.cdr.detectChanges();
        });
      }
    }
  }

  createDonut(series, labels, currency) {
    this.totalDonutValues = donutChart(
      series,//ENVIAMOS LAS SERIES
      labels,//ENVIAMOS LOS LABEL
      {  //CREAMOS EL TIPO DE DONA QUE SE VA A MOSTRAR ACCEDIENTO AL CHART Y ENVIANDO LOS DATOS NECESARIOS
        height: 350,//ENCIAMOS EL TAMAÑO QUE TENDRA LA CHART
        type: 'pie',//INDICAMOS EL TIPO PIE DE LA DONA QUE NOS PROPORCIONA LA LIBRERIA
      },
      { //ENVIAMOS EL LENG PARA MOSTRAR LAS CATEGORIAS QUE PROPORCIONA LA LIBRERIA (LABELS)
        show: true,//MOSTRAMOS LAS CATEGORIAS
        position: 'bottom',//LAS POSICIONAMOS AL FINAL
        horizontalAlign: 'center',//ALINIAMOS AL CENTRO LA GRAFICA
        floating: false,//PASAMOS EL VALOR DE FLOTAR EN FALSE
        fontSize: '14px',//MANDAMOS EL TAMAÑO DE LAS LETRAS
        formatter: function (val, opts) {//PASAMOS EL FORMATO DEL VALOR ACCEDEMOS A LA SERIE Y FORMATEAMOS EL VALOR
          return val + " - " + new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(opts.w.globals.series[opts.seriesIndex]);;
        },
        offsetY: -10,//PONEMOS UN MARGIN 
      },
      {//PASAMOS EL RESULTADO RESPONSIVE
        breakpoint: 600,
        options: {
          chart: {
            height: 240,//TAMAÑO CUANDO EA RESPONSIVE
          },
        },
      },
    );
    this.cdr.detectChanges();
  }
}
