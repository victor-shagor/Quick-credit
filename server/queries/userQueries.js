import dotenv from 'dotenv';
import Pool from 'pg-pool';
import helper from '../Helper/helper';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const users = {
  creates(req, res) {
    const password = helper.hashPassword(req.body.password);
    const {
      firstName, lastName, email, address,
    } = req.body;
    const createdOn = new Date();
    const modifiedOn = new Date();
    const isAdmin = false;
    const status = 'unverified';
    const data = {
      firstName, lastName, email, address, status, createdOn,
    };

    pool.query('INSERT INTO users (firstname, lastname, email, password, address, status, is_admin, created_on, modified_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [firstName, lastName, email, password, address, status, isAdmin, createdOn, modifiedOn], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send({
        status: 201,
        data,
      });
    });
  },
};
export default users;
