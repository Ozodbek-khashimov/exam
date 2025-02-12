import { Router } from "express";
import {orderController} from "../controllers/index.js"
import {OrderSchema} from "../validation/index.js"
import { validate, ValidationError } from 'express-validation';
import {validateData} from "../middleware/validationmiddleware.js"

export const orderRouter=Router()

orderRouter.post(
    '/create',
    validateData(OrderSchema),
    orderController.create,
)

orderRouter.get('/', orderController.getAll)
orderRouter.get('/:id', orderController.getById)
orderRouter.put('/:id', orderController.update)
orderRouter.delete('/:id', orderController.delete)


orderRouter.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }
  
    return res.status(500).json(err);
  });