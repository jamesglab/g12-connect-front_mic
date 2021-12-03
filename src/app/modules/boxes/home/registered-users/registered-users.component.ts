import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailRegisterComponent } from '../detail-register/detail-register.component';
import { RegisterUserBoxComponent } from '../register-user-box/register-user-box.component';
import { BoxService } from '../services/g12events.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import { userInfo } from 'os';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss'],
})
export class RegisteredUsersComponent implements OnInit {
  /**VARIABLES DE COMPONENTES PADRES */
  @Input() box;

  /**
   * CONTROLES DE INPUTS
   */
  public identification = new FormControl(); //CONTROL PARA FILTRO POR IDENTIFICACION

  public payment_ref_grupal = new FormControl(); //CONTROL PARA CONSULTAR REFERENCIA GRUPAL
  public email = new FormControl();

  /**
   * ARRAYS PARA VISUALIZAR TABLAS
   * ARRAYS DE CONSULTAS
   */
  public displayedColumns: string[] = [
    'user_name',
    'user_email',
    'payment_ref',
    'status',
    'created_at',
    'event',
    'cut',
    'amount',
    'options',
  ]; //DATOS A MOSTRAR EN LAS TABLAS DEL ANGULAR MATERIAL

  public individual_table: [] = [];
  public grupal_table: [] = [];

  constructor(
    private modalService: NgbModal,
    private _boxService: BoxService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  /**MODALES*/

  // METODO PARA ABRIR MODAL DE REGISTRO DE USUARIOS
  openModalAprobePayment(element) {
    const modale = this.modalService.open(DetailRegisterComponent, {
      centered: true,
      size: 'xl',
    });
    modale.componentInstance.transaction = element;
    modale.componentInstance.box = this.box;
  }

  //MODAL DE REGISTRO DE USUARIO UNICO EN CAJA APROBANDO DIRECTAMENTE LA TRANSACCION
  registerUser() {
    const modale = this.modalService.open(RegisterUserBoxComponent, {
      centered: true,
      size: 'xl',
    });
    modale.componentInstance.box = this.box;
  }

  /**CONSULTAS A LA BASE DE DATOS */

  //METODO PARA CONSULTAR LAS TRANSACCIONES POR USUARIO UNICO
  searchTransactionsOneUser() {
    //DECLARAMOS VARIABLE DE CONSULTA
    const params = {};
    //VALIDAMOS EL INPUT DE IDENTIFICACION
    if (this.identification.value) {
      //ANEXAMOS CONSULTA POR 'identification'
      params['identification'] = this.identification.value;
    }
    //VALIDAMOS EL INPUT POR EL EMAIL
    if (this.email.value) {
      //ANEXAMOS CONSULTA POR EMAIL
      params['email'] = this.email.value;
    }

    //VALIDAMOS QUE EXISTAN PARAMETROS DE CONSULTA
    if (Object.keys(params).length > 0) {
      //CONSULTAMOS LA TRANSACCION Y ENVIAMOS LOS FILTROS SELECCIONADOS
      this._boxService.filterTransaction(params).subscribe(
        (res) => {
          //AGREGAMOS LA RESPUESTA A LA TABLA DE REGISTRO INDIVIDUAL
          this.individual_table = res;
          //HACEMOS UN DETECTOR DE LOS CANMBIOS PARA PODER VISUALIZARLOS
          this.cdr.detectChanges();
        },
        (err) => {
          throw new Error(err);
        }
      );
    }
  }

  //CONSULTA POR TRANSACCION GRUPAL
  searchTransactionBoxGrupal() {
    //VALIDAMOS EL PARAMETRO DE CONSULTA DE REFERENCIA GRUPAL
    if (this.payment_ref_grupal.value) {
      //CONSULTAMOS LAS TRANSACCIONES
      /**
       * payment_ref_grupal REFERENCIA DE PAGO
       * boolean = false CONSULTAMOS POR USUARIOS DONANTE
       */
      this._boxService
        .filterTransaction({ payment_ref: this.payment_ref_grupal.value })
        .subscribe((res) => {
          this.grupal_table = res;
          this.cdr.detectChanges();
        });
    }
  }

  /**VALIDADORES DE INPUNTS */

  //METODO PARA VALIDAR UNICAMENTE LOS NUMEROS
  validateNumber(e) {
    if (!e.key.match(/[0-9]/i)) {
      e.preventDefault(); //ELIMINAMOS PULSACION SI NO ES UN NUMERO
    }
  }

  //CREAMOS PDF DE LA TRANSACCION
  async createPdf(element) {
    //METODO PARA CONSULTAR LAS TRANSACCIONES DE LOS USUARIOS ASITENTES

    //CONSULTAMOS LAS TRANSACCIONES
    /**
     * payment_ref  REFERENCIA DE PAGO
     * boolean = true CONSULTAMOS POR USUARIOS ASITENTES
     */
    this._boxService
      .filterTransactionByReference({
        payment_ref: element.transaction.payment_ref,
      })
      .subscribe(
        async (res) => {
          let donor;
          res.map((tr) => {
            if (!tr.isAssistant) {
              donor = tr;
            }
          });
          const table = await this.createUsersTable(res);

          //AGREGAMOS RESPUESTA A LA TABLA DE USUARIOS
          var dd = {
            content: [
              {
                text: 'IGLESIA MISIÓN CARISMÁTICA INTERNACIONAL',
                style: 'header',
              },

              { style: 'cont_ministerial', text: 'NIT 800195397-7' },

              {
                text: `Usuario : ${
                  element.user.name.toString().toUpperCase() +
                  ' ' +
                  element.user.last_name.toString().toUpperCase()
                }`,
                style: 'parrafo',
              },
              {
                style: 'parrafo',
                columns: [
                  {
                    width: 400,
                    text: `REFERENCIA : ${donor.transaction.payment_ref}`,
                  },
                  {
                    width: 500,
                    text: `FECHA: ${moment(donor.transaction.created_at).format(
                      'YYYY/MM/DD'
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
                    text: `TOTAL A DONAR : ${
                      donor.transaction.currency +
                      ' ' +
                      donor.transaction.amount
                    }`,
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
                    text: moment().format('YYYY/MM/DD'),
                  },
                  {
                    width: 500,
                    text: this.box.name.toString().toUpperCase(),
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
                margin: [0, 50, 0, 0],
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
        },
        (err) => {
          throw new Error(err);
        }
      );
  }

  createUsersTable(transactions) {
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
      console.log('tr', tr);
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
            ? tr.cut.prices[tr.transaction.currency.toString().toLowerCase()]
            : '',
        ]);
      }
    });
    console.log('tenemos tabla', table);
    return table;
  }
}
