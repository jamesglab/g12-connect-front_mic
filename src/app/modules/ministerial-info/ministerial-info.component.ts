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
    const getLeadersSubscr = this._userService
      .getMinistry({
        page: paginator ? paginator.pageIndex + 1 : 1,
        per_page: paginator ? paginator.pageSize : 10,
      })
      .subscribe((res) => {
        this.ministry = res.users || [];
        this.count_ministry = res.count;
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }
}
