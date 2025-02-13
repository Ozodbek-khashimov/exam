import { Joi } from 'express-validation'


export const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
  }),
};