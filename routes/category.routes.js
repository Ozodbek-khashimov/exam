import { Router } from "express";
import { categoryController } from "../controllers/index.js";
import { categorySchema } from "../validation/index.js";
import { validate, ValidationError } from 'express-validation';
import {validateData} from "../middleware/validationmiddleware.js"

export const categoryRouter=Router()

categoryRouter.post(
    "/create",
    validateData(categorySchema),
    categoryController.create,
)

categoryRouter.get("/",categoryController.getAll)
categoryRouter.get("/:id",categoryController.getById)
categoryRouter.put("/:id",categoryController.update)
categoryRouter.delete("/:id",categoryController.delete)