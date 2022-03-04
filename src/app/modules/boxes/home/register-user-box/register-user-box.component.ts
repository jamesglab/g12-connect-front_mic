import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { G12eventsService } from 'src/app/modules/g12events/_services/g12events.service';
import { COUNTRIES } from 'src/app/_helpers/fake/fake-db/countries';
import { UserService } from 'src/app/modules/_services/user.service';
import { MustMatch } from 'src/app/_helpers/tools/must-match.validators';
import Swal from 'sweetalert2';
import { BoxService } from '../_services/Boxes.service';
import { insertUsers } from 'src/app/_helpers/tools/parsedata/parse-data-towin.tool';
import { MakePdfService } from '../_services/make-pdf.service';

@Component({
  selector: 'app-register-user-box',
  templateUrl: './register-user-box.component.html',
  styleUrls: ['./register-user-box.component.scss'],
})
export class RegisterUserBoxComponent implements OnInit {
  public formRegisterUser: FormGroup;

  public events: any = [];
  public countries: any[] = COUNTRIES;

  public totalPrices: any = {
    total_price_cop: 0,
    total_price_usd: 0,
    prices_translator_cop: 0,
    prices_translator_usd: 0,
    prices_event_cop: 0,
    prices_event_usd: 0,
  };
  public box: any = {};

  public isLoading: boolean = false;

