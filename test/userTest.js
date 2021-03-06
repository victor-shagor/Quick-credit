import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);
chai.should();

describe('users', () => {
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
        firstName: 'abiola', email: '', lastName: 'ojo', password: '123', address: 'no 2,lagos',
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
        firstName: 'abiola', lastName: '', email: 'ojo@gmail.com', address: 'no 2,lagos',
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
  let token;
  it('should login a user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'ojoabiola@gmail.com', password: 'oladimeji1',
      })
      .end((err, res) => {
        token = res.body.data.token;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        done();
      });
  });
  let token1;
  it('should login a user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'temidayo@gmail.com', password: 'magretab1',
      })
      .end((err, res) => {
        token1 = res.body.data.token;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
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
        res.body.error.should.equal('Please provide token');
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
        'x-access-token': token,
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('Email is not registered');
        done();
      });
  });
  it('should not be able to change user status if user is already verified', (done) => {
    chai.request(app)
      .patch('/api/v1/users/ojoabiola@gmail.com/verify')
      .send({
        status: 'verified',
      })
      .set({
        'x-access-token': token,
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
        'x-access-token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('tenor');
        res.body.data.should.have.property('address');
        done();
      });
  });
  it('should not get loan without invalid parameter', (done) => {
    chai.request(app)
      .get('/api/v1/loans/33')
      .set({
        'x-access-token': token,
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('id is not in the database or id is not for a loan application');
        done();
      });
  });
  it('should get all running loans', (done) => {
    chai.request(app)
      .get('/api/v1/loans?status=approved&repaid=false')
      .set({
        'x-access-token': token,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
  it('should get all running loans', (done) => {
    chai.request(app)
      .get('/api/v1/loans?status=approved&repaid=false')
      .set({
        'x-access-token': token,
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
        'x-access-token': token,
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
        res.body.error.should.equal('Please provide token');
        done();
      });
  });
  it('should get loan repayment by id', (done) => {
    chai.request(app)
      .get('/api/v1/loans/12/repayments')
      .set({
        'x-access-token': token1,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('loanid');
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('paidamount');
        res.body.data.should.have.property('balance');
        done();
      });
  });
  it('should create a loan application', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        email: 'jesuseun@gmail.com', tenor: '3', amount: '50000',
      })
      .set({
        'x-access-token': token1,
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('loanid');
        res.body.data.should.have.property('amount');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('balance');
        done();
      });
  });
  it('should not be to create a loan application a valid email', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
        email: 'com', tenor: 3, amount: 50000,
      })
      .set({ 'x-access-token': token1 })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('please enter a valid email address');
        done();
      });
  });
  it('should not be to create a loan application without tenor', (done) => {
    chai.request(app)
      .post('/api/v1/loans')
      .send({
       email: 'ojo@gmail.com', tenor: '', amount: '50000',
      })
      .set({
        'x-access-token': token1,
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.equal('tenor and/or amount cannot be empty and must cotain a number, tenor cannot be more than 12');
        done();
      });
  });
});
