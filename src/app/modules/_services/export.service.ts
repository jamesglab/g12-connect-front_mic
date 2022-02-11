import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as moment from 'moment';
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
    //MAPEAMOS LOS OBJETOS
    Object.keys(json).map((key, i) => {
      //   //CREAMOS LA HOJA DE CADA CONSULTA
      const sheet = workbook.addWorksheet(key, {});
      //RECORREMOS EL PRIMER OBJETO PARA ACCEDER A LAS CABECERAS DEL OBJETO
      Object.keys(json[key][0]).map((headerStyle, i) => {
        //ACCEDEMOS A LAS CABECERAS
        const headers_styles = sheet.getCell(`${this.createCeld(i + 1)}1`);
        //ESTILOS DE COLORES EN CABECERAS
        headers_styles.fill = {
          type: 'pattern',
          pattern: 'darkVertical',
          fgColor: { argb: 'dbf4f9' },
        };

        //ESTILOS DE FUENTES EN CABECERAS
        headers_styles.font = {
          family: 4,
          size: 12,
          bold: true,
        };
        //ESTILOS DE BORDES EN CABECERAS
        headers_styles.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      //CREAMOS LOS HEADERS POR OBJETO
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
      //MAPEAMOS CADA OBJETO EN UNA HOJA DE EXCEL
      json[key].map((jsonRow, i) => {
        let cellValues = { ...jsonRow };
        //AGREGAMOS LOS OBJETOS
        sheet.addRow(cellValues);
      });

      // CRECION DE ESTILOS POR CELDA

      // RECORREMOS TODO EL OBJETO GENERAL DE LA CONSULTA EJE X
      json[key].map((jsonRow, x) => {
        //RECORREMOS LAS FILAS EJE Y
        Object.keys(jsonRow).map((keyObject, y) => {
          //VALIDAMOS SI LA CELDA ES UN NUMERO Y SI EXISTE EL VALOR
          if (typeof jsonRow[keyObject] == 'number' || jsonRow[keyObject]) {
            //ACCEDEMOS A LA CELDA POR VALOR X + 2 POR QUE EL 1 ES LA CABECERA
            const cell = sheet.getCell(`${this.createCeld(y + 1)}${x + 2}`);
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
            if (
              jsonRow[keyObject].toString().toUpperCase() == 'TOTAL' ||
              jsonRow[keyObject].toString().trim().toUpperCase() ==
                'SUB TOTAL PASTORES BOGOTA' ||
              jsonRow[keyObject].toString().trim().toUpperCase() ==
                'SUB TOTAL ELIEMERSON Y JOHANNA CASTELLANOS'
            ) {
              //RECORREMOS DEL TOTAL HASTA EL FINAL DE LAS FILAS
              for (
                let total_row = y;
                total_row < Object.keys(jsonRow).length;
                total_row++
              ) {
                //CREAMOS LA CELDA
                const cell = sheet.getCell(
                  `${this.createCeld(total_row + 1)}${x + 2}`
                );
                //ANEXAMOS LOS ESTILOS
                cell.font = {
                  family: 4,
                  size: 12,
                  bold: true,
                };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'darkVertical',
                  fgColor: { argb: 'b7bdb9' },
                };
              }
            }
          } else {
            //VALIDAMOS LOS TITULOS CORRESPONDIENTES ACCEDIENTO A LA SIGUIENTE POSICION (3) VALOR DE CELDA
            const cell = sheet.getCell(`${this.createCeld(y + 1)}${x + 3}`);
            //VALIDAMOS SI LA CELDA TIENE VALORES
            if (cell.value) {
              //CREAMOS LOS ESTILOS DE APARIENCIA Y FUENTE
              cell.fill = {
                type: 'pattern',
                pattern: 'darkVertical',
                fgColor: { argb: 'dbf4f9' },
              };
              cell.font = {
                family: 4,
                size: 12,
                bold: true,
              };
            }
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, moment().format("DD_MM_YYYY_h_mm_") +excelFileName.replace(" ","_") + EXCEL_EXTENSION);
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
