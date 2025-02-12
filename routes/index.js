import { Router } from 'express';
import { userRouter } from './user.routes.js';
import { productRouter } from './product.routes.js';
import { orderRouter } from './order.routes.js';
import { rewievRouter } from './review.routes.js';
import { paymentRouter } from './payment.routes.js';
import { categoryRouter } from './category.routes.js';
// import { otpRouter } from './otp.routes.js';

export const apiRouter = Router();


apiRouter.use('/user', userRouter);
apiRouter.use('/product',productRouter)
apiRouter.use('/order',orderRouter)
apiRouter.use('/rewiev',rewievRouter)
apiRouter.use('/payment',paymentRouter)
apiRouter.use('/category',categoryRouter)
// apiRouter.use('/otp',otpRouter)