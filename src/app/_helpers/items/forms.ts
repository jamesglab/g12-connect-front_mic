import { Validators } from '@angular/forms';

export const ADD_PERSON_FORM = {
    isDoc: [false],
    idDocumentType: [null],//
    documentNumber: [null, [Validators.pattern(/^[0-9a-zA-Z\s,-]+$/), Validators.minLength(6),
    Validators.maxLength(13)]],
    names: ['', [Validators.required]],//
    surNames: ['', [Validators.required]],
    birthDate: [null],//
    idCivilStatus: [null, [Validators.required]],//
    gender: [null, [Validators.required]],//
    phone: ['', [Validators.required]],
    email: ['', [Validators.email]],//
    address: ['', [Validators.pattern(/^[#.0-9a-zA-Z\s,-]+$/),Validators.maxLength(50), 
    Validators.minLength(8)]],//
    mobile: ['', [Validators.required,Validators.pattern(/^[0-9+]*$/),Validators.maxLength(13),
    Validators.minLength(6)]],//
    neighborhoods: ['', [Validators.pattern(/^[A-Za-z\s,Ññ]+$/)]],//
    idZone: [null, [Validators.required]],//
    idPastor: ['', [Validators.required]],
    idLeader: [{ value: '', disabled: true }, [Validators.required]],//
    personInvites: ['', [Validators.required]],//
    idMeeting: [null, [Validators.required]],//
    petition: [null,[Validators.required,Validators.pattern(/^[A-Za-z0-9\s,-ñÑáÁéÉíÍóÓúÚ]+$/)]],
    idWin: [0, [Validators.required]],//
    idPartnerWin:[null],
    idChurchType: [88, [Validators.required]], //
    idUserCreation: [1, [Validators.required]],//
    idUserModification: [1, [Validators.required]],
};

export const UPDATE_PERSON_FORM = {
    idDocumentType: [{ value: '', disabled: true }],//
    documentNumber: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9a-zA-Z\s,-]+$/), Validators.minLength(6),
    Validators.maxLength(13)]],
    names: ['', [Validators.required]],//
    surNames: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],//
    idCivilStatus: [null, [Validators.required]],//
    gender: [null, [Validators.required]],//
    phone: ['', [Validators.required]],
    email: ['', [Validators.email]],//
    address: ['', [Validators.pattern(/^[#.0-9a-zA-Z\s,-]+$/),Validators.maxLength(50), 
    Validators.minLength(8)]],//
    mobile: ['', [Validators.required,Validators.pattern(/^[0-9+]*$/),Validators.maxLength(13),
    Validators.minLength(6)]],//
    neighborhoods: ['', [Validators.pattern(/^[A-Za-z\s,Ññ]+$/)]],//
    idZone: [null, [Validators.required]],//
    idPastor: ['', [Validators.required]],
    idLeader: [{ value: '', disabled: true }, [Validators.required]],//
    personInvites: ['', [Validators.required]],//
    idMeeting: [null, [Validators.required]],//
    petition: [null],
    idWin: [null, [Validators.required]],//
    idPartnerWin:[null],
    idChurchType: [88, [Validators.required]], //
    idUserCreation: [1, [Validators.required]],//
    idUserModification: [1, [Validators.required]],
};

export const REPORT_PHONE_VISIT = {
    idDocumentType: [{ value: '', disabled: true }],//
    documentNumber: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9a-zA-Z\s,-]+$/), Validators.minLength(6),
    Validators.maxLength(13)]],//
    names: ['', [Validators.required]],//
    surNames: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],//
    idCivilStatus: [null, [Validators.required]],//
    gender: [null, [Validators.required]],//
    phone: ['', [Validators.required]],
    email: ['', [Validators.email]],//
    address: ['', [Validators.pattern(/^[#.0-9a-zA-Z\s,-]+$/),Validators.maxLength(50), 
    Validators.minLength(8)]],//
    mobile: ['', [Validators.required,Validators.pattern(/^[0-9+]*$/),Validators.maxLength(13),
    Validators.minLength(6)]],//
    neighborhoods: ['', [Validators.pattern(/^[A-Za-z\s,Ññ]+$/)]],//
    idZone: [null, [Validators.required]],//
    idPastor: [''],//MEANWHILE
    idLeader: [{ value: '', disabled: true }, [Validators.required]],//
    personInvites: [{ value: '', disabled: true }, [Validators.required]],//
    idMeeting: [{ value: '', disabled: true }, [Validators.required]],//
    petition: [{ value: '', disabled: true },Validators.pattern(/^[A-Za-z0-9\s,-ñÑáÁéÉíÍóÓúÚ]+$/)],
    idPartnerWin:[null],
    idChurchType: [88, [Validators.required]], //
    idUserCreation: [1, [Validators.required]],//
    idUserModification: [1, [Validators.required]],
    idWin: [null, [Validators.required]],//
    IdWin: [null, [Validators.required]],
    Date: ['',[Validators.required]],
    Code: [''],//result of phonevisit
    Description: ['',[Validators.pattern(/^[A-Za-z0-9\s,-ñÑáÁéÉíÍóÓúÚ]+$/)]],
    Commentary: ['',[Validators.pattern(/^[A-Za-z0-9\s,-ñÑáÁéÉíÍóÓúÚ]+$/)]],
    IdUser: [null,[Validators.required]],
    Process: [''],
    IdResultPhoneVisit: [null, [Validators.required]]
}

