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
import { ExportService } from 'src/app/modules/_services/export.service';
import Swal from 'sweetalert2';
import { createObjectReport } from './moks/reports.mok';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
})
export class EventsTableComponent implements OnInit {
  @Input() public search: String = '';
  public isLoading: boolean = false;
  public export_excel = '';
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

  //METODO PARA CREAR UN CONSOLIDADO DE TODO EL EVENT
  async handleReportConsolidate(donation) {
    //VALIDAMOS SI HAY UN REPORTE EJECUANDOSE
    if (this.export_excel) {
      Swal.fire(
        'Se esta procesando tu solicitud',
        'intenta mas tarde',
        'warning'
      );
    } else {
      //MOSTRAMOS MENSAJE DE EJECUANDO EL REPORTE
      Swal.fire(
        'Estamos procesando la información',
        'esto puede tardar un momento',
        'info'
      );
      //AGREGAMOS EL ID DE LA DONACION A LA BANDERA DE REPORTE DE EXCEL
      this.export_excel = donation.id;

      //CREAMOS UNA VARIABLE CON LAS PROMESAS A EJECUTAR
      const reports = await Promise.all([
        //REPORTE DE EL CONSOLIDADO DE MASIVOS
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
                total_donations.push(createObjectReport(item, i));
              });
              resolve({ 'Det. Total Don Nal': total_donations });
            },
            (err) => {
              reject(err);
            }
          );
        }),

        //REPORTE DEL TOTAL DE DONACIONES
        new Promise((resolve, reject) => {
          this.eventsService.totalBogota(donation.id).subscribe(
            (res) => {
              const total_donations = [];
              res.reports.map((item, i) => {
                total_donations.push(createObjectReport(item, i));
              });
              resolve({ 'Det. Total Don Bog': total_donations });
            },
            (err) => {
              reject(err);
            }
          );
        }),
        //REPORTE DEL TOTAL DE OTRAS IGLESAS G12
        new Promise((resolve, reject) => {
          this.eventsService.totalOtherG12(donation.id).subscribe(
            (res) => {
              const total_donations = [];
              res.reports.map((item, i) => {
                total_donations.push(createObjectReport(item, i));
              });
              resolve({ 'Det.G12.Otras': total_donations });
            },
            (err) => {
              reject(err);
            }
          );
        }),
        //REPORTE DE NACIONALES
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
        //REPORTE DE INTERNACIONALES MCI
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
        //REPORTE DE INTERNACIONALES NO MCI
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
        //REPORTE DE DETALLADO DE BOGOTA
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
        //REPORTE EL CONSOLIDADO
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

      //REPORTE TOTAL
      let constructor_reports = {};
      //ABILITAMOS LA DESCARGA DE OTRO REPORTE
      this.export_excel = '';
      //HACEMOS UN DETECTOR DE LOS CAMBIOS EN EL HTML
      this.cdr.detectChanges();
      //RECORREMOS LOS REPORTES
      reports.map((one_report, i) => {
        //RECORREMOS LAS KEYS DE CADA REPORTE
        Object.keys(one_report).map((key) => {
          //VALIDAMOS SI EL REPORTE TIENE DATOS
          if (reports[i][key].length > 0) {
            //AGREGAMOS EL REPORTE COMO UNA NNUEVA HOJA DE EXCEL EN EL OBJEO
            constructor_reports[key] = reports[i][key];
          }
        });
      });
      //USAMOS EL SERVICIO PARA GENERAR EL REPORTE
      this.exportService.exportConsolidateWithStyles(
        constructor_reports,
        donation.name.toString().trim().toUpperCase()
      );
    }
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

  //MODALS

  //EDITAMOS UN EVENTO
  handleToEdit(element: Donation) {
    const MODAL = this.modalService.open(EditEventComponent, {
      size: 'lg', //TAMAÑO DEL MODAL
      centered: true, // CENTRAMOS EL MODAL
    });
    MODAL.componentInstance.event = element; //AGREGAMOS EL EVENTO A LA VARIABLE 'event' DEL COMPONENTE EditEventComponent
    MODAL.result.then((data) => {
      //CONSULTAMOS LA RESPUESTA DEL MODAL
      if (data == 'success') {
        //SI LA DATA ES SUCCESS
        this.getAllEvents(); //CONSULTAMOS LOS EVENTOS
      }
    });
    //CONSUMIMOS EL ENDPOINT DE DETALLE DE UN EVENTO
    // this.eventsService.getById({ id: element.id }).subscribe((res) => {
    //   //CREAMOE EL MODAL Y ABRIMOS EL COMPONENTE DE EditEventComponent

    // });
  }
  //MODAL DE CREACION DE CODIGOS POR EVENTO
  handleToCreateCodes(element) {
    //CONSULTAMOS EL EVENTO PO EL ID
    const MODAL = this.modalService.open(GenerateCodesComponent, {
      windowClass: 'fadeIn',
      size: 'lg',
      backdrop: true,
      keyboard: true,
      centered: true,
    });
    //AGREGAMOS EL EVENTO A LA INTANCIA DEL COMPONENTE EVENT
    MODAL.componentInstance.event = element;
    MODAL.result.then((data) => {
      if (data == 'success') {
        this.getAllEvents();
      }
    });
    // this.eventsService.getById({ id: element.id }).subscribe((res) => {

    // });
  }
  //MODAL DE CREACION DE EMAIL EN EL EVENTO
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
}
