import validator from 'validator';
import Helper from '../Helper/helper';
import db from '../model/dbUsers';
import dbloans from '../model/dbLoans';
import dbrepayment from '../model/dbRepayment';
import Message from '../Helper/responseMessage';

const validate = {
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
    const data = db.find(user => user.email === req.body.email);
    if (data) {
      return res.status(409).send(
        Message.errorMessage(409, 'This email as already being used'),
      );
    }


    return next();
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
    const email = db.find(user => user.email === req.body.email);
    if (!email) {
      return res.status(404).send(
        Message.errorMessage(401, 'Invalid email or password'),
      );
    }
    if (!Helper.comparePassword(email.password, req.body.password)) {
      return res.status(404).send(
        Message.errorMessage(401, 'Invalid email or password'),
      );
    }
    return next();
  },
  /**
  * @description verifies user email
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  verifyEmail(req, res, next) {
    const params = db.find(user => user.email === req.params.email);
    if (!params) {
      return res.status(404).send(
        Message.errorMessage(404, 'Email is not registered'),
      );
    }
    if (params.status === 'verified') {
      return res.status(400).send(
        Message.errorMessage(400, 'Account as already being verified'),
      );
    }
    return next();
  },
  /**
  * @description verifies loanId
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  verifyLoanId(req, res, next) {
    const loan = dbloans.find(user => user.loanId === parseInt(req.params.loanId));
    if (!loan || loan.status !== 'pending') {
      return res.status(400).send(
        Message.errorMessage(400, 'id is not in the database or id is not for a loan application'),
      );
    }
    return next();
  },
  /**
  * @description verifies loan Id
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  verifyId(req, res, next) {
    const loan = dbrepayment.find(user => user.loanId === parseInt(req.params.loanId));
    if (!loan) {
      return res.status(404).send(
        Message.errorMessage(404, 'id is not in the database'),
      );
    }
    return next();
  },
  /**
  * @description verifies user input
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  verifyFields(req, res, next) {
    const requiredFields = ['firstName', 'lastName', 'email', 'tenor', 'amount'];
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
      firstName, lastName, email, tenor, amount,
    } = req.body;
    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)
    || !validator.isLength(firstName, { min: 3 }) || !validator.isLength(lastName, { min: 3 })) {
      return res.status(400).send(
        Message.errorMessage(400, 'Your names can only be in alphabets and must contain atleast three characters'),
      );
    }
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
    const data = dbloans.find(user => user.email === req.body.email);
    if (data) {
      return res.status(400).send(
        Message.errorMessage(400, 'This user already as a pending loan'),
      );
    }
    return next();
  },
  /**
  * @description verifies user status
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  verifyStatus(req, res, next) {
    const User = dbloans.find(result => result.loanId === parseInt(req.params.loanId));
    if (!User) {
      return res.status(400).send(
        Message.errorMessage(400, 'loan id is not in the database'),
      );
    }
    if (User.status === 'approved') {
      return res.status(400).send(
        Message.errorMessage(400, 'Loan as already being approved'),
      );
    }
    return next();
  },
  /**
  * @description validates query
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  validateQuery(req, res, next) {
    const { status, repaid } = req.query;
    if (status) {
      if (!validator.isBoolean(repaid) || status !== 'approved') {
        return res.status(400).send(
          Message.errorMessage(400, 'invalid request query'),
        );
      }
    }

    return next();
  },
  /**
  * @description verifies user input
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} error message
  */
  verifyAmount(req, res, next) {
    if (req.body.paidAmount === undefined || !validator.isNumeric(req.body.paidAmount)
     || validator.isEmpty(req.body.paidAmount)) {
      return res.status(400).send(
        Message.errorMessage(400, 'paidAmount is required and it can only be a number'),
      );
    }
    const loans = dbloans.find(result => result.loanId === parseInt(req.params.loanId));
    console.log(loans);
    if (!loans || loans.repaid === true || loans.status === 'pending') {
      return res.status(400).send(
        Message.errorMessage(400, 'loanId is not in the database or loanId is not for a running loan'),
      );
    }
    return next();
  },
};
export default validate;
