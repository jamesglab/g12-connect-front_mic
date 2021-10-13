import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroupName } from '@angular/forms';
import { DonationsServices } from '../../../_services/donations.service';
import { ChartType } from '../../models/apex.model';
import { createBars, validateChartValues } from '../../models/data';


@Component({
  selector: 'app-bars-status-payments',
  templateUrl: './bars-status-payments.component.html',
  styleUrls: ['./bars-status-payments.component.scss']
})
export class BarsStatusPaymentsComponent implements OnInit {

  barsStatusPayment: ChartType;
  public filter = new FormControl(2);
  public payment_mehtod = new FormControl('pse');
  // public currency = new FormControl('COP', []);

  public showChart = false;
  constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getTransactionsFilter();
  }
  getTransactionsFilter() {
    const filter_date = this.filter.value;
    const method_payment = this.payment_mehtod.value;
    
    this._donationsServices.getTransactionMethodPayment({ filter_date, method_payment}).subscribe(res => {
      this.showChart = validateChartValues(res['series']);
      if (this.showChart){
        this.createBarsChart(res['series'], res['labels'])
      }
      this.cdr.detectChanges();
    }); 
  }

  createBarsChart(series, labels) {
    this.barsStatusPayment = createBars(
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
          columnWidth: "20%",//ASIGNAMOS EL MAXIMO PORCENTAJE DE LA BARRA
          distributed: true//PASAMOS EL PARAMETRO EN TRU PARA DISTIBUIRLAS
        }
      },
      {//PASAMOS EL PARAMETRO PARA NO MOSTRAR LOS DATALABES
        enabled: false
      },
      {//PASAMOS EL PARAMETRO PARA NO MOSTRAR LA LEGENDA
        show: false
      },
      {//PASAMOS EL OBJETO VACIO POR QUE NO NECESITAMOS FORMATEAR
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
