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
  getLoans(req, res) {
    const { status, repaid } = req.query;
    if (status === 'approved' && repaid === 'false') {
      const loan = dbloans.filter(user => user.status === 'approved' && user.repaid === false);
      return res.status(200).send({
        status: 200,
        data: loan,
      });
    }
    if (status === 'approved' && repaid === 'true') {
      const loan = dbloans.filter(user => user.status === 'approved' && user.repaid === true);
      return res.status(200).send({
        status: 200,
        data: loan,
      });
    }
    if (!status || !repaid) {
      const loan = dbloans.filter(user => user.status === 'pending');
      return res.status(200).send({
        status: 200,
        data: loan,
      });
    }
  },
  getRepaymentById(req, res) {
    const loan = dbrepayment.find(user => user.loanId === parseInt(req.params.loanId));
    return res.status(200).send({
      status: 200,
      data: loan,
    });
  },
};

export default Loans;
