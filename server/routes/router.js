import express from 'express';
import User from '../controllers/users';
import validate from '../middleware/validation';

const userRouter = express.Router();

const { verifyInput } = validate;
const { create, login } = User;


userRouter.route('/auth/signup/api/v1').post(verifyInput,
  create);


export default userRouter;
