import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/modules/auth/_services/storage.service';
import { UserService } from 'src/app/modules/_services/user.service';
import { UpdatePasswordComponent } from 'src/app/pages/profile/components/update-password/update-password.component';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user-ministry',
  templateUrl: './edit-user-ministry.component.html',
  styleUrls: ['./edit-user-ministry.component.scss']
})
export class EditUserMinistryComponent implements OnInit {
  public user;
  public isLoading = false;
  private unsubscribe: Subscription[] = [];
  public editUserForm: FormGroup;
  public document_types = ['CC', 'TI', 'CE'];
  public churchTypes = [
    {
      idDetailMaster: 88,
      idCountry: 240,
      idMaster: 14,
      code: 'MCI',
      description: 'Iglesia MCI',
      disposable: true,
    },
    {
      idDetailMaster: 89,
      idCountry: 240,
      idMaster: 14,
      code: 'G12',
      description: 'Iglesia G12',
      disposable: true,
    },
    {
      idDetailMaster: 90,
      idCountry: 240,
      idMaster: 14,
      code: 'OT',
      description: 'Otra Iglesia',
      disposable: true,
    },
  ];
  public minDate = new Date(1950, 0, 1);
  public maxDate = new Date(new Date().getFullYear() - 5, 0, 1);
  public leaders: any[];
  public pastors: any[];
  public places: any[];
  public countries: any[] = COUNTRIES;
  constructor(
    private _storageService: StorageService,
    private userService: UserService,
    public modal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log('hey ther', this.user)
    // this.getProfileUser();
    this.buildForm(this.user);
  }

  // CONSULTAMOS LA INFORMACION DEL USUARIO
  getProfileUser() {
    // this.userService.getProfile().subscribe((res) => {
    //   this.user = res;
    //   this.buildForm(res);
    // });
  }

  // RENDERIZMOS LA INFORMACION DEL USUARIO
  buildForm(user) {

    this.editUserForm = this.fb.group({
      // RENDERIZAMOS LA INFORMACION PERSONAL PARA ACCEDER POR EL FORMGROUPNAME EN EL FORMULARIO REACTIVO

      user: this.fb.group({
        id: [user.id],
        document_type: [user.document_type],
        identification: [user.identification],
        name: [user.name],
        last_name: [user.last_name],
        gender: [user.gender],
        phone: [user.phone],
        birth_date: [new Date(user.birth_date)],
      }),
      contact_information: this.fb.group({
        address: [user.address],
        phone: [user.phone],
        email: [{ value: user.email, disabled: true }],
      }),
      ministerialInfo: this.fb.group({
        country: [user.country.toLowerCase()], //RENDERIZAMOS EL PAIS QUE SELECCIONO
        network: [user.network], //RENDERIZAMOS LA INFORMACION DE LA RED A LA QUE PERTENECE
        leader: [],
        headquarter: [],
        pastor: [],
        type_church: [
          this.churchTypes.find(
            (tCh) =>
              tCh.code.toUpperCase() == this?.user?.type_church?.toUpperCase()
          )?.idDetailMaster,
        ], //VALIDAMOS EL TIPO DE IGLESIA PARA RENDERIZAS LA INFORMACION MINISTERIAL
        name_pastor: [
          this?.user?.type_church?.toUpperCase() != 'MCI'
            ? user?.name_pastor
            : null,
        ],
        name_church: [
          this?.user?.type_church?.toUpperCase() != 'MCI'
            ? user?.name_church
            : null,
        ],
      }),
    });



    // SI LA IGLESIA DEL USUARIO ES DE TIPO MCI RENDERIZAMOS LAS IGLESIAS MINISTERIALES PERTENECIENTES A MCI
    if (this?.user?.type_church?.toUpperCase() == 'MCI') {
      this.getPlaces(true);
    } else {
      this.cdr.detectChanges();
    }
  }

  // BUSCAMOS LAS IGLESIAS MCI NACIONALES O INTERNACIONES
  getPlaces(setvalue?) {
    // VALIDAMOS SI EXISTE PAIS EN EL USUARIO
    // SI EL PAIS NO ES NACIONAL PASAMOS EL VALOR DEL FILTRO A INTERNACIONES
    const { country } = this.editUserForm.getRawValue().ministerialInfo;
    var filter =
      country.toLowerCase() != 'colombia' ? 'international' : 'national';
    this.leaders = [];
    this.pastors = [];

    const getPlacesSubscr = this.userService
      .getPlaces({ type: filter })
      .subscribe(
        (res) => {
          this.places = res || [];
          // SI LA CONSULTA ES INICIAL BUSCAMOS LA IGLESIA POR EL CHURCH_ID DEL USUARIO Y LO RENDERIZAMOS EN EL FORMULARIO
          if (setvalue) {
            this.editUserForm
              .get('ministerialInfo')
              .get('headquarter')
              .setValue(res.find((ch) => ch.id == this.user.church_id));
            // BUSCAMOS LOS PASTORES Y PASAMOS VALOR EN TRUE PARA RENDERIZAR POR PRIMERA VEZ QUE SE RENDERIZEN LOS VALORES DEL PASTOR DEL USAURIO
            this.getPastors(true);
          }
          this.cdr.detectChanges();
        },
        (err) => {
          throw err;
        }
      );
    this.unsubscribe.push(getPlacesSubscr);
  }

