import Helper from '../Helper/helper';
import db from '../model/dbUsers';
import Message from '../Helper/responseMessage';

const User = {
  /**
  * @description creates a user
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} details of the created user
  */
  create(req, res) {
    const {
      firstName, lastName, email, password, address,
    } = req.body;
    const id = db.length + 1;

    const data = {
      token: Helper.generateToken({
        id, firstName, email, isAdmin: false,
      }),
      id,
      firstName,
      lastName,
      email,
      password: Helper.hashPassword(password),
      address,
      status: 'unverified',
      isAdmin: false,
      created: new Date(),
      modified: new Date(),
    };

    db.push(data);
    const {
      token, status, created, modified,
    } = data;
    const response = {
      token,
      id,
      firstName,
      lastName,
      email,
      address,
      status,
      created,
      modified,
    };
    return res.status(201).send(
      Message.message(201, response),
    );
  },
  /**
  * @description login an existing user
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} details of the user
  */
  login(req, res) {
    const user = db.find(result => result.email === (req.body.email));
    const data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.status,
      created: user.created,

    };
    const token = Helper.generateToken({ id: user.id, firstname: user.firstName, email: user.email });
    const message = Message.message(200, data);
    return res.status(200).send({
      message,
      token,

    });
  },
  /**
  * @description verifies account of the user
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} details of the verified account
  */
  verify(req, res) {
    const email = db.find(user => user.email === req.params.email);
    email.status = 'verified';
    return res.status(200).send(
      Message.message(200, email),
    );
  },
};
export default User;
