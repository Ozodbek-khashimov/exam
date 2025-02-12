import { Review } from "../models/index.js";
import { Product } from "../models/index.js"; 

export const reviewController = {
    async create(req, res, next) {
        try {
            const { productId, rating, comment } = req.body;
            
            if (!productId || !rating || !comment) {
                return res.status(400).json({ message: "Barcha maydonlar toldirilishi shart" });
            }
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Rating 1 dan 5 gacha bo'lishi kerak" });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const newReview = new Review({
                productId,
                rating,
                comment,
                status: "pending", 
                userId: req.userId, 
            });

            await newReview.save();

            res.status(201).json({ reviewId: newReview._id, message: "Review created" });
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const reviews = await Review.find();
            res.status(200).json(reviews);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const reviewId = req.params.id;
            const review = await Review.findById(reviewId);

            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }

            res.status(200).json(review);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const reviewId = req.params.id;
            const { rating, comment, status } = req.body;

            const validStatuses = ["approved", "pending", "rejected"];
            if (status && !validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }
            if (rating && (rating < 1 || rating > 5)) {
                return res.status(400).json({ message: "Rating 1 dan 5 gacha bo'lishi kerak" });
            }

            const review = await Review.findById(reviewId);
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }

            review.rating = rating || review.rating;
            review.comment = comment || review.comment;
            review.status = status || review.status;

            await review.save();

            res.status(200).json({ reviewId: review._id, message: "Review updated" });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const reviewId = req.params.id;

            const review = await Review.findById(reviewId);
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }

            await Review.deleteOne({ _id: reviewId });
            res.status(200).json({ message: "Review deleted" });
        } catch (error) {
            next(error);
        }
    }
};
