import validator from 'validator';
import Helper from '../Helper/helper';
import db from '../model/db';

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
      return res.status(422).send({
        status: 422,
        error: 'The following field(s) is required',
        fields: missingFields,
      });
    }
    const {
      firstName, lastName, email, address, password,
    } = req.body;
    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)
    || !validator.isLength(firstName, { min: 3 }) || !validator.isLength(lastName, { min: 3 })) {
      return res.status(422).send({
        status: 422,
        error: 'Your names can only be in alphabets and must contain atleast three characters',
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(422).send({
        status: 422,
        error: 'please enter a valid email address',
      });
    }
    const data = db.find(user => user.email === req.body.email);
    if (data) {
      return res.status(422).send({
        status: 422,
        error: 'This email as already being used',
      });
    }
    if (!validator.isAlphanumeric(password) || !validator.isLength(password, { min: 8 })) {
      return res.status(422).send({
        status: 422,
        error: 'Your password must contain atleast 8 characters and must include atleast one number(symbols are not allowed)',
      });
    }
    if (!validator.isLength(address, { min: 5 })) {
      return res.status(422).send({
        status: 422,
        error: 'Your address must contain atleast 5 characters',
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
      return res.status(422).send({
        status: 422,
        error: 'The following field(s) is required',
        fields: missingFields,
      });
    }
    if (validator.isEmpty(req.body.email) || validator.isEmpty(req.body.password)) {
      return res.status(422).send({
        status: 422,
        error: 'email and/or password cannot be empty',
      });
    }
    const email = db.find(user => user.email === req.body.email);
    if (!email) {
      return res.status(422).send({
        status: 422,
        error: 'The credentials provided is incorrect',
      });
    }
    if (!Helper.comparePassword(email.password, req.body.password)) {
      return res.status(422).send({
        status: 422,
        error: 'The credentials provided is incorrect',
      });
    }
    return next();
  },
};
export default validate;
