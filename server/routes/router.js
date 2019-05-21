import express from 'express';
import User from '../controllers/users';
import validate from '../middleware/validation';
import Auth from '../middleware/auth';
import users from '../queries/userQueries';
import dbvalidate from '../middleware/dbValidations';

const userRouter = express.Router();

const { verifyInput, verifyLogin, verifyEmail } = dbvalidate;
const { verifyAdmin } = Auth;
const { creates, login, verify } = users;


userRouter.route('/api/v1/auth/signup').post(verifyInput, creates);
userRouter.route('/api/v1/auth/signin').post(verifyLogin, login);
userRouter.route('/api/v1/users/:email/verify').patch(verifyAdmin, verifyEmail, verify);


export default userRouter;
