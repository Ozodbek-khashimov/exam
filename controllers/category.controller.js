import { Category } from "../models/index.js";

export const categoryController = {
    async create(req, res, next) {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({ message: "Barcha maydonlar toldirilishi shart" });
            }

            const newCategory = new Category({ name, description });
            await newCategory.save();

            res.status(201).json({ categoryId: newCategory._id, message: "Category created" });
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {Category
            const categoryId = req.params.id;
            const updateData = req.body;

            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            Object.assign(category, updateData);
            await category.save();

            res.status(200).json({ categoryId: category._id, message: "Category updated" });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId);

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await Category.deleteOne({ _id: categoryId });
            res.status(200).json({ message: "Category deleted" });
        } catch (error) {
            next(error);
        }
    }
};
