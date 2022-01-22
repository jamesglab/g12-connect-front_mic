import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/pages/_layout/components/notification/notification.component';
import { notificationConfig, foundLeader, makeSum, makeRest } from 'src/app/_helpers/tools/utils.tool';
import { WEEKS_OF_MONTH, GET_MONTHS, YEARS } from 'src/app/_helpers/items/forSelect';

import { ReportsService } from '../../../_services/reports.service';
import { StorageService } from '../../../../auth/_services/storage.service';
import { ExportService } from '../../../../_services/export.service';

import { Response } from '../../../../auth/_models/auth.model';
import { UserModel } from '../../../../auth/_models/user.model';

@Component({
  selector: 'app-report-consolidated',
  templateUrl: './report-consolidated.component.html',
  styleUrls: ['./report-consolidated.component.scss']
})
export class ReportConsolidatedComponent implements OnInit {

  private currentUser: UserModel = this._storageService.getItem("user");

  public isLoading$: boolean = false;
  public isError: boolean = false;
  public getReportForm: FormGroup;
  public permission: boolean = false;
  public weeksOfMonth: {}[] = [];
  public monthsforSelect: {}[] = GET_MONTHS(new Date().getFullYear());
  public yearsforSelect: {}[] = YEARS();

  public leaderObject: any = {};
  public totalObject: any = {};

  public submitted = false;

  public displayedColumns: String[] = ['leaderName', 'allGo', 'all12', 'allCell', 'all', 'assistants'];
  public dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private unsubscribe: Subscription[] = [];

  constructor(private _reportsService: ReportsService, private _storageService: StorageService,
    private _exportService: ExportService,
    private fb: FormBuilder, private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.buildForm();
    this.checkPermission();
  }

  buildForm() {
    this.getReportForm = this.fb.group({
      idUser: [this.currentUser.idUser, Validators.required],
      year: [null, Validators.required],
      month: [{ value: '', disabled: true }],
      week: [{ value: '', disabled: true }]
    })
    this.cdr.detectChanges();
  }

  get form() {
    return this.getReportForm.controls;
  }

  setDisabled(select: string, year?: string) {
    if (select == "year") {
      this.form.month.enable();
      this.monthsforSelect = GET_MONTHS(parseInt(year));
    } else if (select == "month") {
      this.weeksOfMonth = WEEKS_OF_MONTH(this.form.month.value, parseInt(this.form.year.value));
      this.form.week.enable();
    }
  }

  cleanFilter() {
    this.form.year.setValue(null);
    this.form.month.setValue('');
    this.form.week.setValue('');
  }

