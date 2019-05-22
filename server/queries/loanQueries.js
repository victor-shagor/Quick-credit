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
}
 export default loans;