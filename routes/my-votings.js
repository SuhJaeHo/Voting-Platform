const express = require("express");
const myVotingsController = require("../controllers/my-votings.controller");

const router = express.Router();

router.get("/", myVotingsController.getMyVoting);

module.exports = router;
