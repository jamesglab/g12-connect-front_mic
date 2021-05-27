export interface PhoneVisit {
    call: boolean;
    dateWin: string;
    idWin: number;
    mobile: string;
    nameLeader: string;
    nameWin: string;
    phone: string;
    visited: boolean
}

export interface NewPhoneVisit {
    IdWin: number;
    Date: string;
    Code: string,
    Description: string,
    Commentary: string,
    IdUser: number,
    Process: string,
    IdResultPhoneVisit: number
}