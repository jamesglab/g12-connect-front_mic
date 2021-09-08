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
  public maxDate: Date;
  public dataSource: any;
  public status = new FormControl(1, []);
  public payment_method = new FormControl(0, []);
  public info_to_export = [];
  public count = 0;
  public paginator = {
    pageSize: 10,
    pageIndex: 0
  };
  constructor(public readonly _donations: DonationsServices, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef, private exportService: ExportService,) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.getTransactions(this.paginator);

  }


  getTransactions(event?) {

    this.paginator = event;
    this._donations.getTransacciondDonations({
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
        'created_at': element.created_at,
        'petition': element.donation.petition ? element.donation.petition : '',
        'country': element.user.country ? element.user.country : ''

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
      console.log('tenemos la respuesta', res)

      res.map((item, i) => {
        res[i].transaction.status = this.validateStatus(item.transaction.status);
        res[i].transaction.payment_method = this.validatePaymentMethod(item.transaction.payment_method)
      });

      this.info_to_export = res;
      if (this.info_to_export.length > 0) {
        const dataToExport = [];
        this.info_to_export.map(item => {
          const newData = {
            fecha: new Date(item.created_at),
            'methodo de pago': item.transaction.payment_method,
            estado: item.transaction.status,
            costo: item.transaction.amount,
            moneda: item.transaction.currency,
            identificación: item.user.identification,
            nombre: item.user.name,
            apellido: item.user.last_name,
            email: item.user.email,
            telefono: item.user.phone,
            pais: item.user.country,
            ciudad: item.user.city,
            departamento: item.user.departament,
            genero: item.user.gender
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
