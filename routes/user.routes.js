import { Router } from 'express';
import { validate, ValidationError } from 'express-validation';
import { usercontroller } from '../controllers/index.js';
import { loginValidation, userLoginSchema, userRegistrationSchema } from '../validation/index.js';
import { validateData } from '../middleware/validationmiddleware.js';
import { userMiddleware } from '../middleware/user.middleware.js';
import { roleGuard } from '../middleware/role.middleware.js'

export const userRouter = Router();

userRouter.post('/register',
  validateData(userRegistrationSchema),
  usercontroller.register
)
userRouter.post('/verifyOTP', usercontroller.verifyOTP);
userRouter.post('/login', validateData(userLoginSchema), usercontroller.login,);
userRouter.get('/profile', userMiddleware, usercontroller.getProfile);
userRouter.put('/profile', userMiddleware, usercontroller.updateProfile);
userRouter.delete('/profile', userMiddleware, usercontroller.deleteProfile);
userRouter.delete('/user/:id', userMiddleware, usercontroller.deleteUser);

userRouter.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});