export type Role = {
    id?: number;
    name: string;
    description: string;
    available?: boolean;
    disposable?: boolean;
    UserCreation?: number;
    UserModified?: number;
}

export type RoleObjects = {
    Rol: number,
    UserCreate: number,
    ListObject: [any]
}