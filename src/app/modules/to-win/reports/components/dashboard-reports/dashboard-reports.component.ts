import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CURRENT_MONTH } from 'src/app/_helpers/tools/utils.tool';

@Component({
  selector: 'app-dashboard-reports',
  templateUrl: './dashboard-reports.component.html',
  styleUrls: ['./dashboard-reports.component.scss']
})
export class DashboardReportsComponent implements OnInit {

  @Input() public mainData: any[] = [];
  public dashboard: any = { winned: 0, called: 0, visited: 0 };
  private unsubscribe: Subscription[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.mainData?.firstChange) {
      this.makeDataToRender();
    }
  }

  getCurrentMonth(): string {
    return CURRENT_MONTH;
  }

  makeDataToRender(): void {
    this.dashboard = { winned: 0, called: 0, visited: 0 };
    if(this.mainData.length > 0){
      this.mainData.map(item =>{
        this.dashboard.winned += item.won;
        this.dashboard.called += item.calls;
        this.dashboard.visited += item.visited;
      })
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
