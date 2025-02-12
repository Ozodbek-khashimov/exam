import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        method: {
            type: String,
            enum: ["credit_card", "paypal", "bank_transfer"],
            default:"credit_card",
            required: true
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const Payment = model("Payment", paymentSchema);

