import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();


describe('users', () => {
  describe('POST /', () => {
    it('should post a user', (done) => {
      chai.request(app)
        .post('/auth/signup/api/v1')
        .send({
          firstName: 'abiola', lastName: 'ojo', email: 'ojo@gmail.com', password: 'oladimeji1', address: 'no 2,lagos',
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
        .post('/auth/signup/api/v1')
        .send({
          firstName: '', lastName: 'ojo', email: 'ojo@gmail.com', password: '123', address: 'no 2,lagos',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should not create a user without a lastName ', (done) => {
      chai.request(app)
        .post('/auth/signup/api/v1')
        .send({
          firstName: 'abiola', lastName: '', email: 'ojo@gmail.com', password: '123', address: 'no 2,lagos',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');

          done();
        });
    });
    it('should not create a user without an email ', (done) => {
      chai.request(app)
        .post('/auth/signup/api/v1')
        .send({
          firstName: 'abiola', lastName: 'ojo', email: '', password: '123', address: 'no 2,lagos',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should not create a user without a password ', (done) => {
      chai.request(app)
        .post('/auth/signup/api/v1')
        .send({
          firstName: 'abiola', lastName: '', email: 'ojo@gmail.com', password: '', address: 'no 2,lagos',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should not create a user without an address ', (done) => {
      chai.request(app)
        .post('/auth/signup/api/v1')
        .send({
          firstName: 'abiola', lastName: '', email: 'ojo@gmail.com', password: '123', address: '',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
});
