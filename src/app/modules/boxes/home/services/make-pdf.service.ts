import { Injectable } from '@angular/core';

import { BoxService } from './Boxes.service';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Injectable({
  providedIn: 'root',
})
export class MakePdfService {
  constructor(private _boxService: BoxService) {}

  //CREAMOS PDF DE LA TRANSACCION
  public async createPdf(payment_ref, box) {
    //METODO PARA CONSULTAR LAS TRANSACCIONES DE LOS USUARIOS ASITENTES

    //CONSULTAMOS LAS TRANSACCIONES
    /**
     * payment_ref  REFERENCIA DE PAGO
     * boolean = true CONSULTAMOS POR USUARIOS ASITENTES
     */
    this._boxService
      .filterTransactionByReference({
        payment_ref,
      })
      .subscribe(
        async (res) => {
          //CREAMOS BANDERA PARA VALIDAR EL TIPO DE PDF A CREAR
          let find_user_massive = false;
          //CREAMOS ARRAY DE TRANSACCIONES
          let transactions = [];
          res.map((tr) => {
            //VALIDAMOS EL REGISTROS DE USUARIOS MASIVOS
            //PUSHEAMOS SOLO EL USUARIO DONANTE DE MASIVO
            if (tr.transaction?.user_massive && !find_user_massive) {
              transactions.push(tr);
              find_user_massive = true;
            }
          });

          //SI NO ENCONTRAMOS USUARIO MASIVO AGREGAMOS TODAS LAS TRANSACCIONES

          if (!find_user_massive) {
            transactions = res;
            this.createPdfNotMassive(transactions, box);
          } else {
            //CREAMOS EL PDF DEL USUARIO MASIVO
            this.createPdfMassive(transactions, box);
          }
        },
        (err) => {
          throw new Error(err);
        }
      );
  }

  //PDF DE USUARIOS MASIVOSF
  private async createPdfMassive(transactions, box) {
    //AGREGAMOS RESPUESTA A LA TABLA DE USUARIOS
    let donor;
    transactions.map((tr) => {
      if (!tr.isAssistant) {
        donor = tr;
      }
    });
    //CREAMOS LA TABLA CON LOS USUARIOS DEL MASIVO
    const table = await this.createUsersTableMassive(transactions);

    let dd = {
      content: [
        {
          text: 'IGLESIA MISIÓN CARISMÁTICA INTERNACIONAL',
          style: 'header',
        },

        { style: 'cont_ministerial', text: 'NIT 800195397-7' },

        {
          text: `Usuario : ${
            donor.user.name.toString().toUpperCase() +
            ' ' +
            donor.user.last_name.toString().toUpperCase()
          }`,
          style: 'parrafo',
        },
        {
          style: 'parrafo',
          columns: [
            {
              width: 380,
              text: `REFERENCIA : ${donor.transaction.payment_ref}`,
            },
            {
              width: 400,
              text: `FECHA: ${moment(donor.transaction.created_at).format(
                'YYYY/MM/DD - h:mm a'
              )}`,
            },
          ],
        },

        { style: 'cont_donation', text: '' },
        { text: 'COMPROBANTE DE DONACIÓN', style: 'subheader' },

        {
          style: 'tableExample',
          table: {
            body: table,
          },
        },

        {
          columns: [
            {
              width: 380,
              text: '',
            },
            {
              width: 420,
              style: 'bold',
              text: `TOTAL A DONAR : ${this.formatPrice(
                donor.transaction.currency,
                donor.transaction.amount
              )}`,
            },
          ],
        },

        {
          style: 'parrafo',
          columns: [
            {
              width: 420,
              text: 'FECHA Y HORA DE IMPRESIÓN',
            },
            {
              width: 400,
              text: 'NOMBRE DE LA CAJA',
            },
          ],
        },
        {
          style: 'parrafo',

          columns: [
            {
              width: 430,
              text: moment().format('YYYY/MM/DD h:mm a'),
            },
            {
              width: 500,
              text: box.name.toString().toUpperCase(),
            },
          ],
        },
        {
          style: 'parrafo',
          columns: [
            {
              text: 'Nota: CON ESTE RECIBO PODRÁS REALIZAR CORRECCIONES O VALIDACIONES',
              style: 'bold',
            },
          ],
        },
      ],
      styles: {
        parrafo: {
          margin: [0, 10, 0, 0],
        },
        bold: {
          bold: true,
        },
        cont_ministerial: {
          margin: [0, 20, 0, 0],
        },
        cont_donation: {
          margin: [0, 10, 0, 0],
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5],
        },
        tableExample: {
          margin: [0, 20, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black',
        },
      },
    };
    pdfMake.createPdf(dd).open();
  }

