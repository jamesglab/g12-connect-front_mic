import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EmailService } from '../../_services/email.service';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss'],
})
export class UpdateEmailComponent implements OnInit {
  public show_image = 'assets/images/default-image.png'; //IMAGEN INCIALIZADA EN DEFAULT
  public image_file: File; //GUARDAREMOS EL ARCHIVO DE LA IMAGEN
  public isLoading: boolean = false;
  public update_email_form: FormGroup; //FORM
  public email_to_update;

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
    this.update_email_form = this.fb.group({
      id: [],
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
    //SETEAMOS LOS VALORES DEL EMAIL A ACTUALIZAR
    this.update_email_form.patchValue(this.email_to_update);
    this.show_image = this.email_to_update.image.url;
  }

  updateEmail() {
    //VALIDAMOS LOS CAMPOS DEL FORMULARIO
    try {
      if (this.update_email_form.invalid) {
        throw new Error('Campos incompletos');
      }
      //CREAMOS UN PAYLOAD FORMDATA
      const payload = new FormData();
      //VALIDAMOS SI EXISTE UNA IMAGEN A ACTUALIZAR
      if (this.image_file) {
        payload.append('image', this.image_file);
      }
      //ANEXAMOS EL PAYLOAD DE LOS DATOS A ACTUALIZAR
      payload.append(
        'payload',
        JSON.stringify(this.update_email_form.getRawValue())
      );
      //MOSTRAMOS EL LOADER
      this.isLoading = true;
      this._emailService.updateEmail(payload).subscribe(
        (res) => {
          this.isLoading = false;
          Swal.fire('Correo Actualizado', '', 'success');
          this.modal.close();
        },
        (err) => {
          this.isLoading = false;
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
