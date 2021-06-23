import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { G12eventsService } from '../../_services/g12events.service';
import { Donation } from '../../_models/donation.model';
import { EditEventComponent } from '../edit-event/edit-event.component';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit {

  @Input() public search: String = "";
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  public displayedColumns: String[] = ['image', 'name', 'description', 'category', 'status', 'actions'];
  public dataSource: MatTableDataSource<Donation[]>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private eventsService: G12eventsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents() {
    const goDataSubscr = this.eventsService
      .getAll({ type: 'G12_EVENT' }).subscribe((res: any) => {
        res.reverse();
        console.log("ALL DATAAA", res);
        if (!this.dataSource) {
          this.dataSource = new MatTableDataSource<Donation[]>(res);
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource.data = res;
        }
      });
    this.unsubscribe.push(goDataSubscr);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.search.firstChange) {
      this.applyFilter();
    }
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  handleErrorImage($event: any) {
    $event.target.src = "assets/media/logos/logoConexion12.png";
  }

  handleToEdit(element: Donation) {
    
    this.eventsService.getById({ id: element.id }).subscribe(res => {
      console.log("HANDLE TO EDIT", res)
      const MODAL = this.modalService.open(EditEventComponent, {
        windowClass: 'fadeIn',
        size: 'lg',
        backdrop: true,
        keyboard: true,
        centered: true
      })
      MODAL.componentInstance.event = res;
      MODAL.result.then((data) => {
        if (data == "success") {
          this.getAllEvents();
        }
      });
    })

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
