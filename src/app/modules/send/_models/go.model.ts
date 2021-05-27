export class Go {
    posicion?: number;
    id?: number;
    creationDate?: Date;
    idType?: number;
    typeGo?: string;
    address?: string;
    day?: string;
    hour?: string;
    idLeader?: number;
    leader?: string;
    phone?: string;
    movil?: string;
    idHost?: number;
    host?: string;
    reasonsClosing?: string;
    numberMembers?: number;
    status?: boolean;
    reporteSemana?: string;
}

export class SeeReportGo {
    posicion: number;
    idGo: number;
    year: number;
    month: number;
    week: number;
    topic: string;
    done: boolean;
    numberAttendess: number;
}

export class NewGo {
    typeGo?: number;
    leader?: number;
    host?: number;
    openingDate?: Date;
    day?: string;
    hour?: string;
    statu?: boolean;
    reasonsClosing?: string;
    creationUser?: number;
    modificationUser?: number;
    creationDate?: string;
    modificationDate?: string;
}

export class NewReportGo {
    done: boolean;
    moth: number;
    week: number;
    theme: string;
    idGo: number;
    year: number;
    listAssistant: { idMember: number; }[];
}

export class EditGo {
    idGo: number;
    day: string;
    Hour: string;
    typeGo: number;
    ModificationUser: number;
}

export class GoType {
    ticeCodigo?: string;
    ticeDescripcion?: string;
    ticeEstado?: boolean;
    ticeFechaCreacion?: string;
    ticeFechaModificacion?: string;
    ticeId?: number;
    ticeIdUsuarioCreacion?: number;
    ticeIdUsuarioModificacion?: number;
}