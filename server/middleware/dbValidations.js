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
      if (error) {
        throw error;
      }
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
  verifyEmail(req, res, next) {
    const { email } = req.params;
    pool.query('SELECT email, status FROM users WHERE email = $1 ', [email], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send(
          Message.errorMessage(404, 'Email is not registered'),
        );
      }
      if (results.rows[0].status === 'verified') {
        return res.status(400).send(
          Message.errorMessage(400, 'Account as already being verified'),
        );
      }
      return next();
    });
  },
  verifyLoanId(req, res, next) {
    const { id } = req.params;
    pool.query('SELECT id, status FROM loans WHERE id = $1', [id], (error, results) => {
      if (!results.rows[0] || results.rows[0].status !== 'pending') {
        return res.status(404).send({
          status: 404,
          error: 'id is not in the database or id is not for a loan application',
        });
      }
      return next();
    });
  },
  validateQuery(req, res, next) {
    const { status, repaid } = req.query;
    if (status) {
      if (!validator.isBoolean(repaid) || status !== 'approved') {
        return res.status(400).send(
          Message.errorMessage(400, 'invalid request query'),
        );
      }
    }
    pool.query('SELECT status, repaid FROM loans WHERE status = $1 AND repaid = $2', ['pending', false], (error, results) => {
      if (!results.rows[0]) {
        return res.status(400).send(
          Message.errorMessage(400, 'There are no loans to view'),
        );
      }

      return next();
    });
  },
  verifyId(req, res, next) {
    const { loanId } = req.params;
    pool.query('SELECT loanid FROM repayments WHERE loanid = $1', [loanId], (error, results) => {
      if (!results.rows[0]) {
        return res.status(404).send(
          Message.errorMessage(404, 'loan id is not in the database'),
        );
      }
      return next();
    });
  },
  verifyFields(req, res, next) {
    const requiredFields = ['email', 'tenor', 'amount'];
    const missingFields = [];
    requiredFields.forEach((fields) => {
      if (req.body[fields] === undefined) {
        missingFields.push(fields);
      }
    });
    if (missingFields.length !== 0) {
      return res.status(400).send(
        Message.errorMessage(400, `The following field(s) is/are required (${missingFields})`),
      );
    }
    const { email, tenor, amount } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).send(
        Message.errorMessage(400, 'please enter a valid email address'),
      );
    }
    if (validator.isEmpty(tenor) || validator.isEmpty(amount) || !validator.isNumeric(tenor)
        || !validator.isNumeric(amount) || tenor > 12) {
      return res.status(400).send(
        Message.errorMessage(400, 'tenor and/or amount cannot be empty and must cotain a number, tenor cannot be more than 12'),
      );
    }
    pool.query('SELECT email, status, repaid FROM loans WHERE email = $1', [email], (error, results) => {
      if (!results.rows[0]) {
        return next();
      }
      if (results.rows[0].status === 'pending' || results.rows[0].repaid === false) {
        return res.status(400).send(
          Message.errorMessage(400, 'This user already as a pending loan or a running loan'),
        );
      }
      return next();
    });
  },
  verifyStatus(req, res, next) {
    const { status } = req.body;
    if (!status || status === undefined) {
      return res.status(400).send({
        error: 'status is required',
      });
    }
    if (status !== 'approved' && status !== 'rejected') {
     return res.status(400).send({
       error: 'status can only be approved or rejected',
     });
   }
    const id = parseInt(req.params.loanId);
    pool.query('SELECT id, status FROM loans WHERE id = $1', [id], (error, results) => {
      if (!results.rows[0]) {
        return res.status(400).send(
          Message.errorMessage(400, 'loan id is not in the database'),
        );
      }
      if (results.rows[0].status === 'approved') {
        return res.status(400).send(
          Message.errorMessage(400, 'Loan as already being approved'),
        );
      }
      if (results.rows[0].status === 'rejected') {
        return res.status(400).send(
          Message.errorMessage(400, 'Loan as already being rejected'),
        );
      }
      return next();
    });
  },
  };
  export default dbvalidate;
