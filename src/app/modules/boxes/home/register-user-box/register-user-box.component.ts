import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { G12eventsService } from 'src/app/modules/g12events/_services/g12events.service';
import { UserService } from 'src/app/modules/_services/user.service';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BoxService } from '../_services/Boxes.service';
import { MakePdfService } from '../_services/make-pdf.service';

@Component({
  selector: 'app-register-user-box',
  templateUrl: './register-user-box.component.html',
  styleUrls: ['./register-user-box.component.scss'],
})
export class RegisterUserBoxComponent implements OnInit {
  //OBJETOS DEL USUARIO
  public box;

  //ARRAYS DE CONSULTAS
  public leaders: [] = [];
  public pastors: [] = [];
  public churchs = [];
  public countries: any[] = COUNTRIES; //LISTADO DE PAISES;
  public events: [] = [];
  public financial_cuts: [] = [];

  //FORMULARIO

  public register_user: FormGroup;
  //CONTROLES EXTERNOS AL FORMULARIO
  public description_of_changue = new FormControl('', Validators.required);
  public select_payment_getway = new FormControl('', Validators.required);
  public currency = new FormControl('', Validators.required);

  public confirm_email = new FormControl(
    null,
    Validators.compose([Validators.required, Validators.email])
  );

  //BANDERAS BOOLEANAS
  public isLoading: boolean = false;
  public find_user: boolean = false;
  public disable_ministerial_info: boolean = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private g12EventService: G12eventsService,
    public cdr: ChangeDetectorRef,
    private userService: UserService,
    private boxService: BoxService,
    private _makePdfService: MakePdfService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEvents();
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
        quantity_tickets: [1],
      }),
      //USER INFORMATION
      assistant: this.fb.group({
        id: [null],
        country: [Validators.required],
        identification: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[0-9a-zA-Z\s,-]+$/),
            Validators.minLength(6),
            Validators.maxLength(13),
          ]),
        ],
        document_type: [null, Validators.required],
        name: [null, Validators.required],
        last_name: [null, Validators.required],
        gender: [null, Validators.required],
        phone: [null, Validators.required],
        email: [
          null,
          Validators.compose([Validators.required, Validators.email]),
        ],
        type_church: [null, Validators.required],
        network: [null],
        leader: [{ value: null, disabled: true }],
        pastor: [{ value: null }],
        church: [{ value: null }],
        name_pastor: [null],
        name_church: [null],
      }),
      payment_information: this.fb.group({
        currency: ['COP'],
        payment_type: ['BOX'],
        platform: ['G12CONNECT'],
        url_response: [environment.url_response],
        amount: [],
      }),
    });
    this.subscribeSelectors();
  }

  /**
   *SUBSCRIPCIONES DEL FORMULARIO
   */

  subscribeSelectors() {
    // NOS SUBSCRIBIMOS A LOS CAMBIOS DEL EVENTO SELECCIONADO
    this.event_information_controls
      .get('event')
      .valueChanges.subscribe((event) => {
        this.event_information_controls.get('financial_cut').reset(); //REINICIAMOS EL CORTE SELECCIONADO
        this.financial_cuts = event.financialCut; //RENDERIZAMOS LOS CORTES SELECCIONADOS
      });

    //NOS CAMBIAMOS A LOS CAMBIOS DEL CORTE SELECCIONADO
    this.event_information_controls
      .get('financial_cut')
      .valueChanges.subscribe((f_c) => {
        if (f_c?.prices) {
          this.payment_information
            .get('amount')
            .setValue(
              f_c.prices[
                this.payment_information_value.currency.toString().toLowerCase()
              ]
            );
        }
      });

    this.payment_information
      .get('currency')
      .valueChanges.subscribe((currency) => {
        if (this.event_information_value?.financial_cut?.id) {
          this.payment_information
            .get('amount')
            .setValue(
              this.event_information_value?.financial_cut?.prices[
                currency.toString().toLowerCase()
              ]
            );
        }
      });

    //NOS SUSCRIBIMOS AL CAMBIO DEL TIPO DE IGLESIA
    this.assistant_control
      .get('type_church')
      .valueChanges.subscribe((type_churh) => {
        if (type_churh == 'MCI' && this.assistant_value.country) {
          this.getChurchs();
        }
      });

    this.assistant_control.get('country').valueChanges.subscribe((country) => {
      //VALIDAMOS EL CAMBIO DE PAIS
      if (country.toString().toUpperCase() == 'COLOMBIA') {
        //PARA CASO COLOMBIA EXIGIMOS EL NUMERO DE IDENTIFICACON CON LOS VALORES A REQUERIR
        this.assistant_control
          .get('identification')
          .setValidators([
            Validators.required,
            Validators.pattern(/^[0-9a-zA-Z\s,-]+$/),
            Validators.minLength(6),
            Validators.maxLength(13),
          ]);
        //EXIGIMOS EL TIPO DE DOCUMENTO
        this.assistant_control
          .get('document_type')
          .setValidators([Validators.required]);
      } else {
        //ELIMINAMOS LOS ERRORES Y LOS VALIDADORES DE IDENTIFICACION Y TIPO DE DOCUMENTO
        this.assistant_control.get('identification').setValidators(null);
        this.assistant_control.get('identification').setErrors(null);
        this.assistant_control.get('document_type').setValidators(null);
        this.assistant_control.get('document_type').setErrors(null);
      }

      if (this.assistant_value.type_churh == 'MCI') {
        this.getChurchs();
      }
    });

    //NOS SUBSCRIBIMOS A LOS CAMBIOS DE LA RED PARA REINICIAR LOS VALORES DE LOS PASTORES
    this.assistant_control.get('network').valueChanges.subscribe((net) => {
      this.pastors = [];
      this.leaders = [];
      this.assistant_control.get('pastor').reset();
      this.assistant_control.get('leader').reset();
    });
  }

  /**CONSULTAS A LA BASE DE DATOS */

  getEvents() {
    //CONSULTAMOS LOS EVENTOS
    this.g12EventService.getEventsFilter().subscribe((res) => {
      this.events = res;
    });
  }

  //CONSULTAMOS LOS PASTORES QUE PERTENECEN A UNA RED SEGUN LA IGLESIA
  //NETWORK = RED ;USER = USUARIO ENCONTRADO
  getPastors(user_code, user?) {
    this.pastors = [];
    this.assistant_control.get('leader').disable();
    this.assistant_control.get('pastor').disable();
    this.userService
      .getLeadersOrPastors({
        userCode: user_code,
        church: user ? user.church_id : this.assistant_value?.church?.id,
      })
      .subscribe(
        (res) => {
          this.pastors = res;
          this.assistant_control.get('pastor').enable(); //INHABILITAMOS EL SELECTOR DEL PASTOR
          if (user) {
            this.assistant_control
              .get('pastor')
              .setValue(res.find((pt) => pt.user_code == user.pastor_code));
            this.assistant_control.get('pastor').disable();
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
        church: user ? user.church_id : this.assistant_value?.church?.id,
      })
      .subscribe(
        (res) => {
          this.leaders = res;
          this.assistant_control.get('leader').enable(); //HABILITAMOS EL SELECTOR DEL LIDER

          //VALIDAMOS LA RENDERIZACION DEL USUARIO
          if (user) {
            //SETEAMOS LOS VALORES DEL LIDER
            this.assistant_control
              .get('leader')
              .setValue(res.find((ld) => ld.user_code == user.leader_code));
          }
        },
        (err) => {
          throw err;
        }
      );
  }

  //CONSULTAMOS LAS IGLESIAS
  getChurchs() {
    console.log('this.assistant_value', this.assistant_value);
    this.userService
      .getPlaces({
        country: this.assistant_value.country.toUpperCase(),
        type:
          this.assistant_value.country.toUpperCase() == 'COLOMBIA'
            ? 'national'
            : 'international',
      })
      .subscribe((res) => {
        this.churchs = res;
      });
  }

  //CONSULTAMOS LAS IGLESIA POR ID
  getChurchById(id) {
    this.userService.getChurchById({ id }).subscribe(
      (res) => {
        let city = [];
        city.push(res);
        this.assistant_control
          .get('church')
          .setValue(city.find((ch) => ch.id == id));
        this.churchs = city;
      },
      (err) => {
        throw err;
      }
    );
  }

  //BUSCAMOS EL USUARIO
  searchUser(autocomplete?) {
    const filters = {};
    if (this.assistant_value.identification) {
      filters['identification'] = this.assistant_value.identification.trim();
    }

    if (
      this.confirm_email.value &&
      this.assistant_value.email == this.confirm_email.value
    ) {
      filters['email'] = this.assistant_value.email.trim().toLowerCase();
    }
    //AGREGAMOS LOS FILTROS DEL USUARIO
    this.userService.getUserInfo(filters).subscribe(
      (res) => {
        //PONEMOS EL TRUE DEL USUARIO
        this.find_user = true;
        //VALIDAMOS EL AUTOCOMPLETE DEL FORMULARIO
        if (autocomplete) {
          //AUTOCOMPLEMENTAMOS LOS DATOS DEL USUARIO ENCONTRADO
          this.setUser(res);
        } else {
          //SI NO SE REQUIERE AUTOCOMPLEMENTAR LOS DATOS MANDAMOS LA CREACION DEL USUARIO Y SETEAMOS EL ID
          this.assistant_control.get('id').setValue(res['id']);
          //CREAMOS EL USUARIO
          this.createUser();
        }
      },
      (err) => {
        if (autocomplete) {
          this.disable_ministerial_info = false;
          Swal.fire('No se encontro el usuario', '', 'info').then((res) => {
            this.assistant_control.get('network').enable();
            this.assistant_control.get('network').reset();
            this.assistant_control.get('pastor').reset();
            this.assistant_control.get('leader').reset();
          });
          throw err;
        }
      }
    );
  }

  //SOLICITUD DE CREACION DE USUARIO
  addUserSend() {
    //VALIDAMOS LOS CAMPOS DEL USUARIO
    if (
      this.assistant_control.invalid ||
      this.event_information_controls.invalid
    ) {
      Swal.fire('Datos incompletos', '', 'info');
      return;
    }
    //CONFIRMAMOS EL EMAIL
    if (this.assistant_control.value.email != this.confirm_email.value) {
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
      if (this.assistant_value.identification) {
        filters['identification'] = this.assistant_value.identification.trim();
      }

      if (
        this.confirm_email.value &&
        this.assistant_value.email == this.assistant_value.confirm_email
      ) {
        filters['email'] = this.assistant_value.email.trim().toLowerCase();
      }

      this.userService.getUserInfo(filters).subscribe(
        (res) => {
          this.assistant_control.get('id').setValue(res['id']);
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
    try {
      if (this.assistant_control.invalid) {
        throw new Error('Información incompleta');
      }

      // if (this.event_information_controls.invalid) {
      //   throw new Error('Información del evento incompleta ');
      // }
      //CREAMOS UNA VARIABLE CON EL PAYLOAD
      let payload = this.register_user.getRawValue();

      //VALIDAREMOS LA INFORMACION MINISTERIAL
      switch (payload.assistant.type_church) {
        case 'MCI':
          //CASO MCI VALIDAMOS PASTOR IGLESIA Y LIDER
          if (
            !payload.assistant.pastor?.id ||
            !payload.assistant.church?.id ||
            !payload.assistant.leader?.id
          ) {
            //GENERAMOS ERROR SI NO ENCONTRAMOS
            throw new Error('Revisa la información ministerial');
          }
          break;

        //CASOS G12 OT VALIDAMOS POR name_pastor name_church
        case 'G12':
        case 'OT': {
          if (
            !payload.assistant.name_pastor ||
            !payload.assistant.name_church
          ) {
            throw new Error('Revisa la información ministerial');
          } else {
            payload.assistant.pastor = {
              name: payload.assistant.name_pastor,
            };

            payload.assistant.church = {
              name: payload.assistant.name_church,
            };
          }
          break;
        }
        default: {
          throw new Error('Este caso no existe');
        }
      }

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
          if (!this.description_of_changue.value) {
            //CREAMOS UN ERROR DE REFERENCIA DE PAGO INCOMPLETA
            throw new Error('Referencia de pago incompleta');
          } else {
            payload.payment_information.description_of_change =
              this.description_of_changue.value;
          }
          break;
      }

      // MOSTRAMOS EL LOADER
      this.isLoading = true;
      this.boxService
        .registerOneUser({
          ...payload,
          box: this.box,
        })
        .subscribe(
          (res) => {
            //OCULTAMOS EL LOADER
            this.isLoading = false;
            //MOSTRAMOS EL MENSAJE DE SUCCESS
            Swal.fire('Usuario registrado', '', 'success');
            //CERRAMOS EL MODAL
            // this.modal.close();
            this._makePdfService.createPdf(res.ref, this.box);
            console.log('TRANSACTION', res);
          },
          (err) => {
            this.isLoading = false;
            Swal.fire(
              err ? err : 'No se pudo registrar el usuario',
              '',
              'error'
            );
          }
        );
    } catch (err) {
      Swal.fire(
        err.message ? err.message : 'No pudimos ejecutar la transacción',
        '',
        'info'
      );
    }
  }

  //****************************/
  //CONTROLES DEL FORMULARIO
  //****************************/

  setUser(user) {
    this.assistant_control.get('type_church').setValue(user.type_church);

    if (user?.type_church) {
      //INHABILITAMOS LA INFORMACION MINISTERIAL AL EDITAR
      this.disable_ministerial_info = true;
      switch (user?.type_church?.toString().toUpperCase()) {
        case 'MCI':
          //DISABLE INPUTS
          this.assistant_control.get('church').disable();
          this.assistant_control.get('network').disable();

          //SETEAMOS LOS VALORES DE LA RED
          this.assistant_control.get('network').setValue(user.network);

          //CONSULTAMOS LOS DATOS MINISTERIALES PARA POSTERIORMENTE AUTOCOMPLEMENTARLOS
          this.getPastors(user.pastor_code, user);
          this.getLeaders({ user_code: user.leader_code }, user);
          this.getChurchById(user.church_id);
          break;

        case 'OT':
        case 'G12': {
          this.assistant_control.get('name_pastor').setValue('name_pastor');
          this.assistant_control.get('name_church').setValue('name_church');
          break;
        }
      }
    } else {
      //HABILITAMOS LA INFORMACION MINISTERIAL PARA EDITARLA
      this.disable_ministerial_info = false;
    }
    //DISABLES

    //AUTOCOMPLETE DATA

    this.assistant_control
      .get('country')
      .setValue(user.country?.toString().toUpperCase());
    // this.assistant_control.get('country').disable();
    this.assistant_control.get('id').setValue(user.id);
    this.assistant_control.get('name').setValue(user.name.toLowerCase());
    this.assistant_control
      .get('last_name')
      .setValue(user.last_name.toLowerCase());
    this.assistant_control.get('email').setValue(user.email);
    this.confirm_email.setValue(user.email);
    this.assistant_control.get('gender').setValue(user.gender);
    this.assistant_control.get('phone').setValue(user.phone);
    this.assistant_control.get('identification').setValue(user.identification);
    this.assistant_control.get('document_type').setValue(user.document_type);
    this.cdr.detectChanges();
  }

  //VALIDAMOS LOS NUMEROS DE UN INPUT
  validateNumber(e) {
    if (!e.key.match(/[0-9]/i)) {
      e.preventDefault();
    }
  }

  resetMinisterialInfo(reset_type_church?: boolean) {
    //REINICIAMOS LA INFORMACION MINISTERIAL DE TIPO MCI
    if (reset_type_church) {
      this.assistant_control.get('type_church').reset();
    }
    this.assistant_control.get('network').reset();
    this.assistant_control.get('church').reset();
    this.assistant_control.get('pastor').reset();
    this.assistant_control.get('leader').reset();
    this.pastors = [];
    this.churchs = [];
    this.leaders = [];

    //REINICIAMOS LA INFORMACION DE IGLESIAS NO MCI
    this.assistant_control.get('name_pastor').reset();
    this.assistant_control.get('name_church').reset();
  }
  //CONTROLES DEL USUARIO
  get assistant_control() {
    return this.register_user.get('assistant');
  }

  //CONTROLES DEL EVENTO
  get event_information_controls() {
    return this.register_user.get('event_information');
  }

  get event_information_value() {
    return this.register_user.get('event_information').value;
  }

  // VALORES DEL FORMULARIO
  get assistant_value() {
    return this.assistant_control.value;
  }

  get payment_information() {
    return this.register_user.get('payment_information');
  }

  get payment_information_value() {
    return this.register_user.get('payment_information').value;
  }
}
