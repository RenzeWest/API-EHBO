const chai = require("chai");
chai.should();
const express = require("express");
const router = express.Router();
const memberContoller = require("../controllers/member.controller");
const validateToken = require("../routes/login.routes").validateToken;

router.get("/api/member", validateToken, memberContoller.getMember);

module.exports = router;
