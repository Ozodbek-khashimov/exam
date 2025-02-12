import { Product } from "../models/index.js";

export const productController = {
    async create(req, res, next) {
        try {
            const { name, description, categoryId, price, currency, stockQuantity, imageUrl } = req.body;

            if (!name || !description || !categoryId || !price || !currency || !stockQuantity || !imageUrl) {
                return res.status(400).json({ message: "Barcha maydonlar toldirilishi shart" });
            }

            const newProduct = new Product({
                name,
                description,
                categoryId,
                price,
                currency,
                stockQuantity,
                imageUrl
            });

            await newProduct.save();

            res.status(201).json({ message: "Product created", id: newProduct._id });
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const products = await Product.find();
            res.status(200).json({
                message: "All products",
                data: products
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const productId = req.params.id;
            const updateData = req.body;

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            Object.assign(product, updateData);
            await product.save();

            res.status(200).json({ message: "Product updated", id: product._id });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            await Product.deleteOne({ _id: productId });
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
};
