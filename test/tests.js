import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Helper from '../server/Helper/helper';

chai.use(chaiHttp);
chai.should();


describe('users', () => {
  it('should post a user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'abiola', lastName: 'ojo', email: 'ojo1@gmail.com', password: 'oladimeji1', address: 'no 2,lagos',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('password');
        res.body.data.should.have.property('address');
        done();
      });
  });
  it('should not create a user without a firstName ', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: '', lastName: 'ojo', email: 'ojo@gmail.com', password: '123', address: 'no 2,lagos',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not create a user without a lastName ', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'abiola', lastName: '', email: 'ojo1@gmail.com', password: '123', address: 'no 2,lagos',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');

        done();
      });
  });
  it('should not create a user without an email ', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'abiola', lastName: 'ojo', email: '', password: '123', address: 'no 2,lagos',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should not create a user without a password ', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'abiola', lastName: '', email: 'ojo@gmail.com', password: '', address: 'no 2,lagos',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should not create a user without an address ', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'abiola', lastName: '', email: 'ojo@gmail.com', password: '123', address: '',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should login a user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'ojo@gmail.com', password: 'olo1',
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('password');
        done();
      });
  });
  it('should not login a user without an email ', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: '', password: '123',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not login a user without a password ', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'abiola@gmail.com', password: '',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not be able to change user status without token', (done) => {
    chai.request(app)
      .patch('/api/v1/users/dayo@gmail.com/verify')
      .send({
        status: 'verified',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Access Denied, Token is not provided');
        done();
      });
  });
  it('should change user status', (done) => {
    chai.request(app)
      .patch('/api/v1/users/dayo@gmail.com/verify')
      .send({
        status: 'verified',
      })
      .set({ 'x-access-token': Helper.generateToken(1) })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('password');
        res.body.data.should.have.property('address');
        done();
      });
  });
  it('should not be able to change user status without signin', (done) => {
    chai.request(app)
      .patch('/api/v1/users/dayo@gmail.com/verify')
      .send({
        status: 'verified',
      })
      .set({
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU1NzYxODkxMywiZXhwIjoxNTU4MjIzNzEzfQ.rA7HObV85qkb7udUNzTArg06PNRP_ARfJT4YcNlbfUI',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Access Denied, you need to sign in to perform this operation');
        done();
      });
  });
  it('should not be able to change user status without a valid email', (done) => {
    chai.request(app)
      .patch('/api/v1/users/ab@gmail.com/verify')
      .send({
        status: 'verified',
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Email is not registered');
        done();
      });
  });
  it('should not be able to change user status if user is already verified', (done) => {
    chai.request(app)
      .patch('/api/v1/users/ojo@gmail.com/verify')
      .send({
        status: 'verified',
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Account as already being verified');
        done();
      });
  });
  it('should get loan by id', (done) => {
    chai.request(app)
      .get('/api/v1/loans/1')
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('tenor');
        res.body.data.should.have.property('address');
        done();
      });
  });
  it('should not get loan without invalid parameter', (done) => {
    chai.request(app)
      .get('/api/v1/loans/3')
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('id is not in the database or id is not for a loan application');
        done();
      });
  });
  it('should not be able to get loan without signin', (done) => {
    chai.request(app)
      .get('/api/v1/loans/3')
      .set({
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU1NzYxODkxMywiZXhwIjoxNTU4MjIzNzEzfQ.rA7HObV85qkb7udUNzTArg06PNRP_ARfJT4YcNlbfUI',
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Access Denied, you need to sign in to perform this operation');
        done();
      });
  });
  it('should get all running loans', (done) => {
    chai.request(app)
      .get('/api/v1/loans?status=approved&repaid=false')
      .set({
        'x-access-token': Helper.generateToken(1), 
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
  it('should get all repaid loans', (done) => {
    chai.request(app)
      .get('/api/v1/loans?status=approved&repaid=true')
      .set({
        'x-access-token': Helper.generateToken(1), 
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
  it('should get all loan application', (done) => {
    chai.request(app)
      .get('/api/v1/loans')
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
  it('should not be able to get all loans without token', (done) => {
    chai.request(app)
      .get('/api/v1/loans')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Access Denied, Token is not provided');
        done();
      });
  });
  it('should get loan repayment by id', (done) => {
    chai.request(app)
      .get('/api/v1/loans/1/repayments')
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('loanId');
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('paidAmount');
        res.body.data.should.have.property('balance');
        done();
      });
  });
  it('should not be able get loan repayment by id without a correct id', (done) => {
    chai.request(app)
      .get('/api/v1/loans/5/repayments')
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('id is not in the database');
        done();
      });
  });
  it('should not be able to get repayment without token', (done) => {
    chai.request(app)
      .get('/api/v1/loans/1/repayments')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Access Denied, Token is not provided');
        done();
      });
  });
  it('should create a loan application', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        firstName: 'okoko', lastName: 'bioko', email: 'ojomnmdm@gmail.com', tenor: '3', amount: '50000',
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('loanId');
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('balance');
        done();
      });
  });
  it('should not create a loan application without firstname', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        lastName: 'bioko', email: 'ojomnmdm@gmail.com', tenor: 3, amount: 50000,
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('The following field(s) is/are required');
        done();
      });
  });
  it('should not be to create a loan application', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        firstName: 'i', lastName: 'bioko', email: 'ojomnmdm@gmail.com', tenor: 3, amount: 50000,
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Your names can only be in alphabets and must contain atleast three characters');
        done();
      });
  });
  it('should not be to create a loan application', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        firstName: 'ider', lastName: 'bioko', email: 'com', tenor: 3, amount: 50000,
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('please enter a valid email address');
        done();
      });
  });
  it('should not be to create a loan application', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        firstName: 'ider', lastName: 'bioko', email: 'ojo@gmail.com', tenor: '', amount: '50000',
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('tenor and/or amount cannot be empty and must cotain a number, tenor cannot be more than 12');
        done();
      });
  });
  it('should approve loan application', (done) => {
    chai.request(app)
      .patch('/api/v1/loans/1')
      .send({
        status: 'approved',
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('firstName');
        res.body.data.should.have.property('lastName');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('loanId');
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('balance');
        done();
      });
  });
  it('should not approve loan application', (done) => {
    chai.request(app)
      .patch('/api/v1/loans/10')
      .send({
        status: 'approved',
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('loan id is not in the database');
        done();
      });
  });
  it('should not approve loan application', (done) => {
    chai.request(app)
      .patch('/api/v1/loans/3')
      .send({
        status: 'approved',
      })
      .set({
        'x-access-token': Helper.generateToken(1),
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Loan as already being approved');
        done();
      });
  });
  // it('should post a repayment', (done) => {
  //   chai.request(app)
  //     .post('/api/v1/loans/1/repayment')
  //     .send({
  //       paidAmount: '5000',
  //     })
  //     .set({
  //       'x-access-token': Helper.generateToken(1),
  //     })
  //     .end((err, res) => {
  //       res.should.have.status(201);
  //       res.body.should.have.property('data');
  //       res.body.data.should.have.property('loanId');
  //       res.body.data.should.have.property('amount');
  //       res.body.data.should.have.property('paidAmount');
  //       res.body.data.should.have.property('balance');
  //       done();
  //     });
  // });
  // it('should not post a repayment', (done) => {
  //   chai.request(app)
  //     .post('/api/v1/loans/10/repayment')
  //     .send({
  //       paidAmount: '5000',
  //     })
  //     .set({
  //       'x-access-token': Helper.generateToken(1),
  //     })
  //     .end((err, res) => {
  //       res.should.have.status(400);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('error');
  //       res.body.error.should.equal('loanId is not in the database or loanId is not for a running loan');
  //       done();
  //     });
  // });
  // it('should not post a repayment', (done) => {
  //   chai.request(app)
  //     .post('/api/v1/loans/1/repayment')
  //     .send({
  //       paidAmount: '',
  //     })
  //     .set({
  //       'x-access-token': Helper.generateToken(1),
  //     })
  //     .end((err, res) => {
  //       res.should.have.status(400);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('error');
  //       res.body.error.should.equal('paidAmount is required and it can only be a number');
  //       done();
  //     });
  // });
});
