import dbloans from '../model/dbLoans';
import dbrepayment from '../model/dbRepayment';

const Loans = {
  getLoanById(req, res) {
    const loan = dbloans.find(user => user.loanId === parseInt(req.params.loanId));
    if (loan.status === 'pending') {
      return res.status(200).send({
        status: 200,
        data: loan,
      });
    }
  },
};

export default Loans;
