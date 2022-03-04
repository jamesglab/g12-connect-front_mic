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

    //OBJETO DE CREACION DEL PDF
    let pdf = {
      //DEFINIMOS LOS ESTILOS QUE USARA NUESTRO PDF
      styles: {
        parrafo: {
          margin: [0, 0, 0, 0],
          fontSize: 8,
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
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 8,
          bold: true,
          margin: [0, 15, 0, 5],
        },
        tableExample: {
          margin: [0, 20, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black',
        },
      },
      //ABRIMOS EL CONTENIDO QUE TENDRA LA MATRIZ DE NUESTRO PDF
      /**BASE DE OBJETOS
       *TEXT : TEXTO QUE CONTENDRA
       *STYLE ::LLAMAMOS UN STYLO DE NUESTRA RAIZ de 'styeles'
       */
      content: [
        {
          text: 'IGLESIA MISIÓN CARISMÁTICA INTERNACIONAL',
          style: 'header',
        },

        { text: 'NIT 800195397-7', style: 'cont_ministerial' },

        {
          text: `USUARIO : ${
            donor?.user?.name.toString().toUpperCase() +
            ' ' +
            donor?.user?.last_name.toString().toUpperCase()
          }`,
          style: 'parrafo',
        },
        {
          text: `TIPO DE TRANSACCIÓN : ${
            donor?.description_of_change ? 'DATAFONO' : 'EFECTIVO'
          }`,
          style: 'parrafo',
        },

        {
          style: 'parrafo',
          //CREACION DE COLUMNAS ESPECIFICAMOS UN ARRAY QUE LEERA OBJETOS DE POSICIONES
          columns: [
            {
              //TAMAÑO DE LA COLUMNA
              width: 380,
              //TEXTO
              text: `REFERENCIA : ${donor?.transaction?.payment_ref}`,
            },
            {
              //TAMAÑO DE LA COLUMNA
              width: 400,
              //TEXTO
              text: `FECHA: ${moment(donor?.transaction?.created_at).format(
                'YYYY/MM/DD - h:mm a'
              )}`,
            },
          ],
        },

        //ABIRMOS UN CONTENEDOR CON ESPACIO PARA SEPARAR LA INFORMACION POR CONTENEDORES
        { style: 'cont_donation', text: '' },
        //INFORMACION DE COMPROBANTE DE DONACION
        { text: 'COMPROBANTE DE DONACIÓN', style: 'subheader' },
        //CREACION DE TABLA
        {
          style: 'tableExample',
          table: {
            body: table,
          },
        },
        //ABIRMOS UN CONTENEDOR CON ESPACIO DE LOS TOTALES DE LA DONACION
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
                donor?.transaction.currency,
                donor?.transaction.amount
              )}`,
            },
          ],
        },
        //ABRIMOS CONTENEDOR DE LA INFORMACION DE LA IMPRESION
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
        //ABRIMOS CONTENEDOR DE INFORMACION DE LA IMPRESION
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
              text:
                'Nota: CON ESTE RECIBO PODRÁS REALIZAR CORRECCIONES O VALIDACIONES',
              style: 'bold',
            },
          ],
        },
      ],
    };
    pdfMake.createPdf(pdf).open();
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
    //OBJETO DE CREACION DEL PDF
    let pdf = {
      //DEFINIMOS LOS ESTILOS QUE USARA NUESTRO PDF
      styles: {
        parrafo: {
          margin: [0, 10, 0, 0],
          fontSize: 8,
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
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 8,
          bold: true,
          margin: [0, 15, 0, 5],
        },
        tableExample: {
          margin: [0, 20, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black',
        },
      },
      //ABRIMOS EL CONTENIDO QUE TENDRA LA MATRIZ DE NUESTRO PDF
      /**BASE DE OBJETOS
       *TEXT : TEXTO QUE CONTENDRA
       *STYLE ::LLAMAMOS UN STYLO DE NUESTRA RAIZ de 'styeles'
       */
      content: [
        {
          text: 'IGLESIA MISIÓN CARISMÁTICA INTERNACIONAL',
          style: 'header',
        },

        { text: 'NIT 800195397-7', style: 'cont_ministerial' },

        {
          text: `USUARIO : ${
            donor?.user.name.toString().toUpperCase() +
            ' ' +
            donor?.user.last_name.toString().toUpperCase()
          }`,
          style: 'parrafo',
        },
        {
          text: `TIPO DE TRANSACIÓN : ${
            donor?.description_of_change ? 'DATAFONO' : 'EFECTIVO'
          }`,
          style: 'parrafo',
        },
        {
          style: 'parrafo',
          //CREACION DE COLUMNAS ESPECIFICAMOS UN ARRAY QUE LEERA OBJETOS DE POSICIONES
          columns: [
            {
              //TAMAÑO DE LA COLUMNA
              width: 380,
              //TEXTO
              text: `REFERENCIA : ${donor.transaction.payment_ref}`,
            },
            {
              //TAMAÑO DE LA COLUMNA
              width: 400,
              //TEXTO
              text: `FECHA: ${moment(donor.transaction.created_at).format(
                'YYYY/MM/DD - h:mm a'
              )}`,
            },
          ],
        },

        //ABIRMOS UN CONTENEDOR CON ESPACIO PARA SEPARAR LA INFORMACION POR CONTENEDORES
        { style: 'cont_donation', text: '' },
        //INFORMACION DE COMPROBANTE DE DONACION
        { text: 'COMPROBANTE DE DONACIÓN', style: 'subheader' },
        //CREACION DE TABLA
        {
          style: 'tableExample',
          table: {
            body: table,
          },
        },
        //ABIRMOS UN CONTENEDOR CON ESPACIO DE LOS TOTALES DE LA DONACION
        {
          columns: [
            {
              width: 350,
              text: '',
            },
            {
              width: 400,
              style: 'bold',
              text: `TOTAL A DONAR : ${this.formatPrice(
                donor.transaction.currency,
                donor.transaction.amount
              )}`,
            },
          ],
        },
        //ABRIMOS CONTENEDOR DE LA INFORMACION DE LA IMPRESION
        {
          style: 'parrafo',
          columns: [
            {
              width: 380,
              text: 'FECHA Y HORA DE IMPRESIÓN',
            },
            {
              width: 400,
              text: 'NOMBRE DE LA CAJA',
            },
          ],
        },
        //ABRIMOS CONTENEDOR DE INFORMACION DE LA IMPRESION
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
              text:
                'Nota: CON ESTE RECIBO PODRÁS REALIZAR CORRECCIONES O VALIDACIONES',
              style: 'bold',
            },
          ],
        },
      ],
    };
    pdfMake.createPdf(pdf).open();
  }

  //CREAMOS EL PDF DE USUARIOS NO MASIVOS
  private createUsersTableNotMassive(transactions) {
    console.log(transactions);
    let table = [
      [
        { text: 'DOCUMENTO', style: 'tableHeader' },
        { text: 'NOMBRES Y APELLIDOS', style: 'tableHeader' },
        { text: 'NOMBRE DEL EVENTO', style: 'tableHeader' },
        { text: 'PASTOR PRINCIPAL', style: 'tableHeader' },
        { text: 'TRADUCTOR', style: 'tableHeader' },
        { text: 'VALOR EVENTO', style: 'tableHeader' },
      ],
    ];

    transactions.map((tr) => {
      console.log(tr);
      if (tr.isAssistant) {
        table.push([
          tr.user?.identification ? tr.user.identification : 'INTERNACIONAL',
          tr.user?.name && tr.user?.last_name
            ? `${tr.user.name
                .toString()
                .toUpperCase()} ${tr.user.last_name.toString().toUpperCase()}`
            : '',
          tr.donation.name ? tr.donation.name.toString().toUpperCase() : '',
          tr.user?.type_church?.toString().toUpperCase() === 'MCI'
            ? `${tr.pastor?.name} ${tr.pastor?.last_name}`
            : tr.user?.name_pastor,
          tr.is_translator
            ? this.formatPrice(
                tr.transaction.currency.toString().toLowerCase(),
                tr.price_translator
              )
            : 'N/A',
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
    return new Intl.NumberFormat('es', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  }
}
