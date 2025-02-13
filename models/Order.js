import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        shippingAddress: {
            type: String,
            required: true,
            trim: true
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                unitPrice: {
                    type: Number,
                    required: true
                }
            }
        ],
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "canceled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const Order = model("Order", orderSchema);

