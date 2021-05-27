export type User = {
    IdUser?: number;
    Nickname: string;
    Password: string;
    IdWin: string;
    UserCreate?: number;
    UserModified?: number;
    Available: boolean;
    TypeUser: number;
}
//WARNING, CHANGE AFTER

export type ListUser = {
    idUser: number;
    lastName: string;
    name: string;
    nickName: string;
    typeuser: string;
}

export type UserType = {
    idType?: number;
    name: string;
    description: string;
    available: boolean;
    UserCreation?: number;
    UserModified?: number;
}

export type UserObjects = {
    User: number,
    UserCreate: number,
    ListObject: [any]
}