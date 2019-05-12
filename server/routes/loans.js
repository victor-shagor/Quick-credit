import express from 'express';
import Loan from '../controllers/loans';
import validate from '../middleware/validation';
import Auth from '../middleware/auth';

const loanRouter = express.Router();

const {
  verifyStatus, verifyId, verifyAdmin, verifyLoanId, verifyAmount, verifyFields,
} = validate;
const {
  getLoanById, getLoans, getRepaymentById, create, approve, repayment,
} = Loan;
const { verifyToken } = Auth;

loanRouter.route('/api/v1/loans/:loanId').get(verifyToken, verifyAdmin, verifyLoanId, getLoanById);
loanRouter.route('/api/v1/loans').get(verifyToken, verifyAdmin, getLoans);
loanRouter.route('/api/v1/loans/:loanId/repayments').get(verifyToken, verifyId, getRepaymentById);
loanRouter.route('/api/v1/loans').post(verifyToken, verifyFields, create);

export default loanRouter;
