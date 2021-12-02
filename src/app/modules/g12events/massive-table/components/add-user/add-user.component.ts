import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { UserService } from 'src/app/modules/_services/user.service';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import Swal from 'sweetalert2';
import { G12eventsService } from '../../../_services/g12events.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserMassiveComponent implements OnInit {
  public add_user: FormGroup;
  private currentUser = this.storageService.getItem('auth').user;
  public transaction: any;
  public leaders: [] = [];
  public pastors: [] = [];
  public churchs = [];
  public countries: any[] = COUNTRIES; //LISTADO DE PAISES;

  public isLoading: boolean = false;
  public find_user: boolean = false;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private g12EventService: G12eventsService,
    public cdr: ChangeDetectorRef,
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getChurchs(this.currentUser.church_id);
  }

  //*************************/
  // OPCIONES DEL FORMULARIO
  //************************/

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.add_user = this.fb.group({
      transaction_id: [this.transaction.transaction.id, Validators.required],
      id: [null],
      country: [
        this.currentUser.church_id ? 'Colombia' : null,
        Validators.required,
      ],
      document: [null, Validators.required],
      document_type: [null],
      name: [null, Validators.required],
      last_name: [null, Validators.required],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      confirm_email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      leader: [{ value: null, disabled: true }, Validators.required],
      network: [null],
      type_church: ['MCI'],
      pastor: [{ value: null, disabled: true }, Validators.required],
      church: [{ value: null, disabled: true }, Validators.required],
    });
    // this.subscriptionsForms();
  }

  //****************************/
  //CONSULTAS A LA BASE DE DATOS
  //****************************/

  //CONSULTAMOS LOS PASTORES QUE PERTENECEN A UNA RED SEGUN LA IGLESIA
  //NETWORK = RED ;USER = USUARIO ENCONTRADO
  getPastors(user_code, user?) {
    this.pastors = [];
    this.form_controls.leader.disable();
    this.form_controls.pastor.disable();
    this.userService
      .getLeadersOrPastors({
        userCode: user_code,
        church: user ? user.church_id : this.currentUser.church_id,
      })
      .subscribe(
        (res) => {
          this.pastors = res;
          this.form_controls.pastor.enable(); //INHABILITAMOS EL SELECTOR DEL PASTOR
          if (user) {
            console.log(
              'selector',
              res.find((pt) => pt.user_code == user.pastor_code)
            );
            this.form_controls.pastor.setValue(
              res.find((pt) => pt.user_code == user.pastor_code)
            );
            this.form_controls.pastor.disable();
          }
        },
        (err) => {
          throw err;
        }
      );
  }

  // CONSULTAMOS LOS LIDERES QUE PERTENECEN A LA RED DEL PASTOR
  getLeaders(pastor, user?) {
    this.leaders = []; //REINICIAMOS LOS LIDERES QUE CAMBIAN DE UN PASTOR A OTRO
    this.userService
      .getLeadersOrPastors({
        userCode: pastor.user_code,
        church: user ? user.church_id : this.currentUser.church_id,
      })
      .subscribe(
        (res) => {
          this.leaders = res;
          this.add_user.get('leader').enable(); //HABILITAMOS EL SELECTOR DEL LIDER
          if (user) {
            this.form_controls.leader.setValue(
              res.find((ld) => ld.user_code == user.leader_code)
            );
          }
        },
        (err) => {
          throw err;
        }
      );
  }

  getChurchs(id) {
    this.userService.getChurchById({ id }).subscribe(
      (res) => {
        let city = [];
        city.push(res);
        this.add_user.get('church').setValue(city.find((ch) => ch.id == id));
        this.churchs = city;
      },
      (err) => {
        throw err;
      }
    );
  }

  searchUser(autocomplete?) {
    const filters = {};
    if (this.form_value.document) {
      filters['identification'] = this.form_value.document.trim();
    }

    if (
      this.add_user.value.confirm_email &&
      this.form_value.email == this.form_value.confirm_email
    ) {
      filters['email'] = this.form_value.email.trim().toLowerCase();
    }

    this.userService.getUserInfo(filters).subscribe(
      (res) => {
        console.log('user', res);
        this.find_user = true;
        if (autocomplete) {
          this.setUser(res);
        } else {
          this.form_controls.id.setValue(res['id']);
          this.createUser();
        }
      },
      (err) => {
        if (autocomplete) {
          Swal.fire('No se encontro el usuario', '', 'info').then((res) => {
            this.form_controls.network.enable();
            this.form_controls.network.reset();
            this.form_controls.pastor.reset();
            this.form_controls.leader.reset();
          });
          throw err;
        }
      }
    );
  }

  //SOLICITUD DE CREACION DE USUARIO
  addUserSend() {
    //VALIDAMOS LOS CAMPOS DEL USUARIO
    if (this.add_user.invalid) {
      Swal.fire('Datos incompletos', '', 'info');
      return;
    }
    //CONFIRMAMOS EL EMAIL
    if (this.add_user.value.email != this.add_user.value.confirm_email) {
      Swal.fire('Los correos no coinciden', '', 'info');
      return;
    }
    //MOSTRAMOS EL LOADER\
    if (this.find_user) {
      Swal.fire({
        title: '¿Actualizar Usuario?',
        icon: 'question',
        text: 'El usuario que intentas registrar ya se encuentra en nuestro sistema. al continuar la información del usuario podria verse afectada',
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        showCancelButton: true,
        showCloseButton: true,
      }).then((res) => {
        if (res.isConfirmed) {
          this.createUser();
        }
      });
    } else {
      //VALIDAMOS QUE EL USUARIO EXISTA
      const filters = {};
      if (this.form_value.document) {
        filters['identification'] = this.form_value.document.trim();
      }

      if (
        this.add_user.value.confirm_email &&
        this.form_value.email == this.form_value.confirm_email
      ) {
        filters['email'] = this.form_value.email.trim().toLowerCase();
      }

      this.userService.getUserInfo(filters).subscribe(
        (res) => {
          console.log('user', res);
          this.add_user.get('id').setValue(res['id']);
          this.find_user = true;
        },
        (err) => {
          this.createUser();
        }
      );
    }
  }

  createUser() {
    this.isLoading = true;
    //EJECUTAMOS EL ENDPOINT CON LOS DATOS DEL USUARIO
    this.g12EventService.addUser(this.add_user.getRawValue()).subscribe(
      (res) => {
        Swal.fire('Usuario Agregado', '', 'success').then((res) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.modal.close(res);
        });
      },
      (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        Swal.fire(err ? err : 'No se pudo ejecutar la acción', '', 'error');
      }
    );
  }

  //****************************/
  //CONTROLES DEL FORMULARIO
  //****************************/

  setUser(user) {
    //VALIDAMOS EL TIPO DE USUARIO
    switch (user?.type_church?.toString().toUpperCase()) {
      //CASO MCI RENDERIZAMOS LOS USUARIOS
      case 'MCI':
        this.getPastors(user.pastor_code, user);
        this.getLeaders({ user_code: user.leader_code }, user);
        this.getChurchs(user.church_id);
        this.form_controls.network.disable();

        break;

      default:
        //SI NO ES HABILITAMOS LOS CAMPOS DE SELECCION
        this.form_controls.network.enable();
        this.form_controls.pastor.enable();
        this.form_controls.leader.enable();
        break;
    }
    this.form_controls.document.disable();
    this.form_controls.country.setValue(user.country);
    this.form_controls.id.setValue(user.id);
    this.form_controls.name.setValue(user.name);
    this.form_controls.last_name.setValue(user.last_name);
    this.form_controls.email.setValue(user.email);
    this.form_controls.confirm_email.setValue(user.email);
    this.form_controls.gender.setValue(user.gender);
    this.form_controls.phone.setValue(user.phone);
    this.form_controls.network.setValue(user.network);
    this.form_controls.document.setValue(user.identification);
    this.form_controls.document_type.setValue(user.document_type);
  }

  validateNumber(e) {
    if (e.key.match(/[0-9]/i) === null) {
      // Si la tecla pulsada no es la correcta, eliminado la pulsación
      e.preventDefault();
    }
  }
  // CONTROLES DEL FORMULARIO
  get form_controls() {
    return this.add_user.controls;
  }

  // VALORES DEL FORMULARIO
  get form_value() {
    return this.add_user.value;
  }
}
