const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const tracer = require('tracer')
const pool = require('../src/doa/sql-database');
const logger = require('../src/util/logger');

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/update';

let validToken = ''
const invalidtoken ='invalidToken'



// Voorbeeld test
describe ('User update test', () => {

    before((done) => {
        console.log('before')
        chai.request(server)
        .post('/api/login')
        .send({
            password: 'secretPassword',
            emailaddress: 'janmetlangeachternaam@email.com'
        })
        .end((err, res) => {
            if (err) {
                console.error('Error obtaining token:', err);
                done(err);
            } else {
                validToken = 'Bearer ' + res.body.data.SessionToken;
                done();
            }
        })  
    })




    it('Missing required field', (done) => {
        chai.request(server)
        .put(endpointToTest)
        .set('Authorization', validToken)
        .send({
            firstName: 'Jan',
            lastName: 'lastName',
            emailaddress: 'janmetlangeachternaam@email.com',
            password: 'secretPassword',
            //phoneNumber: '06-12345978',
            street: 'straat',
            number: '10',
            postCode: '1234AB',
            city: 'Breda',
            role: 'Hulpverlener',
            dateOfBirth: '1970-10-10',
            gender: 'M'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Required field missing');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            
            done()
        });
    });

    
    it('User is not owner of data', (done) => {
        chai.request(server)
        .put(endpointToTest)
        .set('Authorization', invalidtoken)
        .send({
            firstName: 'Jan',
            lastName: 'lastName',
            emailaddress: 'janmetlangeachternaam@email.com',
            password: 'secretPassword',
            phoneNumber: '06-12345978',
            street: 'straat',
            number: '10',
            postCode: '1234AB',
            city: 'Breda',
            role: 'Hulpverlener',
            dateOfBirth: '1970-10-10',
            gender: 'M'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(401);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(401);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Not authorized');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            
            done()
        });
    });

    it.skip('invalid phonenumber', (done) => {
        chai.request(server)
        .put(endpointToTest)
        .set('Authorization', invalidtoken)
        .send({
            firstName: 'Jan',
            lastName: 'lastName',
            emailaddress: 'janmetlangeachternaam@email.com',
            password: 'secretPassword',
            phoneNumber: '065978',
            street: 'straat',
            number: '10',
            postCode: '1234AB',
            city: 'Breda',
            role: 'Hulpverlener',
            dateOfBirth: '1970-10-10',
            gender: 'M'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(401);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(401);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Invalid phonenumber');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            
            done()
        });
    });

    it('Not logged in', (done) => {
        chai.request(server)
        .put(endpointToTest)
        .send({
            firstName: 'Jan',
            lastName: 'lastName',
            emailaddress: 'janmetlangeachternaam@email.com',
            password: 'secretPassword',
            phoneNumber: '06-12345978',
            street: 'straat',
            number: '10',
            postCode: '1234AB',
            city: 'Breda',
            role: 'Hulpverlener',
            dateOfBirth: '1970-10-10',
            gender: 'M'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(401);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(401);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Authorization header missing');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            
            done()
        });
    });

    it('User succesfully changed', (done) => {
        chai.request(server)
        .put(endpointToTest)
        .set('Authorization', validToken)
        .send({
              firstName: 'Jan',
              lastName: 'lastName',
              emailaddress: 'janmetlangeachternaam@email.com',
              password: 'secretPassword',
              phoneNumber: '06-12345978',
              street: 'straat',
              number: '10',
              postCode: '1234AB',
              city: 'Breda',
              role: 'Hulpverlener',
              dateOfBirth: '1970-10-10',
              gender: 'M'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(200);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('User updated');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            
            done()
        });
    });

    after(async () => {
        try {
            if (!pool.connected) {
                await pool.connect();
            }
            const request = pool.request();
            const result = await request.query("UPDATE Member SET City = 'Utrecht' WHERE Emailaddress = 'janmetlangeachternaam@email.com'");
        } catch (err) {
            logger.error('Error resetting dummy data', err)
        }
        
    });

});
