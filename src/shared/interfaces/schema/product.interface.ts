import { Document, Schema } from "mongoose";

export interface IProduct extends Document{
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly stockQuantity: number;
    readonly sku: string;
    readonly available: boolean;
    readonly categoryId: Schema.Types.ObjectId;
    readonly createdAt: Date,
    toPayload(): Partial<IProduct>;
}