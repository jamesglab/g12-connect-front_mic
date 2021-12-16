import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExportService } from 'src/app/modules/_services/export.service';
import Swal from 'sweetalert2';
import { BoxService } from '../../../_services/Boxes.service';

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
      //HACEMOS UN REDUCE PARA SUMAR LOS TOTALES
      return this.dataSource.reduce(
        //ACCEDEMOS A LOS VALORES POR OBJETOS Y CALCULAMOS LA POSICION IMPLEMENTADA
        (previus_value, object_data_source) =>
          previus_value + object_data_source[position],
        0
      );
    } else {
      return 0;
    }
  }

  //METODO PARA EXPORTAR LOS DATOS DE LA TABLA
  exportFiles() {
    try {
      //VALIDAMOS EL SELECTOR DE FECHA
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
        `CIERRE_CAJERO_${this.box.name
          .toString()
          .replace(/\s+/g, '')
          .trim()
          .toUpperCase()}`
      );
    } catch (error) {
      Swal.fire(
        error.message ? error.message : 'No pudimos procesar tu solicitud',
        '',
        'error'
      );
    }
  }

  exportUsersBox() {
    try {
      if (!this.date_filter.value) {
        throw new Error('Seleccióna una fecha');
      }

      if (this.dataSource?.length == 0) {
        throw new Error('No hay datos por descargar');
      }

      this._boxService
        .reportsUsersBox({
          date_filter: new Date(this.date_filter.value).getTime(),
          box: this.box.id,
        })
        .subscribe((res) => {
          let dataToExport = [];
          res.map((item) => {
            let newData = {
              Nombre: item.user?.name
                ? item.user.name.toString().toUpperCase()
                : 'N/A',
              Apellido: item.user?.last_name
                ? item.user.last_name.toString().toUpperCase()
                : 'N/A',
              'No. Documento': item.user?.identification
                ? item.user.identification
                : 'N/A',
              'Fecha Nacimiento': item.user?.birth_date
                ? new Date(item.user.birth_date)
                : 'N/A',
              Genero: item.user?.gender
                ? item.user.gender.toString().toUpperCase()
                : 'N/A',
              Telefono: item.user?.phone ? item.user.phone : 'N/A',
              'E-mail': item.user?.email ? item.user.email : 'N/A',
              Pais: item.user?.country
                ? item.user.country.toString().toUpperCase()
                : 'N/A',
              Departamento: item.user?.departament
                ? item.user.departament.toString().toUpperCase()
                : 'N/A',
              Municipio: item.user?.city ? item.user.city : 'N/A',
              'Tipo de Iglesia': item?.user?.type_church
                ? item?.user?.type_church.toString().toUpperCase()
                : 'N/A',
              Sede: item.church?.name
                ? item.church.name.toString().toUpperCase()
                : 'N/A',
              Pastor: item.pastor?.name
                ? `${item.pastor.name} ${
                    item.pastor.last_name ? item.pastor.last_name : ''
                  }`
                    .toString()
                    .toUpperCase()
                : 'N/A',
              'Lider Doce': item.leader?.name
                ? `${item.leader.name} ${
                    item.leader.last_name ? item.leader.last_name : ''
                  }`
                    .toString()
                    .toUpperCase()
                : 'N/A',
              'Fecha de Donación': new Date(item.created_at),
              'Referencia Transaccion': item.transaction.payment_ref
                ? item.transaction.payment_ref
                : 'N/A',
              Codigo: item.transaction.code ? item.transaction.code : 'N/A',
              'Metodo de pago': item.transaction.payment_method
                ? item.transaction.payment_method
                : 'N/A',
              'Nombre evento': item.donation?.name
                ? item.donation?.name.toString().toUpperCase()
                : 'N/A',
              'Nombre corte': item.cut?.name
                ? item.cut?.name.toString().toUpperCase()
                : 'N/A',
              Estado: item.transaction.status
                ? this.validateStatus(item.transaction.status)
                    .toString()
                    .toUpperCase()
                : 'N/A',
              Costo:
                item.cut.prices[
                  item.transaction.currency?.toString().toLowerCase()
                ],
              Moneda: item.transaction.currency
                ? item.transaction.currency.toString().toUpperCase()
                : 'N/A',
              'Tipo de Transacción': item.description_of_change
                ? 'DATAFONO'
                : 'EFECTIVO',
            };
            dataToExport.push(newData);
          });
          this.exportService.exportAsExcelFile(
            dataToExport,
            `USUARIOS_CAJERO_${this.box.name
              .toString()
              .replace(/\s+/g, '')
              .trim()
              .toUpperCase()}`
          );
        });
    } catch (error) {
      Swal.fire(error.message, '', 'error');
    }
  }

  validateStatus(status) {
    if (parseInt(status) == 1) {
      return 'Aprobado';
    } else if (parseInt(status) == 2) {
      return 'En proceso';
    } else if (parseInt(status) == 3) {
      return 'Cancelado/Declinado';
    }
  }

  validatePaymentMethod(payment_method) {
    console.log('tenemos caja', payment_method);
    if (payment_method.toLowerCase() == 'credit') {
      return 'Tarjeta de credito';
    } else if (payment_method.toLowerCase() == 'pse') {
      return 'PSE';
    } else if (payment_method.toLowerCase() == 'cash') {
      return 'Efectivo';
    } else if (payment_method.toLowerCase() == 'administration') {
      return 'Administración';
    } else if (payment_method.toLowerCase() == 'code') {
      return 'Codigo';
    } else if (payment_method.toLowerCase() == 'cajas mci') {
      return 'Caja MCI';
    }
  }
}
