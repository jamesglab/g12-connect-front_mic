export type User = {
    id: number;
    identification?: string;
    name?: string;
    last_name?: string;
    email?: string;
    status?: boolean;
    phone?: string;
}
//WARNING, CHANGE AFTER

export type ListUser = {
    id: number;
    identification?: string;
    name?: string;
    last_name?: string;
    email?: string;
    status?: boolean;
    phone?: string;
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