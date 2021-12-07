import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-email',
  templateUrl: './create-email.component.html',
  styleUrls: ['./create-email.component.scss']
})
export class CreateEmailComponent implements OnInit {
  public show_image = 'assets/images/default-image.png'; //IMAGEN INCIALIZADA EN DEFAULT
  public image_file: File; //GUARDAREMOS EL ARCHIVO DE LA IMAGEN
  public isLoading: boolean = false;

  public create_email: FormGroup; //FORM

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.create_email = this.fb.group({
      //EVENT INFORMATION
      subject: this.fb.group({
        es: [null, Validators.required],
        en: [null, Validators.required],
        pt: [null, Validators.required],
      }),
      body: this.fb.group({
        es: [null, Validators.required],
        en: [null, Validators.required],
        pt: [null, Validators.required],
      }),
      biblical_text: this.fb.group({
        es: [null, Validators.required],
        en: [null, Validators.required],
        pt: [null, Validators.required],
      }),
    });
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

  createEmail(){
    console.log('tenemos el cuerpo ',this.create_email.getRawValue())
  }
}
