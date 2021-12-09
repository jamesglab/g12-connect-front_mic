import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EmailService } from '../../_services/email.service';

@Component({
  selector: 'app-create-email',
  templateUrl: './create-email.component.html',
  styleUrls: ['./create-email.component.scss'],
})
export class CreateEmailComponent implements OnInit {
  
  public show_image = 'assets/images/default-image.png'; //IMAGEN INCIALIZADA EN DEFAULT
  public image_file: File; //GUARDAREMOS EL ARCHIVO DE LA IMAGEN
  public isLoading: boolean = false;
  public create_email_form: FormGroup; //FORM

  constructor(
    private fb: FormBuilder,
    private _emailService: EmailService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.create_email_form = this.fb.group({
      subject: this.fb.group({
        es: [null, Validators.required],
        en: [null],
        pt: [null],
      }),
      body: this.fb.group({
        es: [null, Validators.required],
        en: [null],
        pt: [null],
      }),
      biblical_text: this.fb.group({
        es: [null, Validators.required],
        en: [null],
        pt: [null],
      }),
      type: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  createEmail() {
    try {
      if (this.create_email_form.invalid) {
        throw new Error('Campos incompletos');
      }
      if (!this.image_file) {
        throw new Error('No haz creado la imagen del correo');
      }
      const payload = new FormData();
      payload.append('image', this.image_file);
      payload.append(
        'payload',
        JSON.stringify(this.create_email_form.getRawValue())
      );
      this.isLoading = true;
      this._emailService.createEmailModule(payload).subscribe(
        (res) => {
          this.isLoading = true;
          Swal.fire('Correo creado', '', 'success');
          this.modal.close();
        },
        (err) => {
          throw new Error(err ? err : 'No encontramos el error');
        }
      );
    } catch (error) {
      Swal.fire(error?.message ? error.message : '', '', 'error');
    }
  }

  fileChangeEvent(event: any): void {
    if (event.target.files[0].type.split('/')[0] == 'image') {
      this.getBase64(event).then((res: any) => {
        this.show_image = res;
      });
    } else {
      Swal.fire('Imagen no detectada', '', 'error');
    }
  }

  async getBase64(event) {
    return new Promise((resolve, reject) => {
      let file = event.target.files[0];
      this.image_file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        resolve(event.target.result);
      };
    });
  }
}
