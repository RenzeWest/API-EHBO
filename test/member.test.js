const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const tracer = require('tracer')

const jwt = require(`jsonwebtoken`)
const jwtSecretKey = require('../src/util/config').secretkey

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/member';

// Voorbeeld test
describe ('UC Member Tests', () => {

    it('TC-1 Member Exists', (done) => {
        const token = jwt.sign({ userId: 4 }, jwtSecretKey);
        
        chai.request(server)
        .get(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(200);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('User found with id 4');
            chai.expect(body).to.have.property('data').that.is.a('object').is.not.empty;
            const data = body.data;
            chai.expect(data).to.have.property('UserId').that.is.a('string').equals('4');
            chai.expect(data).to.have.property('FirstName').that.is.a('string').equals('Renze');
            chai.expect(data).to.have.property('LastName').that.is.a('string').equals('Westerink');
            chai.expect(data).to.have.property('Emailaddress').that.is.a('string').equals('rg.westerink@student.avans.nl');
            chai.expect(data).to.have.property('Password').that.is.a('string').equals('evenMoreSecretPassword!!!!');
            chai.expect(data).to.have.property('PhoneNumber').that.is.a('string').equals('06-29158683');
            chai.expect(data).to.have.property('Street').that.is.a('string').equals('Verlende Witmoeren');
            chai.expect(data).to.have.property('HouseNr').that.is.a('string').equals('10');
            chai.expect(data).to.have.property('PostCode').that.is.a('string').equals('4823 JZ');
            chai.expect(data).to.have.property('City').that.is.a('string').equals('Breda');
            chai.expect(data).to.have.property('Role').that.is.a('string').equals('Hulpverlener!Coordinator');
            chai.expect(data).to.have.property('DateOfBirth').that.is.a('string').equals('2006-05-28T00:00:00.000Z');
            chai.expect(data).to.have.property('Gender').that.is.a('string').equals('Male');
            chai.expect(data).to.have.property('InvoiceStreet');
            chai.expect(data).to.have.property('InvoiceHouseNr');
            chai.expect(data).to.have.property('InvoiceCity');
            chai.expect(data).to.have.property('InvoiceEmail');
            
            done()
        });
    });

    it('TC-2 Not authorized', (done) => {
        const token = jwt.sign({ userId: 4 }, jwtSecretKey);
        
        chai.request(server)
        .get(endpointToTest)
        .set('Authorization', `bearer ${token}1`)
        .end((err, res) => {
            chai.expect(res).to.have.status(401);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(401);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Not authorized');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

});