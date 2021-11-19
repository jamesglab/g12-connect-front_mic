import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { ExportService } from '../../_services/export.service';
import { G12eventsService } from '../_services/g12events.service';

@Component({
  selector: 'app-report-massives',
  templateUrl: './report-massives.component.html',
  styleUrls: ['./report-massives.component.scss']
})
export class ReportMassivesComponent implements OnInit {
  public permissions: any;
  public isLoading : boolean;

  constructor(private eventService: G12eventsService, private exportService: ExportService, private asideMenuService: DynamicAsideMenuService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPermissions();

  }

  getPermissions() {
    this.asideMenuService.getPermissionsUser().subscribe(res => {
      this.permissions = res;
      this.cdr.detectChanges();
    });
  }

  getReports() {
    this.isLoading = true;
    this.eventService.getReportsMassive().subscribe(res => {
      this.isLoading =false;
      this.cdr.detectChanges();
      this.exportService.exportAsExcelFile(res, 'MASIVOS');

    }, err => {
      this.isLoading =false;
      this.cdr.detectChanges();
      throw err;
    })
  }


}
