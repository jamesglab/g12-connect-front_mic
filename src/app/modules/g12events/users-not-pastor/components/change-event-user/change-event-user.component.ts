import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { G12eventsService } from '../../../_services/g12events.service';

@Component({
  selector: 'app-change-event-user',
  templateUrl: './change-event-user.component.html',
  styleUrls: ['./change-event-user.component.scss']
})
export class changeEventUserComponent implements OnInit {

  public report: any = null;
  public events: any[] = [];
  public editEventReport: FormGroup;
  public loader: boolean = false;

  constructor(private fb: FormBuilder, private _g12Events: G12eventsService,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.buildForm();
    this.report.transaction.payment_method = this.formatPaymentMethod(this.report.transaction.payment_method);
  }

  buildForm() {
    this.editEventReport = this.fb.group({
      donation: [null, Validators.required],
      financial_cut: [null, Validators.required],
      description: [null, Validators.required],
      transaction: [this.report.transaction.id]
    });
  }

  formatPaymentMethod(type: string): string {
    let payments = {
      "credit": "Tarjeta de crédito",
      "pse": "PSE",
      "cash": "Efectivo",
      "administration": "Administración",
      "box": "Caja"
    };
    return payments[type.toLocaleLowerCase() || ''];
  }

  onSubmit() {
    if (this.editEventReport.valid) {
      this.loader = true;
      if (parseInt(this.report?.transaction?.amount)
        == parseInt(this.editEventReport.getRawValue().financial_cut.prices[this.report?.transaction?.currency?.toLowerCase()])) {
        this._g12Events.changeReport(this.editEventReport.getRawValue()).subscribe(res => {
          this.loader = false;
          this.modal.close(true);
          Swal.fire('Reporte Actualizado', '', 'success');
        }, err => {
          this.loader = false;
          Swal.fire('No se pudo actualizar', err, 'error');
        });
      } else {
        this.loader = false;
        Swal.fire('No se pudo actualizar', 'El precio de la transaccion y el precio del corte no coinciden', 'info');
      }
    } else {
      Swal.fire('Valida los campos', '', 'warning');
    }
  }

}
