import express from 'express';
import User from '../controllers/users';
import validate from '../middleware/validation';

const userRouter = express.Router();

const { verifyInput, verifyLogin } = validate;
const { create, login } = User;


userRouter.route('/api/v1/auth/signup').post(verifyInput,
  create);
userRouter.route('/api/v1/auth/signin').post(verifyLogin, login);

export default userRouter;
