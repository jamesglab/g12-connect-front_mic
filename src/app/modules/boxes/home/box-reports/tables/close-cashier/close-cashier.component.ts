import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/modules/_services/export.service';
import Swal from 'sweetalert2';
import { BoxService } from '../../../_services/Boxes.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-close-cashier',
  templateUrl: './close-cashier.component.html',
  styleUrls: ['./close-cashier.component.scss'],
})
export class CloseCashierComponent implements OnInit {
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
    public _boxService: BoxService,
    private cdr: ChangeDetectorRef,
    private exportService: ExportService
  ) {}

  ngOnInit() {
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
    this._boxService
      .reportsMyBox({ date_filter, box: this.box.id })
      .subscribe((res) => {
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
      this.exportService.exportAsExcelFile(
        export_data,
        `CIERRE_CAJERO_${this.box.name.toString().trim().toUpperCase()}`
      );
    } catch (error) {
      Swal.fire(
        error.message ? error.message : 'No pudimos procesar tu solicitud',
        '',
        'error'
      );
    }
  }
}
