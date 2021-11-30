import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
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

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
})
export class EventsTableComponent implements OnInit {
  @Input() public search: String = '';
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];
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
    private modalService: NgbModal
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

  handleEmailEvent() {
    const MODAL = this.modalService.open(EmailEventComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true,
    });
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
