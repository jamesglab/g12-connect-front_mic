import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { G12eventsService } from '../../../_services/g12events.service';

@Component({
  selector: 'app-changue-event-user',
  templateUrl: './changue-event-user.component.html',
  styleUrls: ['./changue-event-user.component.scss']
})
export class ChangueEventUserComponent implements OnInit {
  public report;
  public events;
  public editEventReport: FormGroup;
  constructor(private fb: FormBuilder, private _g12Events: G12eventsService,
    public modal: NgbActiveModal) { }
    
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.editEventReport = this.fb.group({
      donation: [null, Validators.required],
      financial_cut: [null, Validators.required],
      description: [null, Validators.required],
      transaction: [this.report.transaction.id]
    });
  }
  onSubmit() {
    if (this.editEventReport.valid) {
      this._g12Events.changueReport(this.editEventReport.getRawValue()).subscribe(res => {
        this.modal.close(true);
        Swal.fire('Reporte Actualizado', '', 'success');
      }, err => {
        Swal.fire('No se pudo actualizar', '', 'error');
      })
    } else {
      Swal.fire('Valida los campos', '', 'warning');
    }
  }
}
