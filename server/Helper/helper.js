import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const Helper = {
  /**
  * @description hashes a user password in the database
  * @param {object} req request parameter
  * @returns {object} details of the hashed password
  */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
  },
  /**
  * @description compares password to the hashed one
  * @param {object} req request parameter
  */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  isValidEmail(password) {
    return /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,100}$/.test(password);
  },
  /**
  * @description generates token
  * @param {object} req request parameter
  * @returns {object} the generated token
  */
  generateToken(data) {
    let secret = process.env.SECRET;
    if (data.email === 'ojo@gmail.com') {
      secret = process.env.ASECRET;
    }

    const token = jwt.sign({
      userId: data,
    },
    secret, { expiresIn: '7d' });
    return token;
  },
};

export default Helper;
