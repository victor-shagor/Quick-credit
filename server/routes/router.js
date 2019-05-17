import express from 'express';
import User from '../controllers/users';
import validate from '../middleware/validation';
import Auth from '../middleware/auth';

const userRouter = express.Router();

const { verifyInput, verifyLogin, verifyEmail } = validate;
const { create, login, verify } = User;
const { verifyAdmin } = Auth;


userRouter.route('/api/v1/auth/signup').post(verifyInput,
  create);
userRouter.route('/api/v1/auth/signin').post(verifyLogin, login);
userRouter.route('/api/v1/users/:email/verify').patch(verifyAdmin, verifyEmail, verify);

export default userRouter;
