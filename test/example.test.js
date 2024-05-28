const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const tracer = require('tracer')

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/';

// Voorbeeld test
describe ('UC-nr Example Test', () => {

    // This will run before each "it"
    beforeEach((done) => {
        console.log("before each ran");
        done();
    });

    it('TC-nr-nr Example sub test case', (done) => {
        chai.request(server)
        .get(endpointToTest)
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(200);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Hello World');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

});