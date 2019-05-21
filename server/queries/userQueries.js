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
  login(req, res) {
    const emal = req.body.email;
    pool.query('SELECT firstname, lastname, email, address, status, created_on, is_admin FROM users WHERE email = $1 ', [emal], (error, results) => {
      if (error) {
        throw error;
      }
      const { id } = results.rows[0];
      const {
        firstname, lastname, email, address, status, created_on, is_admin,
      } = results.rows[0];
      const token = helper.generateToken({ id, is_admin, email });
      const data = {
        id, firstname, lastname, email, address, status, created_on, token,
      };
      return res.status(200).json({
        status: 200,
        data,
      });
    });
   },
   verify(req, res) {
    const emal = req.params.email;
    const modifiedOn = new Date();
    const stat = 'verified';
    pool.query('UPDATE users SET status = $1, modified_on = $2 WHERE email = $3', [stat, modifiedOn, emal], (error, result) => {
      pool.query('SELECT id , firstname, lastname, email, address, status, FROM users WHERE email = $1', [emal], (error, results) => {
        const {
          id, firstname, lastname, email, address, status,
        } = results.rows[0];
        const data = {
          id, firstname, lastname, email, address, status, modifiedOn,
        };
        return res.status(200).json({
          status: 200,
          data,
        });
      });
    });
  },
};
export default users;
