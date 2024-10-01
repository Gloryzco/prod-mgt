import { Document, Schema } from "mongoose";

export interface IProduct extends Document{
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly stockQuantity: number;
    readonly categoryId: Schema.Types.ObjectId;
    
}