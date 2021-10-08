import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/modules/_services/user.service';
import { EditUserMinistryComponent } from '../edit-user-ministry/edit-user-ministry.component';

@Component({
  selector: 'app-ministry',
  templateUrl: './ministry.component.html',
  styleUrls: ['./ministry.component.scss']
})

export class MinistryComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'last_name', 'phone', 'options'];
  @Input() public loader: boolean;
  @Input() user: any;
  @Input() ministry;
  @Input() count;
  public actualPaginator;
  public filterValue;
  @Output() paginator = new EventEmitter<any>();
  @Output() filter = new EventEmitter<any>();


  constructor(private modalService: NgbModal, private _userService: UserService,
    public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }


  openUser(user, i) {
    this._userService.finOne({ id: user.id }).subscribe(res => {
      const MODAL = this.modalService.open(EditUserMinistryComponent, {
        windowClass: 'fadeIn',
        size: 'xl',
        backdrop: true,
        keyboard: true,
        centered: true
      })
      MODAL.componentInstance.user = res;
      MODAL.result.then((data) => {
        if (data) {
          this.ministry[i] = data;
          this.cdr.detectChanges();
        }

      });
    });
  }

  paginationOut(event) {
    if (this.filterValue) {
      this.filter.emit({ filter: this.filterValue, paginator: event })
    } else {
      this.paginator.emit(event);
    }
  }

  filterEmit() {
    if (this.filterValue) {
      this.filter.emit({ filter: this.filterValue, paginator: this.actualPaginator })
    } else {
      this.filter.emit({ filter: this.filterValue })
    }
  }
}
