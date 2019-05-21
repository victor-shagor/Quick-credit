import Pool from 'pg-pool';
import validator from 'validator';
import Helper from '../Helper/helper';
import db from '../model/dbUsers';
import dbloans from '../model/dbLoans';
import dbrepayment from '../model/dbRepayment';
import Message from '../Helper/responseMessage';

const pool = new Pool({
  user: 'victor_shagor',
  host: 'localhost',
  database: 'quickcredit',
  password: 'oladimeji',
  port: 5432,
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
    pool.query('SELECT * FROM users WHERE email = $1 ', [email], (error, results) => {
      if (results.rows[0]) {
        return res.status(409).send(
          Message.errorMessage(409, 'This email as already being used'),
        );
      }
      return next();
    });
  },
};
export default dbvalidate;
