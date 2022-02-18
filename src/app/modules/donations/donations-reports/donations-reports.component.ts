import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { DonationsServices } from '../_services/donations.service';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from '../../_services/export.service';
import {
  validatePaymentMethod,
  validateStatus,
} from 'src/app/_helpers/tools/validators.tool';

@Component({
  selector: 'app-donations-reports',
  templateUrl: './donations-reports.component.html',
  styleUrls: ['./donations-reports.component.scss'],
})
export class DonationsReportsComponent implements OnInit {
  //CONTROLES DE FORMULARIOS
  public status = new FormControl(1, []);
  public statusHours = new FormControl(1, []);
  public range = new FormGroup({
    start: new FormControl(moment()),
    end: new FormControl(moment()),
  });

  public payment_method = new FormControl(0, []);

  public dataSource: any;
  public dataSourceHours: any;

  //OBJECTS
  public paginator = {
    pageSize: 10,
    pageIndex: 0,
  };

  //NUMBERS
  public count: number = 0;
  public countHours: number = 0;

  //DATES
  public maxDate: Date;

  //BOOLEANS
  public isLoader: boolean = false;

  constructor(
    public readonly _donations: DonationsServices,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private exportService: ExportService
  ) {
    //INICIALIZAMOS EL MAXIMO DE LA FECHA AL DIA ACTUAL
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    //CONSULTAMOS LAS TRANSACCIONES
    this.getTransactions(this.paginator);
  }

  getTransactions(event?) {
    //AGREGAMOS EL PAGINADOR
    this.paginator = event;
    //CONSULTAMOS EL ENDPOINT CRANDO EL OBJETO DE LOS FILTROS(makeObjectFilters)
    this._donations
      .getTransaccionsDonations(this.makeObjectFilters(event))
      .subscribe((res: any) => {
        //AGREAMOS LOS CONTADORES DE LA TABLA
        this.count = res.count;
        //VALIDAMOS SI NO EXISTE EL DATASOURCE
        if (!this.dataSource) {
          //CREAMOS LOS OBJETOS DE LA TABLA
          this.dataSource = new MatTableDataSource<any[]>(
            this.getObjetcsToTable(res.transactions)
          );
          this.cdr.detectChanges();
        } else {
          //CREAMOS LOS OBJETOS DE LA TABLA
          this.dataSource.data = this.getObjetcsToTable(res.transactions);
          this.cdr.detectChanges();
        }
      });
  }

  //METODO PARA MAQUETAR LOS OBJETOS QUE SE MOSTRARAN EN LA TABLA
  getObjetcsToTable(data) {
    //CREAMOS VARIABLE DE LOS REPORTES
    let newReports = [];
    //MAPEAMOS LOS REPORTES DE LA CONSULTA
    data.map((element) => {
      //CREAMOS EL OBJETO QUE SE ANEXARA AL REPORTE
      const newReport = {
        reference: element.transaction.payment_ref
          ? element.transaction.payment_ref
          : '',
        name: element.user.name ? element.user.name : '',
        last_name: element.user.last_name ? element.user.last_name : '',
        document: element.user.identification
          ? element.user.identification
          : '',
        phone: element.user.phone ? element.user.phone : '',
        email: element.user.email ? element.user.email : '',
        offering_value:
          element?.transaction.payment_gateway.toString().toUpperCase() ==
          'STRIPE'
            ? element.transaction.amount / 100
            : element.transaction.amount,
        // offering_type: element.donation.name ? element.donation.name : '',
        created_at: moment(element.transaction.created_at).format(
          'DD/MM/YYYY hh:MM a'
        ),
        petition: element.transaction.petition
          ? element.transaction.petition
          : '',
        country: element.user.country ? element.user.country : '',
        transaction: element,
        payment: validatePaymentMethod(element.transaction.payment_method),
      };
      //AGREGAMOS EL OBJETO AL REPORTE
      newReports.push(newReport);
    });
    //RETORNAMOS LA DATA DEL REPORTE
    return newReports;
  }

  exportFile() {
    try {
      //VALIDAMOS SI LA TABLA NO TIENE DATOS
      if (this.dataSource.data.length == 0) {
        throw new Error('No hay datos por descargar');
      }

      this.isLoader = true;
      this._donations
        .downloadReportDonations(this.makeObjectFilters())
        .subscribe(
          (res: any) => {
            this.isLoader = false;

            if (res.length > 0) {
              const dataToExport = [];
              res.map((item) => {
                //CREAMOS EL OBJETO DE LA DESCARGA
                const newData = {
                  Referencia: item.transaction.payment_ref,
                  Nombre: item.user.name.toUpperCase(),
                  Apellido: item.user.last_name.toUpperCase(),
                  Identificación: item.user.identification,
                  Telefono: item.user.phone,
                  Email: item.user.email.toLowerCase(),
                  'Tipo de donacion': item.donation?.name.toUpperCase(),
                  Total:
                    item?.transaction.payment_gateway
                      .toString()
                      .toUpperCase() == 'STRIPE'
                      ? item.transaction.amount / 100
                      : item.transaction.amount,
                  Modena: item.transaction.currency.toUpperCase(),
                  'Metodo de pago': item.transaction.payment_method.toUpperCase(),
                  'Pasarela de pago': item.transaction.payment_gateway.toUpperCase(),
                  Fecha: moment(item.transaction.created_at).format(
                    'DD/MM/YYYY hh:MM a'
                  ),
                  Estado: validateStatus(item.transaction.status),
                  Peticion: item.transaction.petition,
                  Pais: item.user.country,
                };
                //AGREGAMOS EL OBJETO A LA DATA DE LA DESCARGA
                dataToExport.push(newData);
              });
              //VALIDAMOS EL DETECTOR CHANGUE
              this.cdr.detectChanges();
              this.exportService.exportAsExcelFile(
                dataToExport,
                'DONACIONES_MCI'
              );
            } else {
              throw new Error('No se Encontraron Datos');
            }
          },
          (err) => {
            throw new Error(err);
          }
        );
    } catch (error) {
      this.showMessage(3, error.message);
    }
  }

  ///////
  //TOOLS
  ///////
  makeObjectFilters(paginator?) {
    const objetc_filter = {
      init_date: this.range.get('start').value
        ? new Date(
            `${moment(this.range.get('start').value).format(
              'YYYY-MM-DD'
            )}T00:00:00.000`
          ).getTime()
        : null,
      finish_date: this.range.get('end').value
        ? new Date(
            `${moment(this.range.get('end').value).format(
              'YYYY-MM-DD'
            )}T23:59:00.000`
          ).getTime()
        : null,
      status: this.status.value != 0 ? this.status.value : '',
    };
    //VALIDAMOS SI EL OBJETO NECESITA SER PAGINADO
    if (paginator) {
      objetc_filter['quantity_page'] = paginator.pageSize
        ? paginator.pageSize
        : 10;
      objetc_filter['page'] = paginator.pageIndex ? paginator.pageIndex + 1 : 1;
    }

    return objetc_filter;
  }

  //METODO PARA MOSTRAR MENSAJES
  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(
      NotificationComponent,
      notificationConfig(type, message)
    );
  }
}