  checkPermission() {
    let permissions = ["presidencia_mujer@mci12.com", "coordinador.ganarmujer@mci12.com",
      "presidencia@mci12.com", "coordinador.ganar@mci12.com",
      "claudiarodriguezdecastellanos@mci12.com", "fraycelyavila@mci12.com",
      "cesar.castellanos@mci12.com"
    ];
    permissions.map((item: string) => {
      if (this.currentUser.user.toLowerCase() === item.toLowerCase()) {
        this.permission = true;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.form.idUser.setValue(this.currentUser.idUser);
    this.validateFields();
    if (this.getReportForm.invalid) {
      return;
    }
    // this.parseAttrToInsert();
    this.getReportConsolidated();
  }

  validateFields() {
    if (this.form.week.value) {
      if (this.form.month.value) {
        this.form.month.setErrors(null);
      } else {
        this.form.month.setErrors({ required: true });
      }
    }
  }

  getReportConsolidated() {
    this.isLoading$ = true;
    const reportConsolidatedSubscr = this._reportsService
      .getReportConsolidated(this.getInsert())
      .subscribe((res: Response) => {
        this.submitted = false;
        this.isLoading$ = false;
        this.form.idUser.setValue(this.currentUser.idUser);
        if (res) {
          if (res.result) {
            //FOR MAKE TOTAL OBJECT
            this.makeOperations(res);
            this.setDisplayedColumns();
            // this.getReportForm.reset();
            this.form.idUser.setValue(this.currentUser.idUser);
            if (!this.dataSource) {
              this.dataSource = new MatTableDataSource<any[]>(res.entity);
              this.dataSource.paginator = this.paginator;
            } else {
              this.dataSource.data = res.entity;
            }
            this.cdr.detectChanges();
          } else {
            this.showMessage(res.notificationType, res.message[0]);
          }
        } else {
          this.isLoading$ = false;
          this.showMessage(3, "No hemos encontrado datos");
        }
      }, err => { this.isLoading$ = false; this.cdr.detectChanges(); throw err; });
    this.unsubscribe.push(reportConsolidatedSubscr);
  }

  setDisplayedColumns(): void {

    const index = this.displayedColumns.findIndex(column => column === "reported");
    if (index > 0) {
      this.displayedColumns.splice(index, 1);
    }
    const _index = this.displayedColumns.findIndex(column => column === "notReported");
    if (_index > 0) {
      this.displayedColumns.splice(_index, 1);
    }

    if (this.form.month.value) {
      this.displayedColumns.push('reported');
    }
    if (this.form.week.value) {
      this.displayedColumns.push('notReported')
    }
  }

  validateForYearTotalRow() {
    const index = this.displayedColumns.findIndex(column => column === "reported");
    const _index = this.displayedColumns.findIndex(column => column === "notReported");
    return (index === -1 && _index === -1);
  }

  validateForMonthTotalRow() {
    const index = this.displayedColumns.findIndex(column => column === "reported");
    return (index > 0);
  }

  validateForWeekTotalRow() {
    const index = this.displayedColumns.findIndex(column => column === "reported");
    const _index = this.displayedColumns.findIndex(column => column === "notReported");
    return (index > 0 && _index > 0);
  }

  makeOperations(res: any): void {
    this.leaderObject = foundLeader(res.entity);
    let sumObject = makeSum(res.entity, false, this.leaderObject.position)
    res.entity[this.leaderObject.position] = makeRest(this.leaderObject, sumObject);
    this.totalObject = makeSum(res.entity, true);
  }

  standOutLeader(index: number): boolean {
    return (index === this.leaderObject.position);
  }

  renderHeader(header: string) {
    switch (header) {
      case 'assistants':
        if (this.validateForYearTotalRow() && !this.validateForWeekTotalRow()) {
          return "Asistentes Registrados";
        } else if (this.validateForMonthTotalRow() || this.validateForWeekTotalRow()) {
          return "Asistentes Activos";
        } else {
          return "Asistentes";
        }
    }
  }

  getInsert() {
    const { idUser, year, month, week } = this.getReportForm.getRawValue();
    return { idUser, year: parseInt(year), month: parseInt(month), week: parseInt(week) };
  }

  applyFilter(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();
    this.totalObject = makeSum(this.dataSource.filteredData, true);
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  exportArchive(): void {
    let header = this.getHeaderForExport();
    // let totalObject = this.makeTotal(this.dataSource.filteredData);
    let data: any = this.dataSource.filteredData;
    data.push(this.totalObject);
    let final = this._exportService.buildData(header, data);
    setTimeout(() => { this._exportService.exportAsExcelFile(final, 'consolidated') }, 100)
  }

  getHeaderForExport(): any {
    let header = {
      name: "Lider", totalGo: "Total Go", total12: "Total 12", totalCel: "Total Células", total: "Total",
      assistants: "Asistentes",
      reported: "Reportadas",
      notReported: "No Reportadas"
    };
    if (this.validateForYearTotalRow()) {
      delete header.reported;
      delete header.notReported;
      return header;
    }
    if (this.validateForMonthTotalRow() && !this.validateForWeekTotalRow()) {
      delete header.notReported;
      return header;
    }
    return header;
  }

  downloadAssistants() {
    this.isLoading$ = true;
    const reportAssistantsSubscr = this._reportsService
      .getReportAssistants({ idAcceso: this.currentUser.idUser })
      .subscribe((res: Response) => {
        this.isLoading$ = false;
        let header = {
          pastor: "PASTOR", leader: "LIDER 12", host: "ANFITRION",
          tellidercalula: "TELEFONO LIDER", day: "DIA", type: "TIPO REUNION",
          document: "DOCUMENTO", name: "NOMBRE", mail: "CORREO",
          telephone: "TELEFONO", age: "EDAD", typePerson: "TIPO PERSONA"
        }
        let final = this._exportService.buildData(header, res.entity);
        setTimeout(() => { this._exportService.exportAsExcelFile(final, 'assistantsConsolidated') }, 100);
        this.cdr.detectChanges();
      }, err => { this.isLoading$ = false; this.cdr.detectChanges(); throw err; });
    this.unsubscribe.push(reportAssistantsSubscr);
  }

  downloadCells() {
    this.isLoading$ = true;
    const reportCellsSubscr = this._reportsService
      .getReportCells({ IdAcceso: this.currentUser.idUser })
      .subscribe((res: Response) => {
        this.isLoading$ = false;
        if (res.result) {
          let header = {
            pastor: "PASTOR", leader: "LIDER 12", host: "ANFITRION",
            telLeaderCell: "TELEFONO LIDER", day: "DIA", type: "TIPO REUNION",
            assistantToCel: "ASISTENTES CELULA", year: "AÑO", month: "MES",
            week1: "SEMANA 1", week1Theme: "TEMA SEMANA 1", week1Assistant: "ASISTENTES SEMANA 1",
            week2: "SEMANA 2", week2Theme: "TEMA SEMANA 2", week2Assistant: "ASISTENTES SEMANA 2",
            week3: "SEMANA 3", week3Theme: "TEMA SEMANA 3", week3Assistant: "ASISTENTES SEMANA 3",
            week4: "SEMANA 4", week4Theme: "TEMA SEMANA 4", week4Assistant: "ASISTENTES SEMANA 4",
            week5: "SEMANA 5", week5Theme: "TEMA SEMANA 5", week25Assistant: "ASISTENTES SEMANA 5",
          }
          //topic: "TEMA"
          //done: "REALIZADA",
          let final = this._exportService.buildData(header, res.entity);
          setTimeout(() => { this._exportService.exportAsExcelFile(final, 'cellsConsolidated') }, 100);
          this.cdr.detectChanges();
        }
      }, err => { this.isLoading$ = false; this.cdr.detectChanges(); throw err; });
    this.unsubscribe.push(reportCellsSubscr);
  }

  downloadNational() {
    this.isLoading$ = true;
    const reportAssistantsSubscr = this._reportsService
      .getReportNational({ Red: this.currentUser.liderCode.charAt(0) + this.currentUser.liderCode.charAt(1) })
      .subscribe(async (res: Response) => {

        let sedes = JSON.parse(this.currentUser.listSedes);
        var newEntity: any = [];

        const pushCurrentSedes = async () => {
          return Promise.all(res.entity.map(item => {
            item.city = item.sede;
            newEntity.push(item);
            return Promise.resolve('ok');
          }))
        }

        await pushCurrentSedes();

        const pushEmptySedes = async () => {
          return Promise.all(
            sedes.map((item) => {
              let found = false;
              res.entity.map((report) => { //SEARCH LEADER
                if (item.IdLeader === report.idLeader) {
                  found = true;
                }
              })
              if (!found) { // LEADER DOESN´T EXISTS ON ARRAY
                newEntity.push(this.getNationalItem(item));
              }
              return Promise.resolve('ok');
            })
          )
        }

        await pushEmptySedes();
        this.isLoading$ = false;

        newEntity.map(item => {
          item.total = (item.go + item.g12 + item.celula);
          item.assistants = (item.mgo + item.mG12 + item.mCelula);
        })

        //Order ALPHABETICALLY
        const compare = (a, b) => a.department.localeCompare(b.department);
        newEntity.sort(compare);

        let header = {
          department: "DEPARTAMENTO", nameLeader: "PASTOR", city: "CIUDAD O MUNICIPIO",
          go: "TOTAL GO", celula: "TOTAL CELULA", g12: "TOTAL G12", total: "GRAN TOTAL",
          assistants: "ASISTENTES REGISTRADOS"
        }
        let final = this._exportService.buildData(header, newEntity);
        setTimeout(() => { this._exportService.exportAsExcelFile(final, 'NationalConsolidated') }, 200);
        this.cdr.detectChanges();
      }, err => { this.isLoading$ = false; this.cdr.detectChanges(); throw err; });
    this.unsubscribe.push(reportAssistantsSubscr);
  }

  getNationalItem(reportItem) {
    let item = {
      celula: 0,
      city: reportItem.NameSede,
      department: reportItem.Departament,
      g12: 0,
      go: 0,
      idLeader: reportItem.IdLeader,
      idSede: reportItem.IdSede,
      mCelula: 0,
      mG12: 0,
      mgo: 0,
      nameLeader: reportItem.NameLeader,
      sede: reportItem.NameSede,
    }
    return item;
  }

  showMessage(type: number, message?: string) {
    this.snackBar.openFromComponent(NotificationComponent, notificationConfig(type, message));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
