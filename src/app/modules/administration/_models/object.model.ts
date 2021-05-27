export type Object = {
    Type: number;
    Name: string;
    Description?: string;
    Available: boolean;
    UserCreation?: number;
    UserModified?: number;
}

export type ListObject = {
    id: number;
    idTypeObject: number;
    typeObject: string;
    object: string;
    description: string;
    disposable: boolean;
}

export type ObjectType = {
    id?: number;
    name: string;
    description: string;
    disposable: boolean;
    app?: number
}