import Helper from '../Helper/helper';
import db from '../model/db';

const User = {
  create(req, res) {
    const id = db.length + 1;
    const data = {
      token: Helper.generateToken(id),
      id: db.length + 1,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: Helper.hashPassword(req.body.password),
      address: req.body.address,
      status: 'unverified',
      isAdmin: false,
      created: new Date(),
      modified: new Date(),
    };

    db.push(data);
    res.status(201).send({
      status: 201,
      data,
    });
  },
};
export default User;