import validator from 'validator';
import Helper from '../Helper/helper';
import db from '../model/dbUsers';
import dbloans from '../model/dbLoans';
import dbrepayment from '../model/dbRepayment';

const validate = {
  verifyInput(req, res, next) {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'password'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(400).send({
        status: 400,
        error: 'The following field(s) is/are required',
        fields: missingFields,
      });
    }
    const {
      firstName, lastName, email, address, password,
    } = req.body;
    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)
    || !validator.isLength(firstName, { min: 3 }) || !validator.isLength(lastName, { min: 3 })) {
      return res.status(400).send({
        status: 400,
        error: 'Your names can only be in alphabets and must contain atleast three characters',
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({
        status: 400,
        error: 'please enter a valid email address',
      });
    }
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).send({
        status: 400,
        error: 'Your password must contain atleast 8 characters',
      });
    }
    if (!validator.isLength(address, { min: 5 })) {
      return res.status(400).send({
        status: 400,
        error: 'Your address must contain atleast 5 characters',
      });
    }
    const data = db.find(user => user.email === req.body.email);
    if (data) {
      return res.status(400).send({
        status: 400,
        error: 'This email as already being used',
      });
    }


    return next();
  },
  verifyLogin(req, res, next) {
    const requiredFields = ['email', 'password'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(400).send({
        status: 400,
        error: 'The following field(s) is required',
        fields: missingFields,
      });
    }
    if (validator.isEmpty(req.body.email) || validator.isEmpty(req.body.password)) {
      return res.status(400).send({
        status: 400,
        error: 'email and/or password cannot be empty',
      });
    }
    const email = db.find(user => user.email === req.body.email);
    if (!email) {
      return res.status(400).send({
        status: 400,
        error: 'The credentials provided is incorrect',
      });
    }
    if (!Helper.comparePassword(email.password, req.body.password)) {
      return res.status(400).send({
        status: 400,
        error: 'The credentials provided is incorrect',
      });
    }
    return next();
  },
  verifyAdmin(req, res, next) {
    const data = db.find(user => user.token === req.headers['x-access-token']);
    if (!data) {
      return res.status(401).send({
        status: 401,
        error: 'Access Denied, you need to sign in to perform this operation',
      });
    }
    if (data.isAdmin === false) {
      return res.status(403).send({
        status: 403,
        error: 'Access Denied, only an Admin can perform this operation',
      });
    }
    return next();
  },
  verifyEmail(req, res, next) {
    const params = db.find(user => user.email === req.params.email);
    if (!params) {
      return res.status(400).send({
        status: 400,
        error: 'Email is not registered',
      });
    }
    if (params.status === 'verified') {
      return res.status(400).send({
        status: 400,
        error: 'Account as already being verified',
      });
    }
    return next();
  },
  verifyLoanId(req, res, next) {
    const loan = dbloans.find(user => user.loanId === parseInt(req.params.loanId));
    if (!loan || loan.status !== 'pending') {
      return res.status(400).send({
        status: 400,
        error: 'id is not in the database or id is not for a loan application',
      });
    }
    return next();
  },
};
export default validate;
