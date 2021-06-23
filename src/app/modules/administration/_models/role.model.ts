export type Role = {
    id?: number;
    name: string;
    description: string;
    status?: boolean;
    permissions?: any[];
}

export type RoleObjects = {
    id: number,
    permissions: string[]
}