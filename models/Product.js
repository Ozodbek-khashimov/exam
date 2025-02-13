import { Schema, Types, model } from "mongoose";
import { Category } from "./Category.js";


const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        categoryId: {
            type: Schema.Types.ObjectId,  
            ref: "Category",
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "UZS"],
            required: true
        },
        stockQuantity: {
            type: Number,
            required: true,
            default: 0
        },
        imageUrl: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export const Product = model("Product", productSchema);

