import { Component, OnInit } from '@angular/core';
//FOR TRY
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
import { ExportService } from '../../../_services/export.service';

@Component({
  selector: 'app-go-reports-main',
  templateUrl: './go-reports-main.component.html',
  styleUrls: ['./go-reports-main.component.scss']
})
export class GoReportsMainComponent implements OnInit {

  constructor(private _exportService: ExportService) { }

  ngOnInit(): void {
  }

  // uploadedFile(event) {  
  //   const file = event.target.files[0];  
  //   this.readExcel(file);  
  // }  
  // readExcel(file) {  
  //   let readFile = new FileReader();  
  //   readFile.onload = (e) => {  
  //     const storeData: any = readFile.result;  
  //     var data = new Uint8Array(storeData);  
  //     var arr = new Array();  
  //     for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);  
  //     var bstr = arr.join("");  
  //     var workbook = XLSX.read(bstr, { type: "buffer" });  
  //     var first_sheet_name = workbook.SheetNames[0];  
  //     const worksheet: XLSX.WorkSheet = workbook.Sheets[first_sheet_name]; 
      
  
  //     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  //     const _data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  //     FileSaver.saveAs(_data, 'pruebita de amor' + new Date().getTime() + '.xlsx');
  //   }
  //   readFile.readAsArrayBuffer(file);  
  // }

  export(){
    console.log("clicked component");
    let data = [{
      Pastor: "Pepe",
      Lider: "Otro pepe",
      LiderCelula: "Laura",
      Tel: "7810154456",
      Dia: "Lunes",
      Tipo: "Go",
      Documento: "1024595478",
      Nombre: "Fernando Pino",
      correo: "fpino@gmail.com",
      telefono: "313458789",
      edad: "44",
      tipo: "hombre" 
    },
    {
      Pastor: "Pepe",
      Lider: "Otro pepe",
      LiderCelula: "Laura",
      Tel: "7810154456",
      Dia: "Lunes",
      Tipo: "Go",
      Documento: "1024595478",
      Nombre: "Fernando Pino",
      correo: "fpino@gmail.com",
      telefono: "313458789",
      edad: "44",
      tipo: "hombre" 
    },
    {
      Pastor: "Pepe",
      Lider: "Otro pepe",
      LiderCelula: "Laura",
      Tel: "7810154456",
      Dia: "Lunes",
      Tipo: "Go",
      Documento: "1024595478",
      Nombre: "Fernando Pino",
      correo: "fpino@gmail.com",
      telefono: "313458789",
      edad: "44",
      tipo: "hombre" 
    },
  ];

    this._exportService.exportAsExcelFile(data, "test");
  }

}
