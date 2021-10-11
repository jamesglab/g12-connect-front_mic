import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-ministerial-info',
  templateUrl: './ministerial-info.component.html',
  styleUrls: ['./ministerial-info.component.scss'],
})
export class MinisterialInfoComponent implements OnInit {
  user: any;
  leaders: [] = [];
  ministry: [] = [];
  count_ministry: number = 0;
  all_ministries: number = 0;
  loader: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(
    private _userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getProfileInfo();
    this.getLeaders();
    this.getMinistry();
  }

  getProfileInfo() {
    this._userService.getProfile().subscribe((res) => {
      this.user = res;
      this.cdr.detectChanges();
    });
  }

  getLeaders() {
    const getLeadersSubscr = this._userService
      .getMinisterialTeamG12()
      .subscribe((res) => {
        this.leaders = res || [];
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }

  getMinistry(paginator?) {
    this.loader = true;
    const getLeadersSubscr = this._userService
      .getMinistry({
        page: paginator ? paginator.pageIndex + 1 : 1,
        per_page: paginator ? paginator.pageSize : 10,
      })
      .subscribe((res) => {
        this.loader = false;
        this.ministry = res.users || [];
        this.count_ministry = res.count;
        if (!this.all_ministries) {
          this.all_ministries = res.count;
        }
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }

  getMinistryPaginator(filter) {
    this.loader = true;
    const getLeadersSubscr = this._userService
      .filterMinistry({
        page: filter.paginator ? filter.paginator.pageIndex + 1 : 1,
        per_page: filter.paginator ? filter.paginator.pageSize : 10,
        filter: filter.filter
      })
      .subscribe((res: any) => {
        this.loader = false;
        this.ministry = res.users || [];
        this.count_ministry = res.count;
        if (!this.all_ministries) {
          this.all_ministries = res.count;
        }
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }
}
