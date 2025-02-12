import { Order } from "../models/index.js";
import { Product } from "../models/index.js"; 

export const orderController = {
    async create(req, res, next) {
        try {
            const { userId, shippingAddress, items } = req.body;

            if (!userId || !shippingAddress || !items || items.length === 0) {
                return res.status(400).json({ message: "Barcha maydonlar toldirilishi shart" });
            }

            let totalAmount = 0;
            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
                }
                totalAmount += item.quantity * item.unitPrice;
            }

            const newOrder = new Order({
                userId,
                shippingAddress,
                items,
                totalAmount,
                status: "pending", 
                orderDate: new Date(),
            });

            await newOrder.save();

            res.status(201).json({ orderId: newOrder._id, message: "Order created" });
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const orders = await Order.find();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const orderId = req.params.id;
            const { status } = req.body;

            const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            order.status = status;
            await order.save();

            res.status(200).json({ orderId: order._id, message: "Order updated" });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const orderId = req.params.id;

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            await Order.deleteOne({ _id: orderId });
            res.status(200).json({ message: "Order deleted" });
        } catch (error) {
            next(error);
        }
    }
};
