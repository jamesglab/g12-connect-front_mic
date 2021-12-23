import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  public buildData(headers: any, data: any[]): any {
    let newData = [];
    data.map((item) => {
      let obj = {};
      for (let i in headers) {
        if (i == 'state' || i == 'State' || i == 'status') {
          obj[headers[i]] = this.getState(item[i]);
        } else if (i == 'done') {
          obj[headers[i]] = this.getDone(item[i]);
        } else if (
          i == 'week1' ||
          i == 'week2' ||
          i == 'week3' ||
          i == 'week4' ||
          i == 'week5'
        ) {
          if (item[i] != 0) {
            obj[headers[i]] = 'Si';
          } else {
            obj[headers[i]] = 'No';
          }
        } else {
          obj[headers[i]] = item[i];
        }
      }
      newData.push(obj);
    });
    return newData;
  }

  private getState(state): string {
    if (state) {
      if (state == '1' || state) {
        return 'Activa';
      } else {
        return 'Inactiva';
      }
    }
    return '';
  }

  private getDone(done): string {
    if (done) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportConsolidateEvents(json: any, excelFileName: string): void {
    const export_sheet_data = {};
    Object.keys(json).map((key) => {
      export_sheet_data[key] = XLSX.utils.json_to_sheet(json[key]);
    });
    const workbook: XLSX.WorkBook = {
      Sheets: export_sheet_data,
      SheetNames: Object.keys(json),
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: Blob, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  //for new export type......
  // private saveAsExcelFile(workbook: Workbook, title: string): void {
  //       // workbook.xlsx.writeBuffer().then((data) => {
  //   //   const blob: Blob = new Blob([data], { type: EXCEL_TYPE });
  //   //   FileSaver.saveAs(blob, title + '.xlsx');
  //   // })
  // }
}
