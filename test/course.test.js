const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const tracer = require('tracer');
const pool = require('../src/doa/sql-database');

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const jwt = require(`jsonwebtoken`)
const jwtSecretKey = require('../src/util/config').secretkey

let endpointToTest = '/api/addCourse';

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

    after(async () => {
        try {
            if (!pool.connected) {
                await pool.connect();
            }
            const request = pool.request();
            const result = await request.query("DELETE FROM Course WHERE Title = 'Test Cursus 1';");
        } catch (err) {
            logger.error('Error resetting dummy data', err)
        }
        
    });

});

describe ('UC Enroll in course', () => {

    // This will run before each "it"
    beforeEach(async () => {
        endpointToTest = '/api/enrollCourse'

        try {
            if (!pool.connected) {
                await pool.connect();
            }
            const request = pool.request();
            const result = await request.query("INSERT INTO Enrollment (UserId, CourseId, DateOfEnrollment) VALUES(4, 20003, GETDATE());");
        } catch (err) {
            console.error('Error resetting dummy data', err.message);
        }
        
    });

    it('TC-1 Succesfully enrolled in a course', (done) => {
        const token = jwt.sign({ userId: 4 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "courseId": 1
        }).end((err, res) => {
            chai.expect(res).to.have.status(200);
            
            const body = res.body
            chai.expect(body).to.have.property('status').that.is.a('number').equals(200);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('enrollment created');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done();
        });
    });

    it('TC-2 Missing course ID ', (done) => {
        const token = jwt.sign({ userId: 4 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            // "courseId": 1
        }).end((err, res) => {
            chai.expect(res).to.have.status(400);
            
            const body = res.body;
            chai.expect(body).to.have.property('status').that.is.a('number').equals(400);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('Missing courseId');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done();
        });
    });

    it('TC-3 already enrolled ', (done) => {

        const token = jwt.sign({ userId: 4 }, jwtSecretKey);

        chai.request(server)
        .post(endpointToTest)
        .set('Authorization', `bearer ${token}`)
        .send({
            "courseId": 1
        }).end((err, res) => {
            chai.expect(res).to.have.status(500);
            
            const body = res.body;
            chai.expect(body).to.have.property('status').that.is.a('number').equals(500);
            chai.expect(body).to.have.property('message').that.is.a('string').equals('De gebruiker is al aangemeld bij deze cursus');
            chai.expect(body).to.have.property('data').that.is.a('object').is.empty;
            
            done();
        });
    });

    

    after(async () => {
        try {
            if (!pool.connected) {
                await pool.connect();
            }
            const request = pool.request();
            const result = await request.query("DELETE FROM Enrollment WHERE (userId = 4 AND courseId = 1) OR (userId = 4 AND courseId = 20003);");
        } catch (err) {
            logger.error('Error resetting dummy data', err);
        }
        
    });

});