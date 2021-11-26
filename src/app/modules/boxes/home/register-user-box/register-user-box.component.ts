import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { G12eventsService } from 'src/app/modules/g12events/_services/g12events.service';
import { UserService } from 'src/app/modules/_services/user.service';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import Swal from 'sweetalert2';
import { BoxService } from '../services/g12events.service';

@Component({
  selector: 'app-register-user-box',
  templateUrl: './register-user-box.component.html',
  styleUrls: ['./register-user-box.component.scss'],
})
export class RegisterUserBoxComponent implements OnInit {
  public box;
  public register_user: FormGroup;
  private currentUser = this.storageService.getItem('auth').user;
  public leaders: [] = [];
  public pastors: [] = [];
  public churchs = [];
  public countries: any[] = COUNTRIES; //LISTADO DE PAISES;
  public events: [] = [];
  public financial_cuts: [] = [];

  public confirm_email = new FormControl(
    null,
    Validators.compose([Validators.required, Validators.email])
  );
  public isLoading: boolean = false;
  public find_user: boolean = false;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private g12EventService: G12eventsService,
    public cdr: ChangeDetectorRef,
    private userService: UserService,
    private storageService: StorageService,
    private boxService: BoxService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEvents();
    this.getChurchs(this.currentUser.church_id);
  }

  //*************************/
  // OPCIONES DEL FORMULARIO
  //************************/

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.register_user = this.fb.group({
      //EVENT INFORMATION
      event_information: this.fb.group({
        event: [null, Validators.required],
        financial_cut: [null, Validators.required],
        quantity_tickets:[1]
      }),
      //USER INFORMATION
      user: this.fb.group({
        id: [null],
        country: [
          this.currentUser.church_id ? 'Colombia' : null,
          Validators.required,
        ],
        identification: [null, Validators.required],
        document_type: [null],
        name: [null, Validators.required],
        last_name: [null, Validators.required],
        gender: [null, Validators.required],
        phone: [null, Validators.required],
        email: [
          null,
          Validators.compose([Validators.required, Validators.email]),
        ],

        leader: [{ value: null, disabled: true }, Validators.required],
        network: [null],
        type_church: ['MCI'],
        pastor: [{ value: null, disabled: true }, Validators.required],
        church: [{ value: null, disabled: true }, Validators.required],
      }),
    });
    this.subscribeSelectors();
  }
  ///////////////////////////////
  //SUBSCRIPCIONES DEL FORMULARIO
  ///////////////////////////////

  subscribeSelectors() {
    // NOS SUBSCRIBIMOS A LOS CAMBIOS DEL EVENTO SELECCIONADO
    this.event_information_controls
      .get('event')
      .valueChanges.subscribe((event) => {
        this.event_information_controls.get('financial_cut').reset(); //REINICIAMOS EL CORTE SELECCIONADO
        this.financial_cuts = event.financialCut; //RENDERIZAMOS LOS CORTES SELECCIONADOS
      });
  }
  //****************************/
  //CONSULTAS A LA BASE DE DATOS
  //****************************/

  //CONSULTAMOS LOS EVENTOS
  getEvents() {
    this.g12EventService.getEventsFilter().subscribe((res) => {
      this.events = res;
    });
  }

  //CONSULTAMOS LOS PASTORES QUE PERTENECEN A UNA RED SEGUN LA IGLESIA
  //NETWORK = RED ;USER = USUARIO ENCONTRADO
  getPastors(user_code, user?) {
    this.pastors = [];
    this.user_controls.get('leader').disable();
    this.user_controls.get('pastor').disable();
    this.userService
      .getLeadersOrPastors({
        userCode: user_code,
        church: user ? user.church_id : this.currentUser.church_id,
      })
      .subscribe(
        (res) => {
          this.pastors = res;
          this.user_controls.get('pastor').enable(); //INHABILITAMOS EL SELECTOR DEL PASTOR
          if (user) {
            this.user_controls
              .get('pastor')
              .setValue(res.find((pt) => pt.user_code == user.pastor_code));
            this.user_controls.get('pastor').disable();
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
          this.user_controls.get('leader').enable(); //HABILITAMOS EL SELECTOR DEL LIDER
          if (user) {
            this.user_controls
              .get('leader')
              .setValue(res.find((ld) => ld.user_code == user.leader_code));
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
        this.user_controls
          .get('church')
          .setValue(city.find((ch) => ch.id == id));
        this.churchs = city;
      },
      (err) => {
        throw err;
      }
    );
  }

  searchUser(autocomplete?) {
    const filters = {};
    if (this.form_value.identification) {
      filters['identification'] = this.form_value.identification.trim();
    }

    if (
      this.confirm_email.value &&
      this.form_value.email == this.confirm_email.value
    ) {
      filters['email'] = this.form_value.email.trim().toLowerCase();
    }

    this.userService.getUserInfo(filters).subscribe(
      (res) => {
        this.find_user = true;
        if (autocomplete) {
          this.setUser(res);
        } else {
          this.user_controls.get('id').setValue(res['id']);
          this.createUser();
        }
      },
      (err) => {
        if (autocomplete) {
          Swal.fire('No se encontro el usuario', '', 'info').then((res) => {
            this.user_controls.get('network').enable();
            this.user_controls.get('network').reset();
            this.user_controls.get('pastor').reset();
            this.user_controls.get('leader').reset();
          });
          throw err;
        }
      }
    );
  }

  //SOLICITUD DE CREACION DE USUARIO
  addUserSend() {
    //VALIDAMOS LOS CAMPOS DEL USUARIO
    if (this.user_controls.invalid || this.event_information_controls.invalid) {
      Swal.fire('Datos incompletos', '', 'info');
      return;
    }
    //CONFIRMAMOS EL EMAIL
    if (this.user_controls.value.email != this.confirm_email.value) {
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
      if (this.form_value.identification) {
        filters['identification'] = this.form_value.identification.trim();
      }

      if (
        this.confirm_email.value &&
        this.form_value.email == this.form_value.confirm_email
      ) {
        filters['email'] = this.form_value.email.trim().toLowerCase();
      }

      this.userService.getUserInfo(filters).subscribe(
        (res) => {
          this.user_controls.get('id').setValue(res['id']);
          this.find_user = true;
        },
        (err) => {
          this.createUser();
        }
      );
    }
  }

  createUser() {
    // //EJECUTAMOS EL ENDPOINT CON LOS DATOS DEL USUARIO
    this.isLoading = true;
    this.boxService
      .registerOneUser({
        ...this.register_user.getRawValue(),
        box: this.box,
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          Swal.fire('Usuario registrado', '', 'success');
          this.modal.close();
        },
        (err) => {
          this.isLoading = false;
          Swal.fire(err ? err : 'No se pudo registrar el usuario', '', 'error');
        }
      );
  }

  //****************************/
  //CONTROLES DEL FORMULARIO
  //****************************/

  setUser(user) {
    this.user_controls.get('country').setValue(user.country);
    this.user_controls.get('id').setValue(user.id);
    this.user_controls.get('name').setValue(user.name);
    this.user_controls.get('last_name').setValue(user.last_name);
    this.user_controls.get('email').setValue(user.email);
    this.confirm_email.setValue(user.email);
    this.user_controls.get('gender').setValue(user.gender);
    this.user_controls.get('phone').setValue(user.phone);
    this.user_controls.get('network').setValue(user.network);
    this.user_controls.get('network').disable();
    this.user_controls.get('identification').setValue(user.identification);
    this.user_controls.get('identification').disable();
    this.user_controls.get('document_type').setValue(user.document_type);
    this.getPastors(user.pastor_code, user);
    this.getLeaders({ user_code: user.leader_code }, user);
    this.getChurchs(user.church_id);
  }

  validateNumber(e) {
    if (e.key.match(/[0-9]/i) === null) {
      // Si la tecla pulsada no es la correcta, eliminado la pulsación
      e.preventDefault();
    }
  }

  get user_controls() {
    return this.register_user.get('user');
  }

  get event_information_controls() {
    return this.register_user.get('event_information');
  }

  // VALORES DEL FORMULARIO
  get form_value() {
    return this.user_controls.value;
  }
}
