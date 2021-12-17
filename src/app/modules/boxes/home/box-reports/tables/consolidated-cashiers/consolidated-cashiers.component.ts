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

  public headers_report = {
    total_registers: 'TOTAL REGISTRADOS',
    diner_cash_cop: 'DINERO EFECTIVO COP',
    diner_cash_usd: 'DINERO EFECTIVO USD',
    diner_dathaphone_cop: 'DINERO DATAFONO COP',
    diner_dathaphone_usd: 'DINERO DATAFONO USD',
    name_box_user: 'NOMBRE DE CAJA',
    total_cop: 'TOTAL COP',
    total_usd: 'TOTAL USD',
  };

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
            let export_consolidate = [];

            res.map((report) => {
              export_consolidate.push(this.validateObjectReport(report));
            });

            export_consolidate.push(this.calculateTotalReport(res));

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

  //VALIDAREMOS OBJETO A OBJETO
  validateObjectReport(object) {
    try {
      let new_object_report = {
        'NOMBRE DE CAJA': '',
      };
      Object.keys(object).map((key) => {
        if (this.headers_report[key]) {
          new_object_report[this.headers_report[key]] = object[key];
        } else {
          new_object_report[key] = object[key];
        }
      });
      return new_object_report;
    } catch (error) {
      return error;
    }
  }

  calculateTotalReport(array) {
    try {
      let total_object = {
        'NOMBRE DE CAJA': 'TOTAL',
      };
      Object.keys(array[0]).map((key) => {
        if (typeof array[0][key] == 'number') {
          if (this.headers_report[key]) {
            total_object[this.headers_report[key]] = this.calculate_position(
              array,
              key
            );
          } else {
            total_object[key] = this.calculate_position(array, key);
          }
        }
      });
      return total_object;
    } catch (error) {
      return error;
    }
  }
}
