import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { G12eventsService } from '../../_services/g12events.service';
import { ExportService } from 'src/app/modules/_services/export.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generate-codes',
  templateUrl: './generate-codes.component.html',
  styleUrls: ['./generate-codes.component.scss']
})
export class GenerateCodesComponent implements OnInit {
  public event = null; //obtenemos la instancia del evento cuando se abre el modale
  public codesForm: FormGroup = null; // generamos la variable de tipo FormGroup
  loader: boolean = false;
  constructor(
    private fb: FormBuilder, private eventsService: G12eventsService, public modal: NgbActiveModal, private exportService: ExportService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  // creamos los campos neeesarios para el formulario reactivo
  buildForm() {
    this.codesForm = this.fb.group({
      quantity: [null, Validators.required],
      payment_ref: [null],
      payment_gateway: [null, Validators.required],
      amount: [{ value: null, disabled: true }, Validators.required],
      currency: [null],
      response: [null],
      donation: [this.event],
      financial_cut: [this.event.financialCut[0], Validators.required],
    });
  }
  setAmountForm() {
    this.codesForm.get('amount').setValue(this.codesForm.value.financial_cut?.prices[this.codesForm.value?.currency]);
  }


  onSubmit() {
    if (this.codesForm.valid) {
      this.loader = true;
      this.eventsService.createCodesByEvent(this.codesForm.getRawValue()).subscribe(codes => {
        this.loader = false;
        var exporData = [];
        codes.map(code => {
          const obj = {
            codigo: code
          }
          exporData.push(obj);
        })
        this.exportService.exportAsExcelFile(exporData, this.event.name);
        this.modal.close("success");
      }, err => {
        this.loader = false;
        Swal.fire(err.error.message ? err.error.message : 'Algo ocurrio intenta mas tarde', '', 'error')
      })
    } else {
      Swal.fire('Faltan datos en el formulario', '', 'info')
    }

  }
}
