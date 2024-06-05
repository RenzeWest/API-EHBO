const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const tracer = require("tracer");

// Voor de database
const pool = require("../src/doa/sql-database");
const sql = require("mssql");

chai.should();
chai.use(chaiHttp);
tracer.setLevel("warn");

const endpointToTest = "/api/create";

describe("UC: Create Project Tests", () => {
	beforeEach(async () => {
		console.log("Before each test");
	});
	it("TC 1: Project Succesfully created", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "08-01-2025",
				title: "Test",
				currentdate: "01-01-2025",
				beginTime: "12:00",
				endTime: "14:00",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(200);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Project has succesfully created");
				chai.expect(body).to.have.property("data").that.is.a("object").is.not.empty;
				done();
			});
	});
	it("TC 2: Project not created because of missing company", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				description: "Dit is een test",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "2021-13-01",
				title: "Test",
				currentdate: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing company");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 3: Project not created because of missing description", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "2021-13-01",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing description");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 4: Project not created because of missing city", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "2021-13-01",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing city");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 5: Project not created because of missing adress", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				city: "Breda",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "2021-13-01",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing adress");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 6: Project not created because of missing contactperson", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "2021-13-01",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing contactperson");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 7: Project not created because of missing contactemail", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "2021-13-01",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing contactemail");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 8: Project not created because of missing phonenumber", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				landlinenumber: "0761234567",
				housenumber: "108",
				date: "2021-13-01",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing phonenumber");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 9: Project not created because of missing housenumber", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				date: "2021-13-01",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing housenumber");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("TC 10: Project not created because of missing date", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				company: "Avans",
				description: "Dit is een test",
				city: "Breda",
				adress: "Hogeschoollaan",
				contactperson: "Rik",
				contactemail: "r.ik@student.avans.nl",
				phonenumber: "0612345678",
				landlinenumber: "0761234567",
				housenumber: "108",
				title: "Test",
				currentday: "2021-06-01",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing date");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
		it("TC 11: Project not created because of missing title", (done) => {
			chai.request(server)
				.post(endpointToTest)
				.send({
					company: "Avans",
					description: "Dit is een test",
					city: "Breda",
					adress: "Hogeschoollaan",
					contactperson: "Rik",
					contactemail: "r.ik@student.avans.nl",
					phonenumber: "0612345678",
					landlinenumber: "0761234567",
					housenumber: "108",
					date: "2021-13-01",
					currentday: "2021-06-01",
				})
				.end((err, res) => {
					chai.expect(res).to.have.status(400);
					const body = res.body;
					chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
					chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing title");
					chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
					done();
				});
		});
		it("TC 12: Project not created because of missing currentday", (done) => {
			chai.request(server)
				.post(endpointToTest)
				.send({
					company: "Avans",
					description: "Dit is een test",
					city: "Breda",
					adress: "Hogeschoollaan",
					contactperson: "Rik",
					contactemail: "r.ik@student.avans.nl",
					phonenumber: "0612345678",
					landlinenumber: "0761234567",
					housenumber: "108",
					date: "2021-13-01",
					title: "Test",
				})
				.end((err, res) => {
					chai.expect(res).to.have.status(400);
					const body = res.body;
					chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
					chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing currentday");
					chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
					done();
				});
		});
	});
});
