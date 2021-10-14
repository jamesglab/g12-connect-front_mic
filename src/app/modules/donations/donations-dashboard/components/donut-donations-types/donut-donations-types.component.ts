import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DonationsServices } from '../../../_services/donations.service';
import { ChartType } from '../../models/apex.model';
import {  validateChartValues, donutChart } from '../../models/data';


@Component({
    selector: 'app-donut-donations-types',
    templateUrl: './donut-donations-types.component.html',
    styleUrls: ['./donut-donations-types.component.scss']
})
export class DonutDonationsTypesComponent implements OnInit {

    public filter = new FormControl(1, []);
    public currency = new FormControl('COP', []);
    public status = new FormControl(1, []);
    public showChart = false;
    simplePieChart: ChartType;
    constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.getTransactionsFilter();
    }

    getTransactionsFilter() {
        const filter_date = this.filter.value;
        const filter_payment = this.status.value;
        const currency = this.currency.value;
        this._donationsServices.getTotalTransactionsTypes({ filter_date, filter_payment, currency }).subscribe((res: any) => {
            this.showChart = validateChartValues(res['series']);

            if (this.showChart) {
                this.simplePieChart = donutChart(
                    // const totalDonutValues = donutChart(
                    res['series'],//ENVIAMOS LAS SERIES
                    res['labels'],//ENVIAMOS LOS LABEL
                    {  //CREAMOS EL TIPO DE DONA QUE SE VA A MOSTRAR ACCEDIENTO AL CHART Y ENVIANDO LOS DATOS NECESARIOS
                        height: 400,//ENCIAMOS EL TAMAÑO QUE TENDRA LA CHART
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
            }

                // this.simplePieChart = simplePieChartCreate(res['series'], res['labels'], currency);
            this.cdr.detectChanges();
        });
    }

}
