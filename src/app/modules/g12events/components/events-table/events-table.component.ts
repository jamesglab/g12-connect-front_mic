import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { G12eventsService } from '../../_services/g12events.service';

import { Donation } from '../../_models/donation.model';

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

  constructor(private eventsService: G12eventsService) { }

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents() {
    const goDataSubscr = this.eventsService
      .getFilter({ type: 'G12_EVENT' }).subscribe((res: any) => {
        res.reverse();
        console.log("ALL DATAAA", res);
        if (!this.dataSource) {
          this.dataSource = new MatTableDataSource<Donation[]>(res);
          this.dataSource.paginator = this.paginator;
        } else {
          this.dataSource.data = res.entity;
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
    $event.target.src = "https://yt3.ggpht.com/ytc/AAUvwnjl325OZ-8UBHRf-8cmtxM2sXIznUWaoGxwcV4JGA=s900-c-k-c0x00ffffff-no-rj";
  }

  handleToEdit(element: Donation){
    console.log("HANDLE TO EDIT", element)
    // const MODAL = this.modalService.open(EditgoComponent,{
    //   windowClass: 'fadeIn',
    //   size: 'lg',
    //   backdrop: true,
    //   keyboard: true,
    //   centered: true
    // })
    // MODAL.componentInstance.goItem = element;
    // MODAL.result.then((data) => {
    //   if(data == "success"){
    //     this.getGoData();
    //   }
    // });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
