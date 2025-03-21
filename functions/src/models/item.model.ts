import { Collection } from "fireorm";

export interface ItemType {
    id: string;
    name: string;
    description?: string;
    price?: number;
    createdAt: Date;
    updatedAt: Date;
}

@Collection('items')
export class Item {
    id!: string;
    name!: string;
    description?: string;
    price?: number;
    createdAt!: Date;
    updatedAt!: Date;
}