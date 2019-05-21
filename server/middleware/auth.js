import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Message from '../Helper/responseMessage';

dotenv.config();

const Auth = {
  /**
  * @description verifies a token
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} an error message
  */
  verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send(
        Message.errorMessage(401, 'Please provide token'),
      );
    }
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).send(
          Message.errorMessage(401, 'The Token provided is invalid'),
        );
      } 
    });
    return next();
  },
   /**
  * @description verifies an admin token
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} an error message
  */
  verifyAdmin(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send(
        Message.errorMessage(401, 'Please provide token'),
      );
    }
    jwt.verify(token, process.env.ASECRET, (error) => {
      if (error) {
        return res.status(403).send(
          Message.errorMessage(403, 'Access Denied, please provide a valid admin token'),
        );
      }
      return next();
    });
  },
};

export default Auth;
