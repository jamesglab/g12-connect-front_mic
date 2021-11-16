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
  styleUrls: ['./add-user.component.scss']
})
export class AddUserMassiveComponent implements OnInit {
  public add_user: FormGroup;
  private currentUser = this.storageService.getItem('auth').user;
  public transaction: any;

  public leaders: [] = [];
  public pastors: [] = [];
  public churchs: [] = [];
  public countries: any[] = COUNTRIES;//LISTADO DE PAISES;

  public isLoading: boolean = false;
  constructor(private fb: FormBuilder, public modal: NgbActiveModal, private g12EventService: G12eventsService,
    public cdr: ChangeDetectorRef, private userService: UserService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getChurchs();
  }


  //*************************/
  // OPCIONES DEL FORMULARIO 
  //************************/

  // CREAMOS EL FORMULARIO
  buildForm() {
    this.add_user = this.fb.group({
      transaction_id: [this.transaction.transaction.id, Validators.required],
      country: [this.currentUser.church_id ? 'Colombia' : null, Validators.required],
      document: [null, Validators.required],
      document_type: [null],
      name: [null, Validators.required],
      last_name: [null, Validators.required],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      confirm_email: [null, Validators.compose([Validators.required, Validators.email])],
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
    this.userService.getLeadersOrPastors({ userCode: user_code, church: user ? user.church_id : this.currentUser.church_id }).subscribe(res => {
      this.pastors = res;
      this.leaders = []; //REINICAMOS LOS LIDERES
      this.form_controls.pastor.enable();//INHABILITAMOS EL SELECTOR DEL PASTOR
      if (user) {
        console.log(res.find(pt => pt.user_code == user.pastor_code))
        this.form_controls.pastor.setValue(res.find(pt => pt.user_code == user.pastor_code));
      }
    });
  }

  // CONSULTAMOS LOS LIDERES QUE PERTENECEN A LA RED DEL PASTOR
  getLeaders(pastor, user?) {
    this.leaders = [];
    this.userService.getLeadersOrPastors({ userCode: pastor.user_code, church: user ? user.church_id : this.currentUser.church_id }).subscribe(res => {
      this.leaders = res;
      this.add_user.get('leader').enable();//INHABILITAMOS EL SELECTOR DEL LIDER
      if (user) {
        this.form_controls.leader.setValue(res.find(ld => ld.user_code == user.leader_code));
      }
    });
  }

  getChurchs() {
    this.userService.getPlaces({ type: 'national', country: 'Colombia' }).subscribe(res => {
      this.add_user.get('church').setValue(res.find(ch => ch.id == this.currentUser.church_id));
      this.churchs = res;
    })
  }



  searchUser() {
    const filters = {};
    
    if (this.form_value.document) {
      filters['identification'] = this.form_value.document;
    }

    if (this.add_user.value.confirm_email && this.form_value.email == this.form_value.confirm_email) {
      filters['email'] = this.form_value.email.toLowerCase();
    }

    this.userService.getUserInfo(filters).subscribe(res => {
      this.setUser(res);
    },err=>{
      Swal.fire('No se encontro el usuario','','info');
    })
  }



  //SOLICITUD DE CREACION DE USUARIO
  addUserSend() {
    //VALIDAMOS LOS CAMPOS DEL USUARIO
    if (this.add_user.invalid) {
      Swal.fire('Datos incompletos', '', 'info');
      return
    }
    //CONFIRMAMOS EL EMAIL
    if (this.add_user.value.email != this.add_user.value.confirm_email) {
      Swal.fire('Los correos no coinciden', '', 'info')
      return
    }
    //MOSTRAMOS EL LOADER
    this.isLoading = true;
    //EJECUTAMOS EL ENDPOINT CON LOS DATOS DEL USUARIO
    this.g12EventService.addUser(this.add_user.getRawValue()).subscribe(res => {
      Swal.fire('Usuario Agregado', '', 'success').then(res => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.modal.close(res);
      })
    }, err => {
      this.isLoading = false;
      this.cdr.detectChanges();
      Swal.fire(err ? err : 'No se pudo ejecutar la acción', '', 'error')
    });
  }


  //****************************/
  //CONTROLES DEL FORMULARIO
  //****************************/


  setUser(user) {
    this.form_controls.country.setValue(user.country);
    this.form_controls.name.setValue(user.name);
    this.form_controls.last_name.setValue(user.last_name);
    this.form_controls.email.setValue(user.email);
    this.form_controls.confirm_email.setValue(user.email);
    this.form_controls.gender.setValue(user.gender);
    this.form_controls.phone.setValue(user.phone);
    this.form_controls.network.setValue(user.network);
    this.form_controls.document_type.setValue(user.document_type);
    this.getPastors(user.pastor_code, user);
    this.getLeaders({ user_code: user.leader_code }, user);

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
