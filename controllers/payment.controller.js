import { Payment } from "../models/index.js";
import { Order } from "../models/index.js"; 

export const paymentController = {
    async create(req, res, next) {
        try {
            const { orderId, amount, method, transactionId } = req.body;
            
            if (!orderId || !amount || !method || !transactionId) {
                return res.status(400).json({ message: "Barcha maydonlar toldirilishi shart" });
            }

            const validMethods = ["credit_card", "paypal", "bank_transfer"];
            if (!validMethods.includes(method)) {
                return res.status(400).json({ message: "Invalid payment method" });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            const newPayment = new Payment({
                orderId,
                amount,
                method,
                transactionId,
                status: "pending"
            });

            await newPayment.save();

            res.status(201).json({ paymentId: newPayment._id, message: "Payment created" });
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const payments = await Payment.find();
            res.status(200).json(payments);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const paymentId = req.params.id;
            const payment = await Payment.findById(paymentId);

            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            res.status(200).json(payment);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const paymentId = req.params.id;
            const { amount, method, status, transactionId } = req.body;

            const validMethods = ["credit_card", "paypal", "bank_transfer"];
            if (method && !validMethods.includes(method)) {
                return res.status(400).json({ message: "Invalid payment method" });
            }

            const validStatuses = ["pending", "completed", "failed"];
            if (status && !validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            payment.amount = amount || payment.amount;
            payment.method = method || payment.method;
            payment.status = status || payment.status;
            payment.transactionId = transactionId || payment.transactionId;

            await payment.save();

            res.status(200).json({ paymentId: payment._id, message: "Payment updated" });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const paymentId = req.params.id;

            const payment = await Payment.findById(paymentId);
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            await Payment.deleteOne({ _id: paymentId });
            res.status(200).json({ message: "Payment deleted" });
        } catch (error) {
            next(error);
        }
    }
};
