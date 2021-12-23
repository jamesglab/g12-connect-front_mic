import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { G12eventsService } from '../../_services/g12events.service';
import { Donation } from '../../_models/donation.model';
import { EditEventComponent } from '../edit-event/edit-event.component';
import { GenerateCodesComponent } from '../generate-codes/generate-codes.component';
import { EmailEventComponent } from '../../email-event/email-event.component';
import { report } from 'process';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { ExportService } from 'src/app/modules/_services/export.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
})
export class EventsTableComponent implements OnInit {
  @Input() public search: String = '';
  public isLoading: boolean = false;
  public export_excel: boolean = false;
  private unsubscribe: Subscription[] = [];
  public email_image;

  public displayedColumns: String[] = [
    'image',
    'name',
    'description',
    'category',
    'status',
    'actions',
  ];
  public dataSource: MatTableDataSource<Donation[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private eventsService: G12eventsService,
    private modalService: NgbModal,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllEvents();
  }

  // VALDIAMOS LOS CAMBIOS QUE EXISTAN
  ngOnChanges(changes: SimpleChanges) {
    ///VALIDAMOS EL CAMBIO DEL FILTRO
    if (!changes.search.firstChange) {
      //APLICAMOS EL FILTRO
      this.applyFilter();
    }
  }