  // BUSCAMOS LOS PASTORES DEPENDIENDO DE LA IGLESIA Y LA RED QUE SELECCIONO EL USUARIO
  getPastors(valid?) {
    // AL CAMBIAR DE SEDE NECESITAMOS BORRAR LOS DATOS DE LOS PASTORES DE LAS OTRAS IGLESIAS
    this.pastors = [];
    this.leaders = [];
    if (this.ministerialInfo.network && this.ministerialInfo.headquarter) {
      const getCivilSubscr = this.userService
        .getLeadersOrPastors({
          userCode: this.ministerialInfo.network,
          church: this.ministerialInfo.headquarter.id,
        })
        .subscribe(async (res: any) => {
          this.pastors = res || [];
          if (valid) {
            this.editUserForm
              .get('ministerialInfo')
              .get('pastor')
              .setValue(
                res.find((pastor) => pastor.id == parseInt(this.user.pastor.id))
              );
            this.getLeaders(
              res.find((pastor) => pastor.id == parseInt(this.user.pastor.id)),
              true
            );
          }
          this.cdr.detectChanges();
        });
      this.unsubscribe.push(getCivilSubscr);
    }
  }

  // DEVOLVEMOS LOS VALORES MINISTERIALES DEL FORMULARIO
  get ministerialInfo() {
    return this.editUserForm.value.ministerialInfo;
  }

  // BUSCAMOS LOS LIDERES PERTENECIENTES A UN PASTOR
  getLeaders(pastor, valid?) {
    this.leaders = [];
    const getLeadersSubscr = this.userService
      .getLeadersOrPastors({
        userCode: pastor.user_code,
        church: this.ministerialInfo.headquarter.id,
      })
      .subscribe(async (res: any) => {
        this.leaders = res || [];
        // VALIDAMOS LA RENDERIZACION DEL LIDER QUE PREVIAMENTE TENIA EL USUARIO
        if (valid) {
          this.editUserForm
            .get('ministerialInfo')
            .get('leader')
            .setValue(res.find((leader) => leader.id == this.user.leader_id));
        }
        this.cdr.detectChanges();
      });
    this.unsubscribe.push(getLeadersSubscr);
  }

  // CREAMOS EL OBJETO DE LA INFORMACION MINISTERIAL QUE EL USUARIO VA A ACTUALIZAR
  getMinisterialInfo() {
    const { type_church, leader, headquarter, name_pastor, name_church } =
      this.ministerialInfo;
    if (type_church == 88) {

      if (leader && headquarter && this.pastors.length != 0 && this.leaders.length != 0) {
        return {
          leader_id: leader.id,
          type_church: this.churchTypes.find(
            (ch) => ch.idDetailMaster == type_church
          ).code, //CREAMOS LA INFORMACION MINISTERIAL ,
          church_id: headquarter.id,
          name_pastor: null,
          name_church: null,
        };
      }

    } else {
      if (name_pastor && name_church) {
        return {
          type_church: this.churchTypes.find(
            (ch) => ch.idDetailMaster == type_church
          ).code, //CREAMOS LA INFORMACION MINISTERIAL
          leader_id: null,
          church_id: null,
          name_pastor: name_pastor,
          name_church: name_church,
        };
      }

    }
  }

  updateUser() {
    this.isLoading = true;
    if (this.getMinisterialInfo()) {
      this.userService
        .updateUserByPastor(
          {
            ...this.editUserForm.getRawValue().user,
            ...this.editUserForm.getRawValue().contact_information,
            ...this.getMinisterialInfo(),
          }
        )
        .subscribe((res) => {
          if (res) {
            Swal.fire('Datos Actualizados', 'usuario actualizado', 'success');
            this.modal.close(res)
          }
          this.isLoading = false;
          this.cdr.detectChanges()

        }, err => {
          this.isLoading = false;
          Swal.fire('No se actulizo ', 'Por favor inteta de nuevo mas tarde ', 'error');
          this.cdr.detectChanges()
        });
    } else {
      this.isLoading = false;
      Swal.fire('Datos incompletos', 'revisa la informacion ministerial', 'warning')
    }

  }
}
