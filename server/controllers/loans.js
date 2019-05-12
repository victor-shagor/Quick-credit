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
  create(req, res) {
    const amount  = parseInt(req.body.amount);
    const tenor = parseInt(req.body.tenor)
    const interest = amount * (5 / 100);
    const data = {
      loanId: dbloans.length + 1,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      tenor,
      amount,
      paymentInstallmant: (amount + interest) / tenor,
      status: 'pending',
      balance: amount,
      interest,
    };
   
    dbloans.push(data);
    res.status(201).send({
      status: 201,
      data,
    });
   },
};

export default Loans;
