import express from 'express';
import Loan from '../controllers/loans';
import validate from '../middleware/validation';
import Auth from '../middleware/auth';
import loans from '../queries/loanQueries';
import dbvalidate from '../middleware/dbValidations';

const loanRouter = express.Router();

// const {
//   verifyStatus, verifyId, verifyLoanId, verifyAmount, verifyFields, validateQuery,
// } = validate;
// const {
//   getLoanById, getLoans, getRepaymentById, create, approve, repayment,
// } = Loan;
const {
  verifyStatus, verifyId, verifyLoanId, verifyAmount, verifyFields, validateQuery,
} = dbvalidate;
const {
  getLoanById, getLoans, getRepaymentById, create, approve, repayment,
} = loans;
const { verifyToken, verifyAdmin } = Auth;



export default loanRouter;
