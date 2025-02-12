import {Router} from "express"
import { paymentController } from "../controllers/index.js";
import { validate, ValidationError } from 'express-validation';
import { paymentSchema } from "../validation/index.js";
import {validateData} from "../middleware/validationmiddleware.js"

export const paymentRouter=Router()

paymentRouter.post(
    "/create",
    validateData(paymentSchema),
    paymentController.create
)

paymentRouter.get("/",paymentController.getAll)
paymentRouter.get("/:id",paymentController.getById)
paymentRouter.put("/:id",paymentController.update)
paymentRouter.delete("/:id",paymentController.delete)

paymentRouter.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    }
  
    return res.status(500).json(err);
  });