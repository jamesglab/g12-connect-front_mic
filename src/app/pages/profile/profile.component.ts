import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../modules/_services/user.service';
import { StorageService } from '../../modules/auth/_services/storage.service';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { StudyLevel } from 'src/app/_helpers/objects/study.level';
import { Professions } from 'src/app/_helpers/objects/profession';
import { EditProfileMock } from './mocks/Edit.Profile.Mock';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user;
  public isLoading = false;
  private unsubscribe: Subscription[] = [];
  public editUserForm: FormGroup = null;
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
  public studyLevel: any[] = StudyLevel;
  public professions: any[] = Professions;

  constructor(
    private _storageService: StorageService,
    private userService: UserService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getProfileUser();
  }

  // CONSULTAMOS LA INFORMACION DEL USUARIO
  getProfileUser() {
    this.userService.getProfile().subscribe((res) => {
      this.user = res;
      this.buildForm(res);
    });
  }

  // RENDERIZMOS LA INFORMACION DEL USUARIO
  buildForm(user) {
    let studyFilter = this.studyLevel.filter(
      (x) => x.value === user?.studies_level
    );
    this.editUserForm = this.fb.group({
      // RENDERIZAMOS LA INFORMACION PERSONAL PARA ACCEDER POR EL FORMGROUPNAME EN EL FORMULARIO REACTIVO
      user: this.fb.group({
        document_type: [user.document_type],
        identification: [user.identification],
        name: [user.name],
        last_name: [user.last_name],
        gender: [user.gender],
        phone: [user.phone],
        birth_date: [new Date(user.birth_date)],
        studies_level: [studyFilter.length > 0 ? studyFilter[0] : null],
        profession: [user?.profession],
        current_occupation: [user?.current_occupation],
        other_study: [user?.other_study],
      }),
      contact_information: this.fb.group({
        address: [user.address],
        phone: [user.phone],
        email: [{ value: user.email, disabled: true }],
      }),
      // ministerialInfo: this.fb.group({
      //   country: [user.country.toLowerCase()], //RENDERIZAMOS EL PAIS QUE SELECCIONO
      //   network: [user.network], //RENDERIZAMOS LA INFORMACION DE LA RED A LA QUE PERTENECE
      //   leader: [],
      //   headquarter: [],
      //   pastor: [],
      //   type_church: [
      //     this.churchTypes.find(
      //       (tCh) =>
      //         tCh.code.toUpperCase() == this?.user?.type_church?.toUpperCase()
      //     )?.idDetailMaster,
      //   ], //VALIDAMOS EL TIPO DE IGLESIA PARA RENDERIZAS LA INFORMACION MINISTERIAL
      //   name_pastor: [
      //     this?.user?.type_church?.toUpperCase() != 'MCI'
      //       ? user?.name_pastor
      //       : null,
      //   ],
      //   name_church: [
      //     this?.user?.type_church?.toUpperCase() != 'MCI'
      //       ? user?.name_church
      //       : null,
      //   ],
      // }),
    });
    this.cdr.detectChanges();

    // SI LA IGLESIA DEL USUARIO ES DE TIPO MCI RENDERIZAMOS LAS IGLESIAS MINISTERIALES PERTENECIENTES A MCI
    // if (this?.user?.type_church?.toUpperCase() == 'MCI') {
    //   this.getPlaces(true);
    // } else {
    // }
  }

  // ABRIMOS EL MODAL PARA ACTUALIZAR LA CONTRASE??A DEL USUARIO
  onChangePassword() {
    const MODAL = this.modalService.open(UpdatePasswordComponent, {
      windowClass: 'fadeIn',
      size: 'sm',
      backdrop: true,
      keyboard: true,
      centered: true,
    });
    MODAL.componentInstance.currentUser = this.user;
    MODAL.result.then(
      (data) => {
        if (data == 'success') {
          // this.getGoData();
        }
      },
      (reason) => {
        console.log('Reason', reason);
      }
    );
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
    const {
      type_church,
      leader,
      headquarter,
      name_pastor,
      name_church,
    } = this.ministerialInfo;
    if (type_church == 88) {
      if (
        leader &&
        headquarter &&
        this.pastors.length != 0 &&
        this.leaders.length != 0
      ) {
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
    if (this.editUserForm.invalid) {
      Swal.fire(
        'Datos incompletos',
        'revisa la informacion ministerial',
        'warning'
      );
    }
    this.isLoading = true;
    // if (this.getMinisterialInfo()) {
    this.userService
      .updateProfile(
        EditProfileMock(
          this.editUserForm.getRawValue().user,
          this.editUserForm.getRawValue().contact_information
        )
      )
      .subscribe(
        (res) => {
          if (res) {
            Swal.fire('Datos Actualizados', 'usuario actualizado', 'success');
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        (err) => {
          this.isLoading = false;
          Swal.fire(
            'No se actulizo ',
            'Por favor inteta de nuevo mas tarde ',
            'error'
          );
          this.cdr.detectChanges();
        }
      );
    // } else {

    // }
  }
}
