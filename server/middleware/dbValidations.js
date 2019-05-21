import Pool from 'pg-pool';
import dotenv from 'dotenv';
import validator from 'validator';
import Helper from '../Helper/helper';
import db from '../model/dbUsers';
import dbloans from '../model/dbLoans';
import dbrepayment from '../model/dbRepayment';
import Message from '../Helper/responseMessage';


dotenv.config();

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
});

const dbvalidate = {
  /**
  * @description verifies user input
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  verifyInput(req, res, next) {
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'password'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(400).send(
        Message.errorMessage(400, `The following field(s) is/are required ${missingFields}`),
      );
    }
    const {
      firstName, lastName, email, address, password,
    } = req.body;
    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)
    || !validator.isLength(firstName, { min: 3 }) || !validator.isLength(lastName, { min: 3 })) {
      return res.status(400).send(
        Message.errorMessage(400, 'The names must be atleast 3 characters and can only be alphabets'),
      );
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send(
        Message.errorMessage(400, 'please enter a valid email address'),
      );
    }
    if (!Helper.isValidEmail(password)) {
      return res.status(400).send(
        Message.errorMessage(400, 'Your password must contain atleast 8 characters and must atleast one number'),
      );
    }
    if (!validator.isLength(address, { min: 5 })) {
      return res.status(400).send(
        Message.errorMessage(400, 'Your address must contain atleast 5 characters'),
      );
    }
    pool.query('SELECT email FROM users WHERE email = $1 ', [email], (error, results) => {
      if (results.rows[0]) {
        return res.status(409).send(
          Message.errorMessage(409, 'This email as already being used'),
        );
      }
      return next();
    });
  },
   /**
  * @description verifies user input
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
 verifyLogin(req, res, next) {
  const requiredFields = ['email', 'password'];
  const missingFields = [];
  requiredFields.forEach((fields) => {
    if (req.body[fields] === undefined) {
      missingFields.push(fields);
    }
  });
  if (missingFields.length !== 0) {
    return res.status(400).send(
      Message.errorMessage(400, `The following field(s) is/are required ${missingFields}`),
    );
  }
  if (validator.isEmpty(req.body.email) || validator.isEmpty(req.body.password)) {
    return res.status(400).send(
      Message.errorMessage(400, 'email and/or password cannot be empty'),
    );
  }
  const { email } = req.body;
  pool.query('SELECT email, password FROM users WHERE email = $1 ', [email], (error, results) => {
    if (!results.rows[0]) {
      return res.status(404).send(
        Message.errorMessage(404, 'Invalid email or password'),
      );
    }
    if (!Helper.comparePassword(results.rows[0].password, req.body.password)) {
      return res.status(404).send(
        Message.errorMessage(404, 'Invalid email or password'),
      );
    }
    return next();
  });
},
};
export default dbvalidate;
