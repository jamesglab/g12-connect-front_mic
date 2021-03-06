import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartType } from '../../models/apex.model';
import { DonationsServices } from '../../../_services/donations.service';
import {  chartWithDataTime, validateChartValues } from '../../models/data';
import * as moment from 'moment';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnInit {

  chartTransactionsHours: ChartType;//CREAMOS LA CHART DE TIPO CHARTTYPE;
  type_graph = 'count';
  public currency = new FormControl('USD', []);

  public showChart: boolean; // VALIDAREMOS EL COMPONENTE DE NO HAY DATOS POR MOSTRAR
  public dateRange = new FormControl(moment());//CREAMOS LA FECHA ACTUAL
  constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // INICIAMOS LA CHART EN LOS VALORES ACTUALES
    this.getFilterDateChart('total');
  }

  // METODO PARA CONSULTAR LA GRAFICA
  getFilterDateChart(type_graph?: string) {
    if (type_graph) {
      this.type_graph = type_graph;
    }
    // PASAMOS LOS FILTROS DE FECHAS 
    this._donationsServices.getDonationBy24Hour({
      ...this.createFilterRanges(),
      type_graph: this.type_graph,
      currency: this.type_graph == 'stripe_paypal' ? this.currency.value : 'COP'
    }).subscribe((res: any) => {
      // CREAMOS LA CHART CON LAS SERIES Y LAS CATEGORIAS
      // RES.SERIES VALORES Y 
      // RES.CATEGORIES VALORES X (FECHAS FIORMATO ISO 8601)
      // CREAMOS VARIABLE DE VALIDADOR
      let validateAllData = [];
      // RECORREMOS LOS DATOS DE LAS SERIES
      res.series.map((s, i) => {
        // VALIDAMOS LA ULTIMA SERIE
        if (i == (res.series.length - 1)) {
          // CONCATENAMOS LA ULTIMA SERIE
          const arrayData = validateAllData.concat(s.data);
          validateAllData = arrayData;
          // VALIDAMOS QUE EXISTAN AL MENOS UN DATO EN LA CHART
          this.showChart = validateChartValues(validateAllData);
          if (this.showChart) {
            this.createChartHours(res.series, res.categories, this.type_graph == 'stripe_paypal' ? this.currency.value : 'COP',
            )
          }
          // DETECTAMOS LOS CAMBIOS
          this.cdr.detectChanges();
        } else {
          // CONCATEMOS LOS DATOS DE LA SERIE
          const arrayData = validateAllData.concat(s.data);
          // ANEXAMOS LA CONCATENACION A LOS DATOS
          validateAllData = arrayData
        }
      });
    })
  }

  createChartHours(series, categories, currency) {
    this.chartTransactionsHours = chartWithDataTime(
      series,
      {
        height: 350,
        type: 'area',
      },
      {
        enabled: false,
      },
      {
        curve: 'smooth',
      },
      {
        type: 'datetime',
        categories,
      },

      {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
        y: {
          formatter: function (value) {
            return new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);

          }
        }
      },

    )
  }
  //***CREAMOS LOS FILTROS DE LA CONSULTA***///
  //filter_date_init CREAMOS LA FECHA INCIAL DESDE LA HORA 0 MINUTO 0 SEGUNDO 0 
  //filter_date_finish CREAMOS LA FECHA FINAL DESDE LA HORA 23 MINUTO 29 SEGUNDO 29
  createFilterRanges() {
    return {
      filter_date_init: new Date(this.dateRange.value.set('hours', 0).set('minutes', 0).set('seconds', 0).toISOString()).getTime(),
      filter_date_finish: new Date(this.dateRange.value.set('hours', 23).set('minutes', 59).set('seconds', 59).toISOString()).getTime()
    }
  }
}
