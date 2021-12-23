import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
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

  async exportConsolidateWithStyles(json, excelFileName) {
    //CREAMOS EL LIBRO DE EXCEL
    const workbook = new ExcelJS.Workbook();

    console.log(Object.keys(json));
    //MAPEAMOS LOS OBJETOS
    Object.keys(json).map((key) => {
      //   //CREAMOS LA HOJA DE CADA CONSULTA
      const sheet = workbook.addWorksheet(key, {});
      Object.keys(json[key][0]).map((headerStyle, i) => {
        // //ESTILOS DE LAS CABECERAS
        sheet.getCell(`${this.createCeld(i + 1)}1`).fill = {
          type: 'pattern',
          pattern: 'darkVertical',
          fgColor: { argb: 'dbf4f9' },
        };
        //ESTILOS DE DE
        sheet.getCell(`${this.createCeld(i + 1)}1`).font = {
          family: 4,
          size: 12,
          bold: true,
        };

        sheet.getCell(`${this.createCeld(i + 1)}1`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // for (let column = 0; column < json[key].length; column++) {
        //   console.log('Columna', column)
        //   for (let row = 0; row < Object.keys(json[key][0]).length; row++) {
        //     if (json[key][column][headerStyle]) {
        //       sheet.getCell(`${this.createCeld(column + 1)}${row + 1}`).border = {
        //         top: { style: 'thin' },
        //         left: { style: 'thin' },
        //         bottom: { style: 'thin' },
        //         right: { style: 'thin' },
        //       };
        //     }
        //   }

        // if (json[key][index]) {
        //   console.log(`${this.createCeld(index + 1)}${index + 1}`);
        //   sheet.getCell(`${this.createCeld(index + 1)}${index + 1}`).border =
        //     {
        //       top: { style: 'thin' },
        //       left: { style: 'thin' },
        //       bottom: { style: 'thin' },
        //       right: { style: 'thin' },
        //     };
        // }
        // }
      });
      //CREAMOS LOS HEADERS
      const uniqueHeaders = [
        ...new Set(
          json[key].reduce((prev, next) => [...prev, ...Object.keys(next)], [])
        ),
      ];
      //AGREGAMOS LAS COLUMNAS DE LA TABLA
      sheet.columns = uniqueHeaders.map((x) => ({
        header: x,
        key: x,
        width: 30,
      }));
      console.log;

      json[key].forEach((jsonRow, i) => {
        let cellValues = { ...jsonRow };
        uniqueHeaders.forEach((header, j) => {
          if (Array.isArray(jsonRow[`${header}`])) {
            cellValues[`${header}`] = '';
          }
        });
        sheet.addRow(cellValues);
        uniqueHeaders.forEach((header, j) => {
          if (Array.isArray(jsonRow[`${header}`])) {
            const jsonDropdown = jsonRow[`${header}`];
            sheet.getCell(
              this.getSpreadSheetCellNumber(i + 1, j)
            ).dataValidation = {
              type: 'list',
              formulae: [`"${jsonDropdown.join(',')}"`],
            };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    this.saveAsExcelFile(buffer, excelFileName);
  }

  private getSpreadSheetCellNumber(row, column) {
    let result = '';

    // Get spreadsheet column letter
    let n = column;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }

    // Get spreadsheet row number
    result += `${row + 1}`;

    return result;
  }

  private createCeld(position) {
    let celd = '';
    switch (position) {
      case 1:
        celd = 'A';
        break;

      case 2:
        celd = 'B';

        break;
      case 3:
        celd = 'C';

        break;
      case 4:
        celd = 'D';

        break;
      case 5:
        celd = 'E';

        break;
      case 6:
        celd = 'F';

        break;
      case 7:
        celd = 'G';

        break;
      case 8:
        celd = 'H';

        break;
      case 9:
        celd = 'I';

        break;
      case 10:
        celd = 'J';

        break;
      case 11:
        celd = 'K';

        break;
      case 12:
        celd = 'L';

        break;
      case 13:
        celd = 'M';

        break;
      case 14:
        celd = 'N';

        break;
      case 15:
        celd = 'O';

        break;
      case 16:
        celd = 'P';

        break;
      case 17:
        celd = 'Q';

        break;
      case 18:
        celd = 'R';

        break;

      case 19:
        celd = 'S';

        break;
      case 20:
        celd = 'T';

        break;
      case 21:
        celd = 'U';

        break;
      case 22:
        celd = 'V';

        break;
      case 23:
        celd = 'W';

        break;
      case 24:
        celd = 'X';

        break;
      case 25:
        celd = 'Y';

        break;

      case 26:
        celd = 'Z';

        break;
      default:
        break;
    }

    if (celd) {
      return celd;
    }
  }
}
