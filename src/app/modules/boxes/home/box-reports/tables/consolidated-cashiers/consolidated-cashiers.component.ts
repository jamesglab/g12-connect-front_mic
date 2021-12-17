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

  public dataSource;

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
    this._boxService.reportsAllBox({ date_filter }).subscribe(
      (res) => {
        this.dataSource = [];
        this.dataSource = res;
        this.cdr.detectChanges();
      },
      (err) => {
        throw new Error(err.message ? err.message : 'Error');
      }
    );
  }

  //CONTADORES RECIBIMOS LA POSICION DEL CONTADOR
  public calculate_position(array, position: string) {
    //CALCULAMOS LOS VALORES Y RETORNAMOS LOS TOTALES POR FILAS
    try {
      if (array) {
        //HACEMOS UN REDUCE PARA SUMAR LOS TOTALES
        return array.reduce(
          //ACCEDEMOS A LOS VALORES POR OBJETOS Y CALCULAMOS LA POSICION IMPLEMENTADA
          (previus_value, object_data_source) =>
            previus_value + object_data_source[position],
          0
        );
      } else {
        return 0;
      }
    } catch (error) {
      Swal.fire(error.message ? error.message : 'Error inesperado', 'info');
    }
  }
  //METODO PARA EXPORTAR LOS DATOS
  exportFiles() {
    try {
      if (!this.date_filter.value) {
        throw new Error('Seleccióna una fecha');
      }
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
        'Cantidad de Usuarios': this.calculate_position(
          this.dataSource,
          'quantity_users'
        ),
        'Dinero Efectivo COP': this.calculate_position(
          this.dataSource,
          'diner_cash_cop'
        ),
        'Dinero Efectivo USD': this.calculate_position(
          this.dataSource,
          'diner_cash_usd'
        ),
        'Dinero Datafono COP': this.calculate_position(
          this.dataSource,
          'diner_dathaphone_cop'
        ),
        'Dinero Datafono USD': this.calculate_position(
          this.dataSource,
          'diner_dathaphone_usd'
        ),
        'Total COP': this.calculate_position(this.dataSource, 'total_cop'),
        'Total USD': this.calculate_position(this.dataSource, 'total_usd'),
      });
      this._exportService.exportAsExcelFile(export_data, 'CONSOLIDADO_CAJEROS');
    } catch (error) {
      Swal.fire(
        error.message ? error.message : 'No pudimos procesar tu solicitud',
        '',
        'error'
      );
    }
  }

  async downloadConsolidated() {
    try {
      if (!this.date_filter.value) {
        throw new Error('Seleccióna una fecha');
      }
      //VALIDAMOS QUE EXISTAN DATOS POR DESCARGAR
      if (this.dataSource.length == 0) {
        throw new Error('No hay datos por descargar');
      }
      this.isLoading = true;
      this._boxService
        .consolidatedReports({
          date_filter: new Date(this.date_filter.value).getTime(),
        })
        .subscribe(
          (res) => {
            let export_consolidate = res || [];

            const total_values = {};
            //CACULAREMOS LOS TOTALES
            //RECORREMOS EL PRIMER OBJETO DEL ARRAY OBTENER LOS KEYS DE LOS OBJETOS
            Object.keys(res[0]).map((key) => {
              //VALIDAMOS SI LA KEY ES DE TIPO NUMERO
              if (typeof res[0][key] === 'number') {
                //CACULAMOS EL VALOR DE LA TABLA
                total_values[key] = this.calculate_position(
                  export_consolidate,
                  key
                );
              } else {
                //PONEMOS EL TOTAL DE LA KEY
                total_values[key] = 'TOTAL';
              }
            });
            //ANEXAMOS EL OBJETO A LOS VALORES
            export_consolidate.push(total_values);
            //GENERMOS EL DESCARGABLE
            this._exportService.exportAsExcelFile(
              export_consolidate,
              'consolidado'
            );
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          (err) => {
            throw new Error(err.message ? err.message : 'Error de endpoint');
          }
        );
    } catch (error) {
      Swal.fire(error.message ? error.message : 'Error', '', 'error');
    }
  }
}
