import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailRegisterComponent } from '../detail-register/detail-register.component';
import { RegisterUserBoxComponent } from '../register-user-box/register-user-box.component';
import { BoxService } from '../services/Boxes.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MakePdfService } from '../services/make-pdf.service';

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
  public grupal_table = [];

  //BOOLEANS
  public isLoading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private _boxService: BoxService,
    private cdr: ChangeDetectorRef,
    private _makePdfService: MakePdfService
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
    if (element.transaction.user_massive) {
      modale.componentInstance.user_massive = true;
    }
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
  async searchTransactionBoxGrupal() {
    //VALIDAMOS EL PARAMETRO DE CONSULTA DE REFERENCIA GRUPAL
    if (this.payment_ref_grupal.value) {
      //CONSULTAMOS LAS TRANSACCIONES
      /**
       * payment_ref_grupal REFERENCIA DE PAGO
       * boolean = false CONSULTAMOS POR USUARIOS DONANTE
       */
      this.isLoading = true; //MOSTRAMOS EL LOADER
      this._boxService
        .filterTransaction({ payment_ref: this.payment_ref_grupal.value })
        .subscribe(
          (res) => {
            //REINICAMOS LA TABLA DE LOS USUARIOS
            this.grupal_table = [];
            let find_user_massive = false;
            let transactions = [];

            res.map((tr) => {
              //VALIDAMOS EL REGISTROS DE USUARIOS MASIVOS
              //PUSHEAMOS SOLO EL USUARIO DONANTE DE MASIVO
              if (tr.transaction?.user_massive) {
                transactions.push(tr);
                find_user_massive = true;
              }
            });

            //SI NO ENCONTRAMOS USUARIO MASIVO
            if (!find_user_massive) {
              res.map((tr) => {
                //VALIDAMOS LOS USUARIOS ASISTENTES Y LOS RENDERIZAMOS
                if (tr.isAssistant) {
                  transactions.push(tr);
                }
              });
            }
            this.isLoading = false; //OCULTAMOS EL LOADER
            this.grupal_table = transactions;
            this.cdr.detectChanges();
          },
          (err) => {
            this.isLoading = false; //OCULTAMOS EL LOADER
            this.cdr.detectChanges();
            throw new Error('NO SE PUDO EJECUTAR LA TRANSACCIÓN');
          }
        );
    }
  }

  /**VALIDADORES DE INPUNTS */

  //METODO PARA VALIDAR UNICAMENTE LOS NUMEROS
  validateNumber(e) {
    if (!e.key.match(/[0-9]/i)) {
      e.preventDefault(); //ELIMINAMOS PULSACION SI NO ES UN NUMERO
    }
  }

  createPdf(element) {
    
    this._makePdfService.createPdf(element.transaction.payment_ref, this.box);
  }
}
