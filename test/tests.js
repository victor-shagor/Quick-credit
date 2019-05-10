import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

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
        res.body.error.should.equal('Access Denied, Token is not provided')
        done();
      });
  });
});
