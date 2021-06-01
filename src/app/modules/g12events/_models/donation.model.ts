type Prices = {
    cop: string;
    usd?: string;
}

export interface Donation { //AN EVENT IS A DONATION
    id?: number;
    type: string;
    category: string;
    name: string;
    description: string;
    image?: string;
    prices: Prices;
    limit?: number;
    location?: [number],
    visibility?: [string],
    created_at?: string,
    updated_at?: string,
    status: boolean
}