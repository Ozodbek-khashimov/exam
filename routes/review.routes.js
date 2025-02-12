import { Router } from "express";
import { validate, ValidationError } from 'express-validation';
import {reviewController} from "../controllers/index.js"
import {reviewSchema} from "../validation/index.js"
import {validateData} from "../middleware/validationmiddleware.js"

export const rewievRouter=Router()

rewievRouter.post(
    '/create',
    validateData(reviewSchema),
    reviewController.create,
)

rewievRouter.get("/",reviewController.getAll)
rewievRouter.get("/:id",reviewController.getById)
rewievRouter.put("/:id",reviewController.update)
rewievRouter.delete("/:id",reviewController.delete)


rewievRouter.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }
  
    return res.status(500).json(err);
  });