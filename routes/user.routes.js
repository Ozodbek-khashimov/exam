import { Router } from 'express';
import { ValidationError } from 'express-validation';
import { usercontroller } from '../controllers/index.js';
import { userLoginSchema, userRegistrationSchema } from '../validation/index.js';
import { validateData } from '../middleware/validationmiddleware.js';
import { userMiddleware } from '../middleware/user.middleware.js';

export const userRouter = Router();

userRouter.post('/register',
  validateData(userRegistrationSchema),
  // userMiddleware,
  // (req, res, next) => {
  //   if (req.body.role == 'admin') {
  //     if (req.user.role == 'admin') {
  //       return next();
  //     }
  //     return res.status(403).json({ error: 'Only admin can create admin account' });
  //   }
  // },
  usercontroller.register
)
userRouter.post('/verifyOTP', usercontroller.verifyOTP);
userRouter.post('/login', validateData(userLoginSchema), usercontroller.login,);
userRouter.get('/:id', userMiddleware, usercontroller.getProfile);
userRouter.put('/:id', userMiddleware, usercontroller.updateProfile);
userRouter.delete('/:id', userMiddleware, usercontroller.deleteProfile);
userRouter.delete('/user/:id', userMiddleware, usercontroller.deleteUser);

userRouter.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});