  //CONSULTAMOS LOS EVENTOS
  getAllEvents() {
    // CONSUMIMOS EL ENDPOINT PRA OBTENER LOS EVENTOS
    const goDataSubscr = this.eventsService
      .getAll({ type: 'G12_EVENT' })
      .subscribe(
        (res: any) => {
          //VALIDAMOS EL DATASOURCE
          if (!this.dataSource) {
            //CREAMOS EL DATASOUCE DE ANGULAR MATERIAL CON LA RESPUESTA
            this.dataSource = new MatTableDataSource<Donation[]>(res);
            //SETEAMOS EL PAGINADOR
            this.dataSource.paginator = this.paginator;
          } else {
            //AGREGAMOS A LA DATA DEL DATASOURCE DE ANGULAR MATERIAL LA RESPUESTA
            this.dataSource.data = res;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    this.unsubscribe.push(goDataSubscr);
  }

  //EDITAMOS UN EVENTO
  handleToEdit(element: Donation) {
    //CONSUMIMOS EL ENDPOINT DE DETALLE DE UN EVENTO
    this.eventsService.getById({ id: element.id }).subscribe((res) => {
      //CREAMOE EL MODAL Y ABRIMOS EL COMPONENTE DE EditEventComponent
      const MODAL = this.modalService.open(EditEventComponent, {
        size: 'lg', //TAMAÑO DEL MODAL
        centered: true, // CENTRAMOS EL MODAL
      });
      MODAL.componentInstance.event = res; //AGREGAMOS EL EVENTO A LA VARIABLE 'event' DEL COMPONENTE EditEventComponent
      MODAL.result.then((data) => {
        //CONSULTAMOS LA RESPUESTA DEL MODAL
        if (data == 'success') {
          //SI LA DATA ES SUCCESS
          this.getAllEvents(); //CONSULTAMOS LOS EVENTOS
        }
      });
    });
  }

  handleToCreateCodes(element) {
    this.eventsService.getById({ id: element.id }).subscribe((res) => {
      const MODAL = this.modalService.open(GenerateCodesComponent, {
        windowClass: 'fadeIn',
        size: 'lg',
        backdrop: true,
        keyboard: true,
        centered: true,
      });
      MODAL.componentInstance.event = res;
      MODAL.result.then((data) => {
        if (data == 'success') {
          this.getAllEvents();
        }
      });
    });
  }

  handleEmailEvent(event) {
    const MODAL = this.modalService.open(EmailEventComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true,
    });
    MODAL.componentInstance.event = event;
  }

  async handleReportConsolidate(donation) {
    Swal.fire(
      'Estamos procesando la informacion',
      'esto puede tardar un momento',
      'info'
    );
    this.export_excel = true;
    const reports = await Promise.all([
      new Promise((resolve, reject) => {
        this.eventsService.getMassiveReportConsolidate(donation.id).subscribe(
          (res) => {
            resolve({ masivos: res.reports });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      // REPORTE TOTAL DE DONACIONES NACIONALES
      new Promise((resolve, reject) => {
        this.eventsService.totalNationalReport(donation.id).subscribe(
          (res) => {
            const total_donations = [];
            res.reports.map((item, i) => {
              total_donations.push(this.createObjectReport(item, i));
            });
            resolve({ 'Det. Total Don Nal': total_donations });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      new Promise((resolve, reject) => {
        this.eventsService.totalBogota(donation.id).subscribe(
          (res) => {
            const total_donations = [];
            res.reports.map((item, i) => {
              total_donations.push(this.createObjectReport(item, i));
            });
            resolve({ 'Det. Total Don Bog': total_donations });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      new Promise((resolve, reject) => {
        this.eventsService.totalOtherG12(donation.id).subscribe(
          (res) => {
            const total_donations = [];
            res.reports.map((item, i) => {
              total_donations.push(this.createObjectReport(item, i));
            });
            resolve({ 'Det.G12.Otras': total_donations });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      new Promise((resolve, reject) => {
        this.eventsService.reportsNationals(donation.id).subscribe(
          (res) => {
            resolve({ Nacional: res.reports });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      new Promise((resolve, reject) => {
        this.eventsService.reportsInternationalMCI(donation.id).subscribe(
          (res) => {
            resolve({ 'Int-MCI': res.reports });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      new Promise((resolve, reject) => {
        this.eventsService.reportsInternationalOthers(donation.id).subscribe(
          (res) => {
            resolve({ 'Int-G12': res.reports });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      new Promise((resolve, reject) => {
        this.eventsService.reportsDetailBogota(donation.id).subscribe(
          (res) => {
            resolve({ 'Detalle bogota': res.reports });
          },
          (err) => {
            reject(err);
          }
        );
      }),

      new Promise((resolve, reject) => {
        this.eventsService.reportsConsolidate(donation.id).subscribe(
          (res) => {
            resolve({ Consolidado: res.reports });
          },
          (err) => {
            reject(err);
          }
        );
      }),
    ]);

    let constructor_reports = {
      // masivos: [
      //   {
      //     Hola: 1,
      //     Hola1: 1,
      //     Hola2: 1,
      //     Hola3: 1,
      //     Hola4: 1,
      //     Hola5: 1,
      //     Hola6: 1,
      //     Hola7: 1,
      //     Hola8: 1,
      //     Hola9: 1,
      //     Hola20: 1,
      //     Hola11: 1,
      //     Hola12: 1,
      //     Hola13: 1,
      //     Hola14: 1,
      //     Hola15: 1,
      //     Hola16: 1,
      //   },
      //   {
      //     Hola: '',
      //     Hola1: '',
      //     Hola2: '',
      //     Hola3: '',
      //     Hola4: '',
      //     Hola5: '',
      //     Hola6: '',
      //     Hola7: '',
      //     Hola8: '',
      //     Hola9: '',
      //     Hola20: '',
      //     Hola11: '',
      //     Hola12: '',
      //     Hola13: '',
      //     Hola14: '',
      //     Hola15: '',
      //     Hola16: '',
      //   },
      //   {
      //     Hola: 1,
      //     Hola1: 1,
      //     Hola2: 1,
      //     Hola3: 1,
      //     Hola4: 1,
      //     Hola5: 1,
      //     Hola6: 1,
      //     Hola7: 1,
      //     Hola8: 1,
      //     Hola9: 1,
      //     Hola20: 1,
      //     Hola11: 1,
      //     Hola12: 1,
      //     Hola13: 1,
      //     Hola14: 1,
      //     Hola15: 1,
      //     Hola16: 1,
      //   },
      // ],
    };

    this.export_excel = false;
    this.cdr.detectChanges();
    reports.map((one_report, i) => {
      Object.keys(one_report).map((key) => {
        if (reports[i][key].length > 0) {
          constructor_reports[key] = reports[i][key];
        }
      });
    });

    this.exportService.exportConsolidateWithStyles(
      constructor_reports,
      'Export'
    );
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

  createObjectReport(item, i) {
    return {
      No: i + 1,
      Nombre: item.user?.name ? item.user.name.toString().toUpperCase() : 'N/A',
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
      // 'Pastor de Sede': item.pastor_church ? `${item.pastor_church.name} ${item.pastor_church.last_name ? item.pastor_church.last_name : ''}` : 'N/A',
      'Fecha de Donación': new Date(item.transaction.created_at),
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
        ? this.validateStatus(item.transaction.status).toString().toUpperCase()
        : 'N/A',
      Costo:
        item.cut.prices[item.transaction.currency?.toString().toLowerCase()],
      Moneda: item.transaction.currency
        ? item.transaction.currency.toString().toUpperCase()
        : 'N/A',
    };
  }
  //VALIDAMOS EL ERROR DE LA IMAGEN Y ANEXAMOS LA IMAGEN DE CONEXION
  handleErrorImage($event: any) {
    $event.target.src = 'assets/media/logos/logoConexion12.png';
  }

  //APLICAMOS EL FILTRO DE ANGULAR MATERIAL
  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //ELIMINAMOS LAS SUBSCRIPCIONES QUE ABRIMOS CUANDO SE DESTRUYE EL COMPONENTE
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
