const express = require("express");
const myVotingsController = require("../controllers/my-votings.controller");

const router = express.Router();

module.exports = router;

router.get("/", myVotingsController.getMyVoting);
