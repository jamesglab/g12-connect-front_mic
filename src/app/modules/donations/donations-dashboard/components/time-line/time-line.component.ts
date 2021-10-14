import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DonationsServices } from '../../../_services/donations.service';
import { ChartType } from '../../models/apex.model';
import { chartTimeLine, validateChartValues } from '../../models/data';

@Component({
    selector: 'app-time-line',
    templateUrl: './time-line.component.html',
    styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {

    linewithDataChart: ChartType;
    showChart: boolean;
    public type_filter = new FormControl(2, []);
    public currency = new FormControl('COP', []);

    public filter = new FormControl('EFECTY', []);
    public selectedDonation = new FormControl(null, []);
    public payment_method = new FormControl('cash', []);
    public selectDonation = new FormControl(null, []);

    public donations: [] = [];

    constructor(private _donationsServices: DonationsServices, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getData();
        this.getDonations();
    }

    getDonations() {
        this._donationsServices.getDonationsMCI().subscribe((res: any) => {
            this.donations = res;
            this.cdr.detectChanges();
        })
    }

    getData() {
        this._donationsServices.getTimeLineTotals({
            type_filter: this.type_filter.value, filter: (this.type_filter.value == 1) ?
                this.selectedDonation.value.id : this.payment_method.value,
            currency: this.currency.value
        }).subscribe(res => {
            this.showChart = validateChartValues(res['series'][0].data.concat(res['series'][1].data));
            if (this.showChart) {
                this.createChartTimeLine(res['series'], res['categories'], this.currency.value)
            }
            this.cdr.detectChanges();
        })
    }

    createChartTimeLine(series, categories, currency) {
        this, this.linewithDataChart = chartTimeLine(
            series,//CREAMOS LAS SERIES
            {
                height: 380,//LE DAMOS UN MAXIMO PORCENTAJE AL TAMAÑO DE LA GRAFICA
                type: 'line',//CREAMOS EL TIPO DE GRAFICA
                zoom: {//DESHABILITAMOS EL ZOOM
                    enabled: false
                },
                toolbar: {//DESHABILITAMOS LAS BARRAS DE HERRAMIENTAS
                    show: false
                }
            },
            ['#556ee6', '#34c38f'],//CREAMOS LOS COLORES DE LAS LINEAS 
            {
                enabled: true,//DESHABILITAMOS LOS DATALABLES
            },
            {
                width: [3, 3],//CREAMOS LOS VALORES DE LA CURVA DE LA GRAFICA
                curve: 'straight'
            },
            {//CREAMOS EL GRID O LO QUE VA EN EL FONDO DE LA GRAFICA
                row: {//CREAMOS LOS VALORES DE LAS FILAS
                    colors: ['transparent', 'transparent'],
                    opacity: 0.2
                },
                borderColor: '#f1f1f1'
            },
            {//CREAMOS LOS VALORES DE LOS MARCADORES 
                size: 6
            },
            {//CREAMOS LOS VALORES DE LAS CATEGORIAS DEL EJE X 
                categories,
                title: {
                    text: 'Meses'
                }
            },
            {//CREAMOS LOS VALORES DE LAS CATEGORIAS DEL EJE Y
                title: {
                    text: ''
                },
                labels: {
                    formatter: function (value) {
                        return new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
                    }
                }
            },
            {//CREAMOS LOS VALORES DE LA LEGENDA
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            {//CREAMOS LOS VALORES QUE SE VAN A VISUALIZAR EN EL RESPONSIVE
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false
                        }
                    },
                    legend: {
                        show: false
                    },
                }
            }

        )
    }

}
