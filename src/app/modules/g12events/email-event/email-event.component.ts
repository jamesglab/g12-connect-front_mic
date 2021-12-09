import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EmailService } from '../../emails/_services/email.service';

@Component({
  selector: 'app-email-event',
  templateUrl: './email-event.component.html',
  styleUrls: ['./email-event.component.scss'],
})
export class EmailEventComponent implements OnInit {
  public event: any;
  public show_image = 'assets/images/default-image.png'; //IMAGEN INCIALIZADA EN DEFAULT
  public image_file: File; //GUARDAREMOS EL ARCHIVO DE LA IMAGEN
  public isLoading: boolean = false;

  public create_email_form: FormGroup; //FORM

  public find_email: boolean;

  constructor(
    private fb: FormBuilder,
    private _emailService: EmailService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEmail();
  }

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.create_email_form = this.fb.group({
      event: [this.event.id, Validators.required],
      //EVENT INFORMATION
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
      template_id: [],
    });
  }
  //BUSCAMOS EL CORREO DEL EVENTO
  getEmail() {
    try {
      this._emailService.getEmailForEvent(this.event.id).subscribe(
        (res: any) => {
          /**ENCONTRAMOS EL CORREO DEL EVENTO
           * PONEMOS BANDERA DE 'find_email' en true
           * SETEAMOS LOS VALORES ENCONTRADOS EN EL FORMULARIO
           * EL patchValue DEL FORMULARIO RENDERIZARA LOS CAMPOS DE LA CONSULTA INCLUYENDO EL ID DEL CORREO
           */
          this.find_email = true;

          //CREAMOS EL CONTROLADOR id PARA ACTUALIZAR EL CORREO EN EL BACKEND
          this.create_email_form.addControl(
            'id',
            this.fb.control([Validators.required])
          );

          this.create_email_form.patchValue(res);
          //SETEAMOS LA IMAGEN DEL EVENTO
          this.show_image = res.image.url;
        },
        (err) => {
          this.find_email = false;
          throw new Error(err);
        }
      );
    } catch (error) {
      console.error('error', error);
    }
  }

  /**
   * CREAMOS LA CONSULTA DEL CORREO
   */

  createEmail() {
    try {
      //VALIDAMOS LOS CAMPOS DEL FORMULARIO
      if (this.create_email_form.invalid) {
        throw new Error('Campos incompletos');
      }
      //VALIDAMOS LA IMAGEN DEL CORREO
      if (!this.image_file) {
        throw new Error('No haz creado la imagen del correo');
      }
      //CREAMOS EL FORMDATA
      const payload = new FormData();
      //ANEXAMOS LA IMAGEN
      payload.append('image', this.image_file);
      //ANEXAMOS LA EL OBJETO DE EL CORREO
      payload.append(
        'payload',
        JSON.stringify(this.create_email_form.getRawValue())
      );
      //MOSTRAMOS EL LOADER
      this.isLoading = true;
      this._emailService.createEmailForEvent(payload).subscribe(
        (res) => {
          //OCULTAMOS EL LOADER
          this.isLoading = false;
          //MESAJE DE SUCCESS
          Swal.fire('Correo de Bienvendia creado', '', 'success');
          //CERRAMOS EL MODAL
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

  //ACTUALIAMOS EL CORREO DEL EVENTO
  updateEmail() {
    try {
      if (this.create_email_form.invalid) {
        throw new Error('Campos incompletos');
      }
      //CREAMOS EL FORMDATA
      const payload = new FormData();
      //VALIDAMOS SI SE EXISTE UNA IMAGEN SELECCIONADA POR EL USUARIO
      if (this.image_file) {
        //ABRIMOS EL CAMO image Y CREAMOS EL ARCHIVO
        payload.append('image', this.image_file);
      }

      //CREAMOS LOS VALORES DEL OBJETO
      payload.append(
        'payload',
        JSON.stringify(this.create_email_form.getRawValue())
      );

      //CONSUMIMOS EL OBJETO DE ACTUALIZACION
      this.isLoading = true;
      this._emailService.updateEmailForEvent(payload).subscribe(
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

  /**
   * HELPERS
   */
  fileChangeEvent(event: any): void {
    if (event.target.files[0].type.split('/')[0] == 'image') {
      //TRANSFORMAMOS LA IAMGEN EN BS64
      this.getBase64(event).then((res: any) => {
        this.show_image = res;
      });
    } else {
      Swal.fire('Imagen no detectada', '', 'error');
    }
  }

  //RECIBIMOS LA IMAGEN
  async getBase64(event) {
    //CREAMOS UNA PROMERA DE RESPUESTA DE LA IMAGEN
    return new Promise((resolve, reject) => {
      //AGREGAMOS EL ARCHIVO DE LA IMAGEN A UNA VARIABLE LOCAL
      let file = event.target.files[0];
      //SETEAMOS LA IMAGEN EN NUESTRO image_file
      this.image_file = event.target.files[0];
      //CREAMOS UN RENDER DE LA IMAGEN
      let reader = new FileReader();
      //AGREGAMOS EL ARCHIVO DE LA IMAGEN A UNA VARIABLE LOCAL
      //CREAMOS LA IMAGEN EN BS64
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        resolve(event.target.result);
      };
    });
  }
}
