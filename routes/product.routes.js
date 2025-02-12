import { Router } from "express";
import { validate, ValidationError } from 'express-validation';
import {productController} from "../controllers/index.js"
import {productSchema} from "../validation/index.js"
import {validateData} from "../middleware/validationmiddleware.js"

export const productRouter=Router();

productRouter.post(
    "/create",
    validateData(productSchema),
    productController.create,
)

productRouter.get("/",productController.getAll)
productRouter.get("/:id", productController.getById)
productRouter.put("/:id",productController.update)
productRouter.delete("/:id",productController.delete)


productRouter.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }
  
    return res.status(500).json(err);
  });