import { Document, Schema } from "mongoose";

export interface IProduct extends Document{
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly stock_quantity: number;
    readonly category: Schema.Types.ObjectId;
    
}