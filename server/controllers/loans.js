import dbloans from '../model/dbLoans';
import dbrepayment from '../model/dbRepayment';
import Message from '../Helper/responseMessage';

const Loans = {
  /**
  * @description Retrieves a single specified loan
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} A specified loan
  */
  getLoanById(req, res) {
    const loan = dbloans.find(user => user.loanId === parseInt(req.params.loanId));
    if (loan.status === 'pending') {
      return res.status(200).send(
        Message.message(200, loan),
      );
    }
  },
  /**
  * @description Retrieves all loans
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} A all loans
  */
  getLoans(req, res) {
    const { status, repaid } = req.query;
    if (status === 'approved' && repaid === 'false') {
      const loan = dbloans.filter(user => user.status === 'approved' && user.repaid === false);
      return res.status(200).send(
        Message.message(200, loan),
      );
    }
    if (status === 'approved' && repaid === 'true') {
      const loan = dbloans.filter(user => user.status === 'approved' && user.repaid === true);
      return res.status(200).send(
        Message.message(200, loan),
      );
    }
    if (!status || !repaid) {
      const loan = dbloans.filter(user => user.status === 'pending');
      return res.status(200).send(
        Message.message(200, loan),
      );
    }
  },
  /**
  * @description Retrieves a specific loan repayment
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} A a single loan repayment
  */
  getRepaymentById(req, res) {
    const loan = dbrepayment.find(user => user.loanId === parseInt(req.params.loanId));
    return res.status(200).send(
      Message.message(200, loan),
    );
  },
  /**
  * @description creates a loan request
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object}  loan details
  */
  create(req, res) {
    const amount = parseInt(req.body.amount);
    const tenor = parseInt(req.body.tenor);
    const interest = amount * (5 / 100);
    const { firstName, lastName, email } = req.body;
    const data = {
      loanId: dbloans.length + 1,
      firstName,
      lastName,
      email,
      tenor,
      amount,
      paymentInstallmant: (amount + interest) / tenor,
      status: 'pending',
      balance: amount,
      interest,
    };

    dbloans.push(data);
    res.status(201).send(
      Message.message(201, data),
    );
  },
  /**
  * @description Approves a loan request
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} details of the approved loan
  */
  approve(req, res) {
    const loan = dbloans.find(user => user.loanId === parseInt(req.params.loanId));
    loan.status = 'approved';
    return res.status(200).send(
      Message.message(200, loan),
    );
  },
  /**
  * @description create a loan repayment
  * @param {object} req request parameter
  * @param {object} res response object {status, data}
  * @returns {object} details of the loan repayment
  */
  repayment(req, res) {
    const { loanId } = req.params;
    const paidAmount = parseInt(req.body.paidAmount);
    const loans = dbloans.find(result => result.loanId === parseInt(loanId));
    const data = {
      id: dbrepayment.length + 1,
      loanId: parseInt(loanId),
      createdOn: new Date(),
      amount: loans.amount,
      monthlyInstallment: loans.paymentInstallmant,
      paidAmount,
      balance: loans.balance - paidAmount,
    };
    dbrepayment.push(data);
    return res.status(201).send(
      Message.message(201, data),
    );
  },
};

export default Loans;