  private createUsersTableMassive(transactions) {
    //GENERAMOS LOS HEADERS DE LA TABLA
    let table = [
      [
        { text: 'NOMBRE EVENTO', style: 'tableHeader' },
        { text: 'CORTE', style: 'tableHeader' },
        { text: 'CANTIDAD', style: 'tableHeader' },
        { text: 'VALOR', style: 'tableHeader' },
      ],
    ];

    //RECORREMOS LAS TRANSACCIONES Y CREAMOS LAS DONACIONES
    //SE RECORREN TODAS LAS TRANSACCIONES A EFECTOS DE QUE PUEDAN SER MAS DONACIONES A VARIOS EVENTOS EN EL FUTURO
    transactions.map((tr) => {
      table.push([
        tr.donation.name ? tr.donation.name.toString().toUpperCase() : '',
        tr.cut.name ? tr.cut.name.toString().toUpperCase() : '',
        tr.transaction?.quantity_tickets ? tr.transaction.quantity_tickets : '',
        tr.transaction?.amount
          ? this.formatPrice(tr.transaction.currency, tr.transaction.amount)
          : '',
      ]);
    });
    return table;
  }

  //PDF DE USUARIOS DE COMPRAS NO MASIVAS
  private async createPdfNotMassive(transactions, box) {
    let donor;
    transactions.map((tr) => {
      if (!tr.isAssistant) {
        donor = tr;
      }
    });
    const table = await this.createUsersTableNotMassive(transactions);

    //AGREGAMOS RESPUESTA A LA TABLA DE USUARIOS
    let dd = {
      content: [
        {
          text: 'IGLESIA MISIÓN CARISMÁTICA INTERNACIONAL',
          style: 'header',
        },

        { style: 'cont_ministerial', text: 'NIT 800195397-7' },

        {
          text: `Usuario : ${
            donor.user.name.toString().toUpperCase() +
            ' ' +
            donor.user.last_name.toString().toUpperCase()
          }`,
          style: 'parrafo',
        },
        {
          style: 'parrafo',
          columns: [
            {
              width: 380,
              text: `REFERENCIA : ${donor.transaction.payment_ref}`,
            },
            {
              width: 400,
              text: `FECHA: ${moment(donor.transaction.created_at).format(
                'YYYY/MM/DD  - h:mm a'
              )}`,
            },
          ],
        },

        { style: 'cont_donation', text: '' },
        { text: 'COMPROBANTE DE DONACIÓN', style: 'subheader' },

        {
          style: 'tableExample',
          table: {
            body: table,
          },
        },

        {
          columns: [
            {
              width: 380,
              text: '',
            },
            {
              width: 420,
              style: 'bold',
              text: `TOTAL A DONAR : ${this.formatPrice(
                donor.transaction.currency,
                donor.transaction.amount
              )}`,
            },
          ],
        },

        {
          style: 'parrafo',
          columns: [
            {
              width: 420,
              text: 'FECHA Y HORA DE IMPRESIÓN',
            },
            {
              width: 400,
              text: 'NOMBRE DE LA CAJA',
            },
          ],
        },
        {
          style: 'parrafo',

          columns: [
            {
              width: 430,
              text: moment().format('YYYY/MM/DD  - h:mm a'),
            },
            {
              width: 500,
              text: box.name.toString().toUpperCase(),
            },
          ],
        },
        {
          style: 'parrafo',
          columns: [
            {
              text: 'Nota: CON ESTE RECIBO PODRÁS REALIZAR CORRECCIONES O VALIDACIONES',
              style: 'bold',
            },
          ],
        },
      ],
      styles: {
        parrafo: {
          margin: [0, 10, 0, 0],
        },
        bold: {
          bold: true,
        },
        cont_ministerial: {
          margin: [0, 20, 0, 0],
        },
        cont_donation: {
          margin: [0, 10, 0, 0],
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5],
        },
        tableExample: {
          margin: [0, 20, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black',
        },
      },
    };
    pdfMake.createPdf(dd).open();
  }

  //CREAMOS EL PDF DE USUARIOS NO MASIVOS
  private createUsersTableNotMassive(transactions) {
    let table = [
      [
        { text: 'DOCUMENTO', style: 'tableHeader' },
        { text: 'NOMBRES Y APELLIDOS', style: 'tableHeader' },
        { text: 'NOMBRE DEL EVENTO', style: 'tableHeader' },
        { text: 'PASTOR PRINCIPAL', style: 'tableHeader' },
        { text: 'VALOR', style: 'tableHeader' },
      ],
    ];

    transactions.map((tr) => {
      if (tr.isAssistant) {
        table.push([
          tr.user.identification ? tr.user.identification : 'INTERNACIONAL',
          tr.user.name && tr.user.last_name
            ? tr.user.name.toString().toUpperCase() +
              ' ' +
              tr.user.last_name.toString().toUpperCase()
            : '',
          tr.donation.name ? tr.donation.name.toString().toUpperCase() : '',
          tr.pastor.name ? tr.pastor.name.toString().toUpperCase() : '',
          tr.cut.prices[tr.transaction.currency.toString().toLowerCase()]
            ? this.formatPrice(
                tr.transaction.currency.toString().toLowerCase(),
                tr.cut.prices[tr.transaction.currency.toString().toLowerCase()]
              )
            : '',
        ]);
      }
    });
    return table;
  }

  formatPrice(currency, value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(value);
  }
}
