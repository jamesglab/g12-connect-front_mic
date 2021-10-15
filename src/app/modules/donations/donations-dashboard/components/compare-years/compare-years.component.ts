import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartType } from 'src/app/_metronic/partials/content/widgets/datasets/apex.model';
import { DonationsServices } from '../../../_services/donations.service';
import { createBars, validateChartValues } from '../../models/data';

@Component({
  selector: 'app-compare-years',
  templateUrl: './compare-years.component.html',
  styleUrls: ['./compare-years.component.scss']
})
export class CompareYearsComponent implements OnInit {

  page: number = 1;
  public filter = new FormControl(2, []);
  public currency = new FormControl('COP', []);
  public barsColumns: ChartType;
  public showChart = false;
  public totalsValues: any;

  constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) {


  }

  ngOnInit(): void {
    this.getFilterType(1);
    this.getTransactionsFilter();
  }

  getFilterType(type?) {
    const currency = this.currency.value;
    this._donationsServices.getTotalValuesOrQuantity({ filter: type, currency }).subscribe(res => {
      this.totalsValues = res;
      this.page = type;
      this.cdr.detectChanges();
    });
  }
  getTransactionsFilter() {
    const filter_date = this.filter.value;
    const currency = this.currency.value;
    if (this.page == 1) {
      this._donationsServices.getTotalTransactionsGraph({ filter_date, currency }).subscribe(res => {
        this.showChart = validateChartValues(res['series']);
        this.getFilterType(this.page);
        if (this.showChart) {
          this.createBarsChart(res['series'], res['labels'], currency);
        }
        // this.barsColumns = createBarsColumns(res['series'], res['labels'], currency);
      });
    } else {
      this._donationsServices.getTotalQuantityGraph({ filter_date, currency }).subscribe(res => {
        this.getFilterType(this.page);
        this.showChart = validateChartValues(res['series']);
        if (this.showChart) {
          this.createBarsChart(res['series'], res['labels'], currency);
        }
        // this.barsColumns = createBarsColumns(res['series'], res['labels'], currency)
      });
    }
  }
  

  createBarsChart(series, labels, currency) {
    this.barsColumns = createBars(
      [//CREAMOS LAS SERIES
        {
          name: "total",//PONEMOS TOTAL COMO DEFECTO DE LAS BARRAS QUE ESTAMOS USANDO
          data: series//ENVIAMOS LAS SERIES QUE SE CONSULTARON
        }
      ],
      {//CREAMOS LA CHART
        height: 350,//CREAMOS EL TAMAÑO DE LA CHAR EN BARRAS 
        type: "bar",//ASIGNAMOS EL TIPO DE CHART QUE VAMOS A USAR
      },
      {
        bar: {//CREAMOS LOS PARAMETROS DE LA BARRA
          columnWidth: "50%",//ASIGNAMOS EL MAXIMO PORCENTAJE DE LA BARRA
          distributed: true//PASAMOS EL PARAMETRO EN TRU PARA DISTIBUIRLAS
        }
      },
      {//PASAMOS EL PARAMETRO PARA NO MOSTRAR LOS DATALABES
        enabled: false
      },
      {//PASAMOS EL PARAMETRO PARA NO MOSTRAR LA LEGENDA
        show: false
      },
      {//CREAMOS EL FORMATO EN EL EJE Y PARA MOSTRAR EL FORMATO DE LOS VALORES EN PESOS
        labels: {
          formatter: function (value) {//FORMATEAMOS EL VALOR A LA MONEDA SELECCIONADA
            return new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
          }
        },
      },
      {//CREAMOS LA CATEGORIAS QUE SE VAN A MOSTRAR
        categories: labels,//ASIGNAMOS LOS LABELS QUE EXISTAN
        labels: {
          style: {
            colors: [//ASIGNAMOS LOS COLORES A LOS LABELS QUE SE VAN A MOSTRAR
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8",
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0"
            ],
            fontSize: "12px"
          }
        }
      }
    )
  }
}


