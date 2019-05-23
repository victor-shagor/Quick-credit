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
        return res.status(200).send({ data: results.rows });
      });
    }
    if (!status || !repaid) {
      pool.query('SELECT * FROM loans WHERE status = $1', ['pending'], (error, results) => {
        if (error) {
          throw error;
        }
        return res.status(200).send({ data: results.rows });
      });
    }
  },
  getRepaymentById(req, res) {
    const { loanId } = req.params;
    pool.query('SELECT * FROM repayments WHERE loanid = $1', [loanId], (error, results) => {
      if (error) {
        throw error
      }
      return res.status(200).send({
        status: 200,
        data: results.rows[0],
      });
    });
  },
};
export default loans;
