const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const tracer = require('tracer')

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const jwt = require(`jsonwebtoken`)
const jwtSecretKey = require('../src/util/config').secretkey

const endpointToTest = '/api/addCourse';

// Voorbeeld test
describe ('UC Course Creation Tests', () => {

    // This will run before each "it"
    beforeEach((done) => {
        console.log("before each ran");
        done();
    });

    it('TC-1 Succesfully added a new course', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "title": "Test Cursus 1",
            "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            "datetime": "2024-10-12 14:30:00.000",
            "cost": "100.00",
            "maxParticipants": 10,
            "location": "Mooie Straatnaam 10",
            "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(200);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(200);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Course created');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

    it('TC-2 Missing title', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            // "title": "Test Cursus 1",
            "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            "datetime": "2024-10-12 14:30:00.000",
            "cost": "100.00",
            "maxParticipants": 10,
            "location": "Mooie Straatnaam 10",
            "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing title');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

    it('TC-3 Missing description', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "title": "Test Cursus 1",
            // "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            "datetime": "2024-10-12 14:30:00.000",
            "cost": "100.00",
            "maxParticipants": 10,
            "location": "Mooie Straatnaam 10",
            "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing description');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

    it('TC-4 Missing datetime', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "title": "Test Cursus 1",
            "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            // "datetime": "2024-10-12 14:30:00.000",
            "cost": "100.00",
            "maxParticipants": 10,
            "location": "Mooie Straatnaam 10",
            "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing datetime');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

    it('TC-5 Missing cost', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "title": "Test Cursus 1",
            "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            "datetime": "2024-10-12 14:30:00.000",
            // "cost": "100.00",
            "maxParticipants": 10,
            "location": "Mooie Straatnaam 10",
            "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing cost');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

    it('TC-6 Missing maxParticipants', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "title": "Test Cursus 1",
            "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            "datetime": "2024-10-12 14:30:00.000",
            "cost": "100.00",
            // "maxParticipants": 10,
            "location": "Mooie Straatnaam 10",
            "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing maxParticipants');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

    it('TC-7 Missing location', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "title": "Test Cursus 1",
            "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            "datetime": "2024-10-12 14:30:00.000",
            "cost": "100.00",
            "maxParticipants": 10,
            // "location": "Mooie Straatnaam 10",
            "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing location');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });

    it('TC-8 Missing certificationTitle', (done) => {
        const token = jwt.sign({ userId: 2 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "title": "Test Cursus 1",
            "description": "Dit is een beschrijving voor test cursus 1! Veel plezier met lezen, want dit is gewoon een heleboel onzin en je zal dus zelf plezier nodig hebben om je te kunnen vermaken. Nouja, altijd al een test cursus willen doen? Dat kan nu dus!... Niet... Daaag, dit is wel genoeg voorbeeld tekst, fijne dag nog!",
            "datetime": "2024-10-12 14:30:00.000",
            "cost": "100.00",
            "maxParticipants": 10,
            "location": "Mooie Straatnaam 10"
            // "certificatieTitle": "CPR-Certified"
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing certificatieTitle');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done()
        });
    });


});