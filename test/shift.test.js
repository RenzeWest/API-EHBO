const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const tracer = require("tracer");

chai.should();
chai.use(chaiHttp);
tracer.setLevel("warn");

const endpointToTest = "/api/createshift";
describe("UC create shift ", () => {
	beforeEach(async () => {
		console.log("Before each test");
	});
	it("succesfully created shift", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				shiftId: "1",
				usderId: "1",
				shiftStartTime: "10:00:00",
				shiftEndTime: "12:00:00",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(200);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Shift created");
				chai.expect(body).to.have.property("data").that.is.a("object").is.not.empty;
				done();
			});
	});
	it("missing shiftId", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				usderId: "1",
				shiftStartTime: "10:00:00",
				shiftEndTime: "12:00:00",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing shiftId");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("missing userId", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				shiftId: "1",
				shiftStartTime: "10:00:00",
				shiftEndTime: "12:00:00",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing userId");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("missing shiftStartTime", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				shiftId: "1",
				userId: "1",
				shiftEndTime: "12:00:00",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing shiftStartTime");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
	it("missing shiftEndTime", (done) => {
		chai.request(server)
			.post(endpointToTest)
			.send({
				shiftId: "1",
				userId: "1",
				shiftStartTime: "10:00:00",
			})
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				const body = res.body;
				chai.expect(body).to.have.property("status").that.is.a("number").equals(400);
				chai.expect(body).to.have.property("message").that.is.a("string").equals("Missing shiftEndTime");
				chai.expect(body).to.have.property("data").that.is.a("object").is.empty;
				done();
			});
	});
});
