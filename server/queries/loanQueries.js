import Pool from 'pg-pool';
import helper from '../Helper/helper';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const loans = {
  getLoanById(req, res) {
    const { id } = req.params;
    pool.query('SELECT * FROM loans WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      return res.status(200).send({
        status: 200,
        data: results.rows[0],
      });
    });
  },
  getLoans(req, res) {
    const { status, repaid } = req.query;
    if (status && repaid) {
      pool.query('SELECT * FROM loans WHERE status = $1 AND repaid = $2', [status, repaid], (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send({ 
          status: 200,
          data: results.rows, 
        });
      });
    }
    if (!status || !repaid) {
      pool.query('SELECT * FROM loans WHERE status = $1', ['pending'], (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send({ 
          status: 200,
          data: results.rows, 
        });
      });
    }
  },
  getRepaymentById(req, res) {
    const { loanId } = req.params;
    pool.query('SELECT * FROM repayments WHERE loanid = $1', [loanId], (error, results) => {
      if (error) {
        throw error;
      }
      return res.status(200).send({
        status: 200,
        data: results.rows[0],
      });
    });
  },
  create(req, res) {
    const amount = parseInt(req.body.amount);
    const tenor = parseInt(req.body.tenor);
    const interest = amount * (5 / 100);
    const balance = amount + interest;
    const paymentInstallmant = (amount + interest) / tenor;
    const { email } = req.body;
    const createdOn = new Date();
    pool.query('SELECT email, firstname, lastname, address FROM users WHERE email = $1', [email], (error, results) => {
      const { firstname, lastname, address } = results.rows[0];
      pool.query('INSERT INTO loans (firstname, lastname, email, address, tenor, amount, paymentInstallment, balance, interest, repaid, status, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [firstname, lastname, email, address, tenor, amount, paymentInstallmant, balance, interest, false, 'pending', createdOn], (error, results) => {
        const data = {
          firstname,
          lastname,
          address,
          email,
          tenor,
          amount,
          paymentInstallmant,
          status: 'pending',
          repaid: false,
          balance,
          interest,
        };
        res.status(201).send({
          status: 201,
          data,
        });
      });
    });
  },
  approve(req, res) {
    const { status } = req.body;
    const id = parseInt(req.params.loanId);
    pool.query('UPDATE loans SET status = $1 WHERE id = $2', [status, id], (error, result) => {
      pool.query('SELECT * FROM loans WHERE id = $1', [id], (error, results) => {
        return res.status(200).send({
          status: 200, data: results.rows[0],
        });
      });
    });
  },
  repayment(req, res) {
    const { loanId } = req.params;
    const paidAmount = parseInt(req.body.paidAmount);
    pool.query('SELECT id, amount, paymentinstallment, balance FROM loans WHERE id = $1', [loanId], (error, results) => {
      const { id, amount, paymentinstallment, balance } = results.rows[0];
      const bal = balance - paidAmount;
      pool.query('INSERT INTO repayments (loanid, createdOn, amount, paymentInstallment, paidAmount balance) VALUES ($1, $2, $3, $4, $5, $6)', [id, new Date(), amount, paymentinstallment, paidAmount, bal], (error, result) => {
      
      pool.query('UPDATE loans SET balance = $1 WHERE id =$2', [bal, loanId], (error, balace) => {
       const data = {
          loanId: id,
          createdOn: new Date(),
          amount,
          monthlyInstallment: paymentinstallment,
          paidAmount,
          balance: bal,
        };
        pool.query('UPDATE loans SET repaid = $1 WHERE balance =$2', [true, 0], (error, balac) => {})
        return res.status(201).send({
          status: 201,
          data,
        });
       });
      });
    });
   },
};
export default loans;
