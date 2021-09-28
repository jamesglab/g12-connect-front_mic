import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { DonationsServices } from '../_services/donations.service';
import { notificationConfig } from 'src/app/_helpers/tools/utils.tool';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from '../../_services/export.service';

@Component({
  selector: 'app-donations-reports',
  templateUrl: './donations-reports.component.html',
  styleUrls: ['./donations-reports.component.scss']
})
export class DonationsReportsComponent implements OnInit {

  public range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  public rangeHours = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  public maxDate: Date;
  public dataSource: any;

  public dataSourceHours: any;

  public countHours: any;

  public status = new FormControl(1, []);
  public statusHours = new FormControl(1, []);


  public payment_method = new FormControl(0, []);
  public info_to_export = [];
  public count = 0;
  public paginator = {
    pageSize: 10,
    pageIndex: 0
  };

  public paginatorHours = {
    pageSize: 10,
    pageIndex: 0
  };
  constructor(public readonly _donations: DonationsServices, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private exportService: ExportService,) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getTransactions(this.paginator);
    this.getTransactionsByHours(this.paginator);

  }


  getTransactions(event?) {

    this.paginator = event;
    this._donations.getTransaccionsDonations({
      init_date: this.range.get('start').value ? new Date(moment(this.range.get('start').value).format()).getTime() : null,
      finish_date: this.range.get('end').value ? new Date(`${moment(this.range.get('end').value).format("YYYY-MM-DD")}T23:59:00.000`).getTime() : null,
      status: (this.status.value != 0) ? this.status.value : '',
      quantity_page: event.pageSize ? event.pageSize : 10,
      page: event.pageIndex ? event.pageIndex + 1 : 1
    }).subscribe((res: any,) => {
      this.count = res.count;
      res.transactions.map((item, i) => {
        res.transactions[i].transaction.status = this.validateStatus(item.transaction.status);
        res.transactions[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
      })
      if (!this.dataSource) {
        this.dataSource = new MatTableDataSource<any[]>(this.getObjetcsToTable(res.transactions));
        this.cdr.detectChanges();
      } else {
        this.dataSource.data = this.getObjetcsToTable(res.transactions);
        this.info_to_export = res.transactions;
      }
    });
  }


  getTransactionsByHours(paginator) {
    this.paginatorHours = paginator;

    this._donations.getTransaccionsDonations({
      init_date: this.rangeHours.get('start').value ? new Date(moment(this.rangeHours.get('start').value).format()).getTime() : null,
      finish_date: this.rangeHours.get('end').value ? new Date(`${moment(this.rangeHours.get('end').value).format("YYYY-MM-DD")}T23:59:00.000`).getTime() : null,
      status: (this.statusHours.value != 0) ? this.statusHours.value : '',
      quantity_page: paginator.pageSize ? paginator.pageSize : 10,
      page: paginator.pageIndex ? paginator.pageIndex + 1 : 1
    }).subscribe((res: any) => {
      console.log('tenemos la respuesta', res);
      this.countHours = res.count;
      res.transactions.map((item, i) => {
        res.transactions[i].transaction.status = this.validateStatus(item.transaction.status);
        res.transactions[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
      });
      if (!this.dataSourceHours) {
        this.dataSourceHours = new MatTableDataSource<any[]>(this.getObjetcsToTable(res.transactions));
        this.cdr.detectChanges();
      } else {
        this.dataSourceHours.data = this.getObjetcsToTable(res.transactions);
      }
    })
  }


  exportFileHours() {

  }
  getObjetcsToTable(data) {

    let newReports = [];
    data.map(element => {
      const newReport = {

        'reference': element.transaction.payment_ref ? element.transaction.payment_ref : '',
        'name': element.user.name ? element.user.name : '',
        'last_name': element.user.last_name ? element.user.last_name : '',
        'document': element.user.identification ? element.user.identification : '',
        'phone': element.user.phone ? element.user.phone : '',
        'email': element.user.email ? element.user.email : '',
        'offering_value': element.transaction.amount ? element.transaction.amount : '',
        'offering_type': element.donation.name ? element.donation.name : '',
        'payment': element.transaction.payment_method,
        'created_at': moment(element.transaction.created_at).format('DD/MM/YYYY hh:MM a'),
        'petition': element.donation.petition ? element.donation.petition : '',
        'country': element.user.country ? element.user.country : '',
        'transaction': element

      }
      newReports.push(newReport);
    });
    return newReports
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  validateStatus(status) {
    if (parseInt(status) == 1) {
      return 'Aprobado'
    } else if (parseInt(status) == 2) {
      return 'En proceso'
    } else if (parseInt(status) == 3) {
      return 'Cancelado/Declinado'
    }
  }

  validatePaymentMethod(payment_method) {
    if (payment_method.toLowerCase() == 'credit') {
      return 'Tarjeta de credito'
    } else if (payment_method.toLowerCase() == 'pse') {
      return 'PSE'
    } else if (payment_method.toLowerCase() == 'cash') {
      return 'Efectivo'
    } else if (payment_method.toLowerCase() == 'administration') {
      return 'Administración'
    } else if (payment_method.toLowerCase() == 'code') {
      return 'Codigo'
    } else if (payment_method.toLowerCase() == 'paypal') {
      return 'Paypal'
    }

  }

  exportFile() {
    this._donations.downloadReportDonations(
      {
        init_date: this.range.get('start').value ? new Date(moment(this.range.get('start').value).format()).getTime() : null,
        finish_date: this.range.get('end').value ? new Date(`${moment(this.range.get('end').value).format("YYYY-MM-DD")}T23:59:00.000`).getTime() : null,
        status: (this.status.value != 0) ? this.status.value : '',
      }

    ).subscribe((res: any) => {
      this.info_to_export = res;
      if (this.info_to_export.length > 0) {
        const dataToExport = [];
        this.info_to_export.map(item => {
          const newData = {
            Referencia: item.transaction.payment_ref,
            Nombre: item.user.name.toUpperCase(),
            Apellido: item.user.last_name.toUpperCase(),
            Identificación: item.user.identification,
            Telefono: item.user.phone,
            Email: item.user.email.toLowerCase(),
            'Tipo de donacion': item.donation.name.toUpperCase(),
            Total: item.transaction.amount,
            Modena: item.transaction.currency.toUpperCase(),
            'Metodo de pago': item.transaction.payment_method.toUpperCase(),
            'Pasarela de pago': item.transaction.payment_gateway.toUpperCase(),
            Fecha: moment(item.transaction.created_at).format('DD/MM/YYYY hh:MM a'),
            Estado: this.validateStatus(item.transaction.status),
            Peticion: item.transaction.petition,
            Pais: item.user.country,
          }
          dataToExport.push(newData)
        });
        this.exportService.exportAsExcelFile(dataToExport, 'DONACIONES_MCI');
      } else {
        this.showMessage(2, 'No hay datos por exportar');
      }

    });

  }
}
