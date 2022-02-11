import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ExportService } from '../../_services/export.service';
import { G12eventsService } from '../_services/g12events.service';

@Component({
  selector: 'app-cupons-reports',
  templateUrl: './cupons-reports.component.html',
  styleUrls: ['./cupons-reports.component.scss']
})
export class CuponsReportsComponent implements OnInit {

  public isLoading: boolean = false;
  public isLoadingExport: boolean = false;

  public events: { [key: string]: any }[] = [];
  public dataReports: [] = [];
  public countReports: number = 0;

  //INPUTS
  search = new FormControl('', [Validators.required]);
  event = new FormControl(null)

  constructor(public _eventService: G12eventsService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private exportService: ExportService) { }


  ngOnInit(): void {
    this.getEvents();
    this.search.disable()
  }


  getEvents() {
    this._eventService.getAll({ type: "G12_EVENT" }).subscribe((res) => {
      this.events = res || [];
    }, err => { throw err; });
  }

  getCupons(paginator?, type?: string) {

    if (this.event.valid) {
      this.isLoading = true;
      const filtered = {
        page: paginator ? paginator.pageIndex + 1 : 1,
        per_page: paginator ? paginator.pageSize : 10,
        type,
        event_id: this.event.value,
      }

      if (filtered.event_id == 'all') {
        delete filtered.event_id
      }

      if (type.toLowerCase() == 'paginate') {

        if (this.search.value) {
          filtered['filter'] = this.search.value;
          filtered['type'] = 'filter';
        }
        this.search.disable()
        this._eventService.cuponsReports(filtered).subscribe((res: any) => {
          this.isLoading = false;
          this.dataReports = res.reports;
          if (this.dataReports.length>0){
            this.search.enable();
          }
          this.countReports = res.count;
          this.cdr.detectChanges();
        }, err => {
          Swal.fire('No pudimos obtener los reportes', '', 'error');
        })
      } else {

        delete filtered.per_page, filtered.page;
        if (this.dataReports.length != 0) {
          this.isLoadingExport = true;
          this._eventService.cuponsReports(filtered).subscribe((res: any) => {
            this.isLoadingExport = false;
            const dataToExport = []
            res.map(item => {
              const newData = {
                'CODIGO': item?.transaction.code ? item?.transaction.code : 'N/A',
                'REFERENCIA': item?.transaction.payment_ref ? item?.transaction.payment_ref : 'N/A',
                'METODO DE PAGO': item?.transaction.payment_method ? this.validatePaymentMethod(item?.transaction.payment_method) : 'N/A',
                'ESTADO': item?.transaction.code ? this.validateStatus(item?.transaction.status) : 'N/A',
                'DESCRIPCIÓN': item?.transaction.response ? item?.transaction.response : 'N/A',
                'EVENTO': item?.donation.name ? item?.donation.name : 'N/A',
              }
              dataToExport.push(newData)
            });
            this.exportService.exportAsExcelFile(dataToExport, 'CUPONES_EVENTOS_G12');
            this.cdr.detectChanges();
          }, err => {
            Swal.fire('No pudimos obtener los reportes', '', 'error');
          })
        } else {
          Swal.fire('No hay datos por descargar', '', 'info');
        }



      }

    } else {
      Swal.fire('Seleccióna un evento', '', 'info');
    }
  }

  // downloadCupons() {

  //   if (this.dataReports.length != 0) {
  //     this.isLoadingExport = true;
  //     this._eventService.cuponsReports({
  //       event_id: this.event.value,
  //       type: 'download'
  //     }).subscribe((res: any) => {
  //       this.isLoadingExport = false;
  //       const dataToExport = []
  //       res.map(item => {
  //         const newData = {
  //           'CODIGO': item?.transaction.code ? item?.transaction.code : 'N/A',
  //           'REFERENCIA': item?.transaction.payment_ref ? item?.transaction.payment_ref : 'N/A',
  //           'METODO DE PAGO': item?.transaction.payment_method ? this.validatePaymentMethod(item?.transaction.payment_method) : 'N/A',
  //           'ESTADO': item?.transaction.code ? this.validateStatus(item?.transaction.status) : 'N/A',
  //           'DESCRIPCIÓN': item?.transaction.response ? item?.transaction.response : 'N/A',
  //           'EVENTO': item?.donation.name ? item?.donation.name : 'N/A',
  //         }
  //         dataToExport.push(newData)
  //       });
  //       this.exportService.exportAsExcelFile(dataToExport, 'CUPONES_EVENTOS_G12');
  //       this.cdr.detectChanges();
  //     }, err => {
  //       Swal.fire('No pudimos obtener los reportes', '', 'error');
  //     })
  //   } else {
  //     Swal.fire('No hay datos por descargar', '', 'info');
  //   }
  // }

  filteredParams(type, paginate) {

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
    }
  }



}
