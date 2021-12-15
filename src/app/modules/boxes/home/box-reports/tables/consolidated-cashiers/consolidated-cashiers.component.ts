import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExportService } from 'src/app/modules/_services/export.service';
import Swal from 'sweetalert2';
import { BoxService } from '../../../_services/Boxes.service';

@Component({
  selector: 'app-consolidated-cashiers',
  templateUrl: './consolidated-cashiers.component.html',
  styleUrls: ['./consolidated-cashiers.component.scss'],
})
export class ConsolidatedCashiersComponent implements OnInit {
  @Input() box;
  public date_filter = new FormControl({ value: '', disabled: true });
  public isLoading: boolean = false;
  public displayedColumns: string[] = [
    'name_event',
    'quantity_users',
    'diner_cash_cop',
    'diner_cash_usd',
    'diner_dathaphone_cop',
    'diner_dathaphone_usd',
    'total_cop',
    'total_usd',
  ];

  public dataSource = [];

  constructor(
    private _boxService: BoxService,
    private cdr: ChangeDetectorRef,
    private _exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.subscribeInputs();
  }

  //NOS SUBSCRIBIMOS A LOS CAMBIOS DE LOS INPUTS EN EL COMPONENTE
  subscribeInputs() {
    //FILTRO DE FECHAS
    this.date_filter.valueChanges.subscribe((date_filter) => {
      //CONSUMIMOS METODO Y CREAMOS EL TIMESTAMP DE LA FECHA SELECCIONADA
      this.getReports(new Date(date_filter).getTime());
    });
  }

  //METODO PARA CONSUMIR EL API
  getReports(date_filter) {
    //CONSUMIMOS EL REPORTE POR FECHA Y POR CAJA
    this._boxService.reportsAllBox({ date_filter }).subscribe((res) => {
      this.dataSource = [];
      this.dataSource = res;
      this.cdr.detectChanges();
    });
  }

  //CONTADORES RECIBIMOS LA POSICION DEL CONTADOR
  public calculate_position(position: string) {
    //CALCULAMOS LOS VALORES Y RETORNAMOS LOS TOTALES POR FILAS
    if (this.dataSource) {
      return this.dataSource.reduce((accum, curr) => accum + curr[position], 0);
    } else {
      return 0;
    }
  }

  //METODO PARA EXPORTAR LOS DATOS
  exportFiles() {
    try {
      //VALIDAMOS QUE EXISTAN DATOS POR DESCARGAR
      if (this.dataSource.length == 0) {
        throw new Error('No hay datos por descargar');
      }

      let export_data = [];
      //MAPEAMOS LOS DATOS DE LA TABLA
      this.dataSource.map((r) => {
        //CREAMOS LOS DATOS DE LA TABLA
        export_data.push({
          Evento: r.name_event,
          'Cantidad de Usuarios': r.quantity_users,
          'Dinero Efectivo COP': r.diner_cash_cop,
          'Dinero Efectivo USD': r.diner_cash_usd,
          'Dinero Datafono COP': r.diner_dathaphone_cop,
          'Dinero Datafono USD': r.diner_dathaphone_usd,
          'Total COP': r.total_cop,
          'Total USD': r.total_usd,
        });
      });

      //CALCULAMOS LOS TOTALES
      export_data.push({
        Evento: 'TOTAL',
        'Cantidad de Usuarios': this.calculate_position('quantity_users'),
        'Dinero Efectivo COP': this.calculate_position('diner_cash_cop'),
        'Dinero Efectivo USD': this.calculate_position('diner_cash_usd'),
        'Dinero Datafono COP': this.calculate_position('diner_dathaphone_cop'),
        'Dinero Datafono USD': this.calculate_position('diner_dathaphone_usd'),
        'Total COP': this.calculate_position('total_cop'),
        'Total USD': this.calculate_position('total_usd'),
      });
      this._exportService.exportAsExcelFile(export_data,'CONSOLIDADO_CAJEROS')
    } catch (error) {
      Swal.fire(
        error.message ? error.message : 'No pudimos procesar tu solicitud',
        '',
        'error'
      );
    }
  }
}
