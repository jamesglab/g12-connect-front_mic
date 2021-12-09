import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEmailComponent } from './components/create-email/create-email.component';
import { UpdateEmailComponent } from './components/update-email/update-email.component';
import { EmailService } from './_services/email.service';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss'],
})
export class EmailsComponent implements OnInit {
  displayedColumns: string[] = [
    'i',
    'image',
    'type',
    'status',
    'created_at',
    'updated_at',
    'options'
  ];
  dataSource;
  constructor(
    private modalService: NgbModal,
    private _emailService: EmailService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEmails();
  }

  getEmails() {
    this._emailService.getEmailsModules().subscribe((res) => {
      this.dataSource = res;
      this.cdr.detectChanges();
    });
  }

  createEmail() {
    const MODAL = this.modalService.open(CreateEmailComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true,
    });
    MODAL.result.then((r) => {
      this.getEmails();
    });
  }

  handleEditEmail(email) {
    const MODAL = this.modalService.open(UpdateEmailComponent, {
      windowClass: 'fadeIn',
      size: 'xl',
      backdrop: true,
      keyboard: true,
      centered: true,
    });
    MODAL.componentInstance.email_to_update = email;
    MODAL.result.then((r) => {
      this.getEmails();
    });
  }

  getStatus(status) {
    switch (parseInt(status)) {
      case 1:
        return 'APROBADA';
        break;
      case 2:
        return 'PENDIENTE';
        break;

      case 3:
        return 'CANCELADA';
        break;
      default:
        break;
    }
  }

  getType(type) {
    switch (type?.toString().toUpperCase()) {
      case 'MCI_DONACIONES':
        return 'MCI DONACIONES';
        break;
      case 'G12_EVENTOS':
        return 'EVENTOS G12';
        break;

      case 'CONEXION_BOX':
        return 'CONEXIÓN CAJAS';
        break;

      case 'CONEXION_MASSIVE':
        return 'CONEXIÓN MASIVOS';
        break;

      default:
        break;
    }
  }
  handleErrorImage($event: any) {
    $event.target.src = 'assets/media/logos/logoConexion12.png';
  }
}