  public filteredCountries: Observable<string[]>;
  public filteredCountriesUser: Observable<string[]>;
  public filteredChurchs: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public cdr: ChangeDetectorRef,
    private g12EventService: G12eventsService,
    private userService: UserService,
    private boxService: BoxService,
    private _makePdfService: MakePdfService
  ) {}

  ngOnInit(): void {
    this.getEvents().then(() => {
      this.buildForm();
    });
  }

  buildForm() {
    this.formRegisterUser = this.fb.group({
      payment_information: this.fb.group({
        name: [null, [Validators.required]],
        last_name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        document: [null, [Validators.required]],
        document_type: ['CC', [Validators.required]],
        country: [{ id: 82, name: 'COLOMBIA' }, [Validators.required]],
        currency: ['COP', [Validators.required]],
        payment_type: ['BOX', [Validators.required]],
        platform: ['G12CONNECT', [Validators.required]],
        is_dataphone: [null, [Validators.required]],
        amount: [0],
        description_of_change: [null],
      }),
      users: this.fb.array([]),
    });
    this.filteredCountriesUser = this.formRegisterUser.controls.payment_information[
      'controls'
    ].country.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'countries'))
    );
    this.formRegisterUser.controls.payment_information[
      'controls'
    ].country.valueChanges.subscribe((res: any) => {
      if (res.name === 'COLOMBIA') {
        this.formRegisterUser.controls.payment_information[
          'controls'
        ].document.setErrors(null);
        this.formRegisterUser.controls.payment_information[
          'controls'
        ].document.setValidators(Validators.required);
        this.formRegisterUser.controls.payment_information[
          'controls'
        ].description_of_change.setErrors(null);
        this.formRegisterUser.controls.payment_information[
          'controls'
        ].description_of_change.setValidators(null);
      } else {
        this.formRegisterUser.controls.payment_information[
          'controls'
        ].document.setErrors(null);
        this.formRegisterUser.controls.payment_information[
          'controls'
        ].document.setValidators(null);
        this.formRegisterUser.controls.payment_information[
          'controls'
        ].description_of_change.setValidators(Validators.required);
      }
    });
    this.users().push(this.newUser());
  }

  getEvents(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.g12EventService.getEventsFilter().subscribe(
        (res: any) => {
          this.events = res;
          this.cdr.detectChanges();
          resolve(this.events);
        },
        (err) => {
          reject(err);
          throw err;
        }
      );
    });
  }

  getChurchs(country: string): Promise<any> {
    if (country) {
      return new Promise((resolve, reject) => {
        this.userService
          .getPlaces({
            country: country.toUpperCase(),
            type:
              country.toUpperCase() == 'COLOMBIA'
                ? 'national'
                : 'international',
          })
          .subscribe(
            (res: any) => {
              resolve(res);
            },
            (err) => {
              reject(err);
              throw err;
            }
          );
      });
    }
  }

  getChurchById(id: string, position: number): void {
    this.userService.getChurchById({ id }).subscribe(
      (church: any) => {
        this.formRegisterUser.controls.users['controls'][
          position
        ].controls.assistant['controls'].church.setValue(church);
      },
      (err) => {
        throw err;
      }
    );
  }

  getLeaders(position: number, pastor: any, user?: any): void {
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].leader.reset();
    this.userService
      .getLeadersOrPastors({
        userCode: pastor.user_code,
        church: this.users().controls[position]['controls'].assistant[
          'controls'
        ].church.value.id,
      })
      .subscribe(
        (res: any) => {
          this.users().controls[position]['controls'].assistant[
            'controls'
          ].all_leaders.setValue(res);
          if (
            this.formRegisterUser.controls.users['controls'][position].controls
              .assistant['controls'].all_leaders.value
          ) {
            let searchLeader = this.formRegisterUser.controls.users['controls'][
              position
            ].controls.assistant['controls'].all_leaders.value.filter(
              (x) => x.id === user.leader_id
            );
            if (searchLeader && searchLeader.length > 0) {
              this.formRegisterUser.controls.users['controls'][
                position
              ].controls.assistant['controls'].leader.setValue(searchLeader[0]);
            }
          }
        },
        (err) => {
          throw err;
        }
      );
  }

  getPastors(user_code: any, position: number, user?: any) {
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].all_pastors.reset();
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].pastor.reset();

    if (
      this.users().controls[position]['controls'].assistant['controls'].church
        .value
    ) {
      this.userService
        .getLeadersOrPastors({
          userCode: user_code,
          church: this.users().controls[position]['controls'].assistant[
            'controls'
          ].church.value.id,
        })
        .subscribe(
          (res: any) => {
            this.users().controls[position]['controls'].assistant[
              'controls'
            ].all_pastors.setValue(res);
            if (
              this.formRegisterUser.controls.users['controls'][position]
                .controls.assistant['controls'].all_pastors.value
            ) {
              let searchPastor = this.formRegisterUser.controls.users[
                'controls'
              ][position].controls.assistant[
                'controls'
              ].all_pastors.value.filter(
                (x) => x.user_code === user.pastor_code
              );
              if (searchPastor && searchPastor.length > 0) {
                this.formRegisterUser.controls.users['controls'][
                  position
                ].controls.assistant['controls'].pastor.setValue(
                  searchPastor[0]
                );
              }
            }
          },
          (err) => {
            throw err;
          }
        );
    }
  }

  addField(): void {
    this.users().push(this.newUser());
  }

  users(): FormArray {
    return this.formRegisterUser.get('users') as FormArray;
  }

  removeField(i: number) {
    this.users().removeAt(i);
  }

  newUser(): FormGroup {
    let user = this.fb.group({
      event_information: this.fb.group({
        all_event: [],
        all_financial_cut: [],
        event: [null, Validators.required],
        financial_cut: [null, Validators.required],
        active_translator: [false],
      }),
      assistant: this.fb.group(
        {
          id: [null],
          country: [{ id: 82, name: 'COLOMBIA' }, [Validators.required]],
          identification: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(/^[0-9a-zA-Z\s,-]+$/),
              Validators.minLength(6),
              Validators.maxLength(13),
            ]),
          ],
          language: ['es', [Validators.required]],
          document_type: ['CC', [Validators.required]],
          name: [null, [Validators.required]],
          last_name: [null, [Validators.required]],
          gender: [null, [Validators.required]],
          phone: [null, [Validators.required]],
          email: [
            null,
            [Validators.compose([Validators.required, Validators.email])],
          ],
          email_confirmation: [null, [Validators.required, Validators.email]],
          type_church: [null, Validators.required],
          network: [null, [Validators.required]],
          all_leaders: [[]],
          leader: [null, [Validators.required]],
          all_pastors: [[]],
          pastor: [{ value: null }, [Validators.required]],
          all_churchs: [[]],
          church: [{ value: null }, [Validators.required]],
          name_pastor: [null],
          name_church: [null],
        },
        {
          validator: MustMatch('email', 'email_confirmation'),
        }
      ),
    });
    this.subscribeToValidators(user);
    this.cdr.detectChanges();
    return user;
  }

  static matches(form: AbstractControl) {
    return form.get('email').value == form.get('emailConfirm').value
      ? null
      : { equals: true };
  }

  subscribeToValidators(user: any) {
    user.controls.event_information['controls'].event.valueChanges.subscribe(
      (event: any) => {
        // Cuando el usuario elija un evento
        user.controls.event_information['controls'].all_financial_cut.setValue(
          event.financialCut
        ); // En el select de corte se van a pushear los ítems del ítem seleccionado en la posicion financialCUt
      }
    );

    user.controls.assistant['controls'].email.valueChanges.subscribe(
      (name: any) => {
        if (!name || name == null || name == '') {
          user.controls.assistant['controls'].id.setValue(null);
        }
      }
    );

    user.controls.assistant[
      'controls'
    ].email_confirmation.valueChanges.subscribe((name: any) => {
      if (!name || name == null || name == '') {
        user.controls.assistant['controls'].id.setValue(null);
      }
    });

    user.controls.assistant['controls'].type_church.valueChanges.subscribe(
      (res: any) => {
        if (res === 'MCI') {
          this.getChurchs(
            user.controls.assistant['controls'].country.value?.name
          ).then((res: any) => {
            user.controls.assistant['controls'].all_churchs.setValue(res);
          });
        } else {
          user.controls.assistant['controls'].network.setErrors(null);
          user.controls.assistant['controls'].network.setValidators(null);
          user.controls.assistant['controls'].church.setErrors(null);
          user.controls.assistant['controls'].church.setValidators(null);
          user.controls.assistant['controls'].pastor.setErrors(null);
          user.controls.assistant['controls'].pastor.setValidators(null);
          user.controls.assistant['controls'].leader.setErrors(null);
          user.controls.assistant['controls'].leader.setValidators(null);
        }
      }
    );

    user.controls.assistant['controls'].church.valueChanges.subscribe(
      (church: any) => {
        if (
          church &&
          user.controls.assistant['controls'].type_church.value &&
          user.controls.assistant['controls'].network.value
        ) {
          this.userService
            .getLeadersOrPastors({
              userCode: user.controls.assistant['controls'].network.value,
              church: church ? church.id : null,
            })
            .subscribe(
              (res: any) => {
                user.controls.assistant['controls'].all_pastors.setValue(res);
              },
              (err) => {
                throw err;
              }
            );
        }
      }
    );

    user.controls.event_information[
      'controls'
    ].active_translator.valueChanges.subscribe((res: boolean) => {
      this.cutClick();
    });

    user.controls.event_information['controls'].event.valueChanges.subscribe(
      (res: any) => {
        if (!res) {
          this.totalPrices.total_price_cop = 0;
          user.controls.event_information['controls'].financial_cut.setValue(
            null
          );
          this.cutClick();
        }
      }
    );

    this.filteredCountries = user.controls.assistant[
      'controls'
    ].country.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'countries'))
    );
    this.filteredChurchs = user.controls.assistant[
      'controls'
    ].church.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value, 'all_churchs'))
    );
  }

  cutClick(): void {
    let total_cop: number = 0;
    let total_usd: number = 0;

    let total_prices_translator_cop: number = 0;
    let total_prices_translator_usd: number = 0;

    let total_prices_event_cop: number = 0;
    let total_prices_event_usd: number = 0;

    for (
      let index = 0;
      index < this.formRegisterUser.controls.users['controls'].length;
      index++
    ) {
      if (
        this.formRegisterUser.controls.users['controls'][index].controls
          .event_information['controls'].event?.value.is_translator
      ) {
        if (
          this.formRegisterUser.controls.users['controls'][index].controls
            .event_information['controls'].financial_cut.value?.prices
        ) {
          if (
            this.formRegisterUser.controls.users['controls'][index].controls
              .event_information.controls.active_translator.value
          ) {
            total_cop +=
              this.formRegisterUser.controls.users['controls'][index].controls
                .event_information['controls'].financial_cut.value.prices.cop +
              parseInt(
                this.formRegisterUser.controls.users['controls'][index].controls
                  .event_information.value.event.translators.cop
              );
            total_usd +=
              this.formRegisterUser.controls.users['controls'][index].controls
                .event_information['controls'].financial_cut.value.prices.usd +
              parseInt(
                this.formRegisterUser.controls.users['controls'][index].controls
                  .event_information.value.event.translators.usd
              );
            total_prices_translator_cop += parseInt(
              this.formRegisterUser.controls.users['controls'][index].controls
                .event_information.value.event.translators.cop
            );
            total_prices_translator_usd += parseInt(
              this.formRegisterUser.controls.users['controls'][index].controls
                .event_information.value.event.translators.usd
            );
          } else {
            total_cop += this.formRegisterUser.controls.users['controls'][index]
              .controls.event_information['controls'].financial_cut.value.prices
              .cop;
            total_usd += this.formRegisterUser.controls.users['controls'][index]
              .controls.event_information['controls'].financial_cut.value.prices
              .usd;
          }
        }
      } else {
        if (
          this.formRegisterUser.controls.users['controls'][index].controls
            .event_information['controls'].financial_cut.value?.prices
        ) {
          total_cop += this.formRegisterUser.controls.users['controls'][index]
            .controls.event_information['controls'].financial_cut.value.prices
            .cop;
          total_usd += this.formRegisterUser.controls.users['controls'][index]
            .controls.event_information['controls'].financial_cut.value.prices
            .usd;
        }
      }

      total_prices_event_cop += this.formRegisterUser.controls.users[
        'controls'
      ][index].controls.event_information['controls'].financial_cut.value.prices
        .cop;
      total_prices_event_usd += this.formRegisterUser.controls.users[
        'controls'
      ][index].controls.event_information['controls'].financial_cut.value.prices
        .usd;
    }

    this.totalPrices.total_price_cop = total_cop;
    this.totalPrices.total_price_usd = total_usd;

    this.totalPrices.prices_translator_cop = total_prices_translator_cop;
    this.totalPrices.prices_translator_usd = total_prices_translator_usd;

    this.totalPrices.prices_event_cop = total_prices_event_cop;
    this.totalPrices.prices_event_usd = total_prices_event_usd;
  }

  resetMinisterialInfo(position: number): void {
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].all_churchs.reset();
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].all_pastors.reset();
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].network.reset();
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].church.reset();
    this.users().controls[position]['controls'].assistant[
      'controls'
    ].leader.reset();
  }

  searchUser(position?: number): void {
    const filters: any = {};

    if (position != null) {
      if (
        this.formRegisterUser.controls.users['controls'][position].controls
          .assistant['controls'].identification.value
      ) {
        filters['identification'] = this.formRegisterUser.controls.users[
          'controls'
        ][position].controls.assistant['controls'].identification.value;
      }

      if (
        this.formRegisterUser.controls.users['controls'][position].controls
          .assistant['controls'].email.value &&
        this.formRegisterUser.controls.users['controls'][position].controls
          .assistant['controls'].email.value ==
          this.formRegisterUser.controls.users['controls'][position].controls
            .assistant['controls'].email_confirmation.value
      ) {
        filters['email'] = this.formRegisterUser.controls.users['controls'][
          position
        ].controls.assistant['controls'].email.value;
      }

      if (
        this.formRegisterUser.controls.users['controls'][position].controls
          .assistant['controls'].country.value
      ) {
        filters['country'] = this.formRegisterUser.controls.users['controls'][
          position
        ].controls.assistant['controls'].country.value?.name;
      }

      if (
        this.formRegisterUser.controls.users['controls'][position].controls
          .assistant['controls'].document_type.value
      ) {
        filters['document_type'] = this.formRegisterUser.controls.users[
          'controls'
        ][position].controls.assistant['controls'].document_type.value;
      }
    } else {
      if (
        this.formRegisterUser.controls.payment_information['controls']
          .document_type.value &&
        this.formRegisterUser.controls.payment_information['controls']
          .document_type.value
      ) {
        if (
          this.formRegisterUser.controls.payment_information['controls']
            .document.value
        ) {
          filters[
            'identification'
          ] = this.formRegisterUser.controls.payment_information[
            'controls'
          ].document.value;
        }

        if (
          this.formRegisterUser.controls.payment_information['controls'].email
            .value
        ) {
          filters['email'] = this.formRegisterUser.controls.payment_information[
            'controls'
          ].email.value;
        }

        if (
          this.formRegisterUser.controls.payment_information['controls'].country
            .value
        ) {
          filters[
            'country'
          ] = this.formRegisterUser.controls.payment_information[
            'controls'
          ].country.value.name;
        }

        if (
          this.formRegisterUser.controls.payment_information['controls']
            .document_type.value
        ) {
          filters[
            'document_type'
          ] = this.formRegisterUser.controls.payment_information[
            'controls'
          ].document_type.value;
        }
      }
    }
    if (filters) {
      this.userService.getUserInfo(filters).subscribe(
        (user: any) => {
          if (position != null) {
            this.setUserData(user, position);
          } else {
            this.formRegisterUser.controls.payment_information[
              'controls'
            ].name.setValue(user.name);
            this.formRegisterUser.controls.payment_information[
              'controls'
            ].last_name.setValue(user.last_name);
            this.formRegisterUser.controls.payment_information[
              'controls'
            ].email.setValue(user.email);
            this.formRegisterUser.controls.payment_information[
              'controls'
            ].document.setValue(user.identification);
            this.formRegisterUser.controls.payment_information[
              'controls'
            ].document_type.setValue(user.document_type);
            let searchCountry = this.countries.filter(
              (x) => x.name === user.country
            );
            if (searchCountry && searchCountry.length > 0) {
              this.formRegisterUser.controls.payment_information[
                'controls'
              ].country.setValue(searchCountry[0]);
            }
          }
        },
        (err) => {
          Swal.fire(
            '',
            err
              ? err
              : 'Ocurrió un error, intenta buscando con otros parámetros.',
            'warning'
          );
          throw err;
        }
      );
    }
  }

  setUserData(user: any, position: number): void {
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].church.setValue({ id: user.church_id });
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].type_church.setValue(user.type_church);

    switch (user?.type_church?.toString().toUpperCase()) {
      case 'MCI':
        this.formRegisterUser.controls.users['controls'][
          position
        ].controls.assistant['controls'].network.setValue(user.network);
        this.getPastors(user.pastor_code, position, user);
        this.getLeaders(position, { user_code: user.leader_code }, user);
        this.getChurchById(user.church_id, position);
        break;

      case 'OT':
      case 'G12': {
        this.formRegisterUser.controls.users['controls'][
          position
        ].controls.assistant['controls'].name_church.setValue(user.name_church);
        this.formRegisterUser.controls.users['controls'][
          position
        ].controls.assistant['controls'].name_pastor.setValue(user.name_pastor);
        break;
      }
    }

    let searchCountry = this.countries.filter((x) => x.name === user.country);
    if (searchCountry && searchCountry.length > 0) {
      this.formRegisterUser.controls.users['controls'][
        position
      ].controls.assistant['controls'].country.setValue(searchCountry[0]);
    }

    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].email.setValue(user.email);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].email_confirmation.setValue(user.email);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].id.setValue(user.id);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].gender.setValue(user.gender);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].document_type.setValue(user.document_type);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].identification.setValue(
      user.identification
    );
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].name.setValue(user.name);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].last_name.setValue(user.last_name);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].phone.setValue(user.phone);
    this.formRegisterUser.controls.users['controls'][
      position
    ].controls.assistant['controls'].pastor.setValue(user.pastor_code);
  }

  objectComparisonFunction(option: any, value: any): boolean {
    return option.id === value?.id;
  }

  private _filter(value: any, array: string): string[] {
    const filterValue = this._normalizeValue(value, array);
    let fileterdData = this[array].filter((option) =>
      this._normalizeValue(option, array).includes(filterValue)
    );
    if (fileterdData.length > 0) {
      return fileterdData;
    } else {
      return this[array];
    }
  }

  private _normalizeValue(value: any, array: any): string {
    if (value) {
      if (typeof value === 'object') {
        if (array === 'countries') {
          return value.name.toLowerCase().replace(/\s/g, '');
        }
      } else {
        return value.toLowerCase().replace(/\s/g, '');
      }
    }
  }

  validateNumber(e: any) {
    if (!e.key.match(/[0-9]/i)) {
      e.preventDefault();
    }
  }

  displayFn(data: any) {
    return data ? data.name : '';
  }

  onSubmit(): void {
    if (this.formRegisterUser.invalid) {
      Swal.fire('Asegurate de llenar el formulario correctamente.', '', 'info');
      return;
    }

    Swal.fire({
      title: '¿Deseas continuar con el registro?',
      text: `Estás registrando (${
        this.users().controls.length
      }) usuarios y el monto total a pagar es: ${
        this.formRegisterUser.controls.payment_information['controls'].currency
          .value === 'COP'
          ? this.totalPrices.total_price_cop
          : this.totalPrices.total_price_usd
      }`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      let payload = insertUsers(
        this.formRegisterUser.getRawValue(),
        this.totalPrices,
        this.box
      );

      if (result.isConfirmed) {
        this.isLoading = true;
        this.boxService.registerUsers({ ...payload }).subscribe(
          (res: any) => {
            Swal.fire(
              'El usuario ha sido registrado correctamente.',
              `Con la referencia ${res.ref}`,
              'success'
            ).then(() => {
              this._makePdfService.createPdf(res.ref, this.box);
              this.modal.close();
              this.isLoading = false;
            });
          },
          (err) => {
            this.isLoading = false;
            Swal.fire(
              err ? err : 'No se pudo registrar el usuario. Intenta de nuevo.',
              '',
              'error'
            );
            throw err;
          }
        );
      }
    });
  }
}
