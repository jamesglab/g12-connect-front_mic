export type Object = {
    id: number;
    name?: string;
    description?: string;
    status: boolean;
}

export type ListObject = {
    id: number;
    type: string;
    value: string;
    description: string;
    status: boolean;
    created_at: string;
}

export type ObjectType = {
    id?: number;
    name: string;
    description: string;
    disposable: boolean;
    app?: number
}