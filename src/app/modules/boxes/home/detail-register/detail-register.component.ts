import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { BoxService } from '../_services/Boxes.service';
import { MakePdfService } from '../_services/make-pdf.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-detail-register',
  templateUrl: './detail-register.component.html',
  styleUrls: ['./detail-register.component.scss'],
})
export class DetailRegisterComponent implements OnInit {
  /**TABLAS DE ANGULAR MATERIAL
   *ARRAYS DE CONSULTA
   */
  public displayedColumns: string[] = [
    'i',
    'name',
    'last_name',
    'email',
    'document',
    'assistant',
  ];
  public table_users = [];
  public user_massive: boolean = false;
  public description_of_change = new FormControl('', Validators.required);
  public select_payment_getway = new FormControl('', Validators.required);

  //OBJETOS DE COMPONENTES PADRES
  public transaction;
  public box;

  //BANDERAS
  public isLoading: boolean = false;

  constructor(
    public _boxService: BoxService,
    public modal: NgbActiveModal,
    private makePdfService: MakePdfService
  ) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  //METODO PARA CONSULTAR LAS TRANSACCIONES DE LOS USUARIOS ASITENTES
  getTransactions() {
    //CONSULTAMOS LAS TRANSACCIONES
    /**
     * payment_ref  REFERENCIA DE PAGO
     * boolean = true CONSULTAMOS POR USUARIOS ASITENTES
     */
    this._boxService
      .filterTransaction({
        payment_ref: this.transaction.transaction.payment_ref,
      })
      .subscribe(
        (res) => {
          //AGREGAMOS RESPUESTA A LA TABLA DE USUARIOS
          let transactions = [];

          res.map((tr) => {
            if (tr.isAssistant) {
              transactions.push(tr);
            }
          });
          this.table_users = transactions;
        },
        (err) => {
          throw new Error(err);
        }
      );
  }

  updateTransaction() {
    try {
      //VALIDAMOS SI HAY UN METODO DE PAGO SELECCIONADO
      if (!this.select_payment_getway.value) {
        //CREAMOS UN ERROR DE INFORMACION DE PAGO INCOMPLETA
        throw new Error('Selecciona una forma de pago');
      }
      //HACEMOS UN SWITCH DE LOS DIFERENTES METODOS QUE NECESITAREMOS VALIDAR
      switch (this.select_payment_getway.value) {
        //CASO CREDITO NECESITAMOS COMPLEMENTAR LA INFORMACION DE REFERENCIA
        case 'CREDITO/':
          //VALIDAMOS LA DESCRIPCION DEL PAGO
          if (!this.description_of_change.value) {
            //CREAMOS UN ERROR DE REFERENCIA DE PAGO INCOMPLETA
            throw new Error('Referencia de pago incompleta');
          }
          break;
      }

      //CREAMOS UNA CONFIRMACION DEL PAGO
      Swal.fire({
        title: '¿Aprobar Transacción?',
        icon: 'question',
        text: 'Al aprobar la transacción los usuarios asistentes quedaran inscritos en el evento',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        showCancelButton: true,
        showCloseButton: true,
      }).then((res) => {
        //SI LA CONFIRMACION ES APROBADA PROCEDEMOS CON EL PAGO
        if (res.isConfirmed) {
          this.isLoading = true;
          this._boxService
            .updateTransactions({
              transaction_id: this.transaction.transaction.id,
              box: this.box,
              description_of_change: this.description_of_change.value,
            })
            .subscribe(
              (res) => {
                Swal.fire('Usuarios registrados', '', 'success');
                this.makePdfService.createPdf(
                  this.transaction.transaction.payment_ref,
                  this.box
                );
                this.isLoading = false;

                this.modal.close();
              },
              (err) => {
                Swal.fire(
                  err ? err : 'No se pudo aprobar la transacción',
                  '',
                  'error'
                );
                this.isLoading = false;
              }
            );
        }
      });
    } catch (error) {
      Swal.fire(error.message, '', 'info');
    }
  }

  cancelTransaction() {
    Swal.fire({
      title: '¿Cancelar Transacción?',
      icon: 'question',
      text: '¿Estas seguro de cancelar la transacción?',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
      showCancelButton: true,
      showCloseButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.isLoading = true;
        this._boxService
          .cancelTransaction({
            transaction_id: this.transaction.transaction.id,
          })
          .subscribe((res) => {
            Swal.fire('Transacción cancelada', '', 'success');
            this.isLoading = false;
            this.modal.close();
          });
      }
    });
  }
}
