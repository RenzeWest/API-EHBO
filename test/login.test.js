const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const tracer = require('tracer');

// Voor de database
const pool = require('../src/doa/sql-database');
const sql = require('mssql');

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/login';

describe ('UC: Login Tests', () => {

    // This will run before each "it"
    // beforeEach((done) => {
    //     prepareDatabase().then(() => done()).catch(err => {
    //         logger.error('Error whilst preparing database '+ err);
    //         done(err)
    //     });
    // });

    beforeEach(async () => {
        await prepareDatabase();
    });

    // Controleerd of je kan inloggen
    it('TC 1: User Succesfully logged in', (done) => {
        chai.request(server)
        .post(endpointToTest)
        .send({
            password: 'evenMoreSecretPassword!!!!',
            emailaddress: 'rg.westerink@student.avans.nl'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
            
            const body = res.body;
            chai.expect(body).to.have.property('status').that.is.a('number').equals(200);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('User has succesfully logged in');
            chai.expect(body).to.have.property('data').that.is.a('object').is.not.empty;
            
            const data = body.data;
            chai.expect(data).to.have.property('UserId').that.is.a('number').and.not.null;
            chai.expect(data).to.have.property('Permissions').that.is.a('string').and.not.empty;
            chai.expect(data).to.have.property('SessionToken').that.is.a('string').and.not.empty;

            done();
        });
    });

    // Controleerd of je niet kan inloggen als er geen emailaddress is meegegeven
    it('TC 2: No email entered', (done) => {
        chai.request(server)
        .post(endpointToTest)
        .send({
            password: 'evenMoreSecretPassword!!!!'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body;
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing emailaddress');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty

            done();
        });
    });
    
    // Controleer of je niet kan inloggen als er geen password is meegegeven
    it('TC 3: No password entered', (done) => {
        chai.request(server)
        .post(endpointToTest)
        .send({
            emailaddress: 'evenMoreSecretPassword!!!!'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body;
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing password');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;

            done();
        });
    });


    it('TC 4: User does not exist', (done) => {
        chai.request(server)
        .post(endpointToTest)
        .send({
            emailaddress: 'evenMoreSecretPassword!!!!',
            password: 'jfdjgnjweijfkfvehrugaersdfgafirovegrr4wgon84v943uettf34u4nnutgwf344u8n8q34fwea8uurq4g9n8fwedvf48wrngfds84wfh8nefsudta438fwe8rnq2r8few89rfnu89488rf4ny8ny8n2yfn88r98y9qrfh98qrfh98h98rqf44h9qr4fh9rh8f9h89rwfeh98rweh98sdu9auweygfydsucufwresfyawuesrdarf7ya4wes'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(404);
            
            const body = res.body;
            chai.expect(body).to.have.property('status').that.is.a('number').equals(404);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('User not found or password invalid');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;

            done();
        });
    });

    it('TC 5: Incorrect password does not exist', (done) => {
        chai.request(server)
        .post(endpointToTest)
        .send({
            emailaddress: 'rg.westerink@student.avans.nl',
            password: 'banaan is niet het juiste wachtwoord'
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(404);
            
            const body = res.body;
            chai.expect(body).to.have.property('status').that.is.a('number').equals(404);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('User not found or password invalid');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;

            done();
        });
    });

    

});

async function prepareDatabase() {

    if(!pool.connected) {
        await pool.connect();
    }

    try {
        const result = await pool.request().query("SELECT * FROM Member WHERE Emailaddress = 'rg.westerink@student.avans.nl' AND Password = 'evenMoreSecretPassword!!!!'");

        if (result.recordset[0].lenght === 0) {
            // HET IS NIET GOED, VOEG IEMAND TOE!!!!!!!!
        } else {
            // HET IS GOED
        }

    } catch (error) {
        console.error(error)
    }
    // Voor succes login check if user aanwezig is: zo nee voeg toe

    // Voor fail, check of user niet aanwezig is: is ie het wel, verwijder

}