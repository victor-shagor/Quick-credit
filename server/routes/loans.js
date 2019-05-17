import express from 'express';
import Loan from '../controllers/loans';
import validate from '../middleware/validation';
import Auth from '../middleware/auth';

const loanRouter = express.Router();

const {
  verifyStatus, verifyId, verifyLoanId, verifyAmount, verifyFields, validateQuery,
} = validate;
const {
  getLoanById, getLoans, getRepaymentById, create, approve, repayment,
} = Loan;
const { verifyToken, verifyAdmin } = Auth;

loanRouter.route('/api/v1/loans/:loanId').get(verifyAdmin, verifyLoanId, getLoanById);
loanRouter.route('/api/v1/loans').get(validateQuery, verifyAdmin, getLoans);
loanRouter.route('/api/v1/loans/:loanId/repayments').get(verifyToken, verifyId, getRepaymentById);
loanRouter.route('/api/v1/loans').post(verifyToken, verifyFields, create);
loanRouter.route('/api/v1/loans/:loanId').patch(verifyAdmin, verifyStatus, approve);
loanRouter.route('/api/v1/loans/:loanId/repayment').post(verifyAdmin, verifyAmount, repayment);

export default loanRouter;
