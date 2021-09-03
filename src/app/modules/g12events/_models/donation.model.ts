import { Moment } from "moment"

type Prices = {
    cop: string;
    usd?: string;
}

type Image = {
    url: string;
    code?: string;
}

export interface Donation { //AN EVENT IS A DONATION
    id?: number;
    type: string;
    category: string;
    name: string;
    description: string;
    image?: Image | any;
    code?: string;
    base64?: any;
    prices: Prices;
    limit?: number;
    location?: [number],
    visibility?: any,
    init_date: Moment,
    finish_date: Moment,
    created_at?: string,
    updated_at?: string,
    status: boolean
}

export interface sendDonation {
    transaction_info: Donation,
    cuts: any[],
    image?: Image
}