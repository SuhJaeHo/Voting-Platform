const express = require("express");
const votingsController = require("../controllers/votings.controller");

const router = express.Router();

router.get("/new", async(req, res, next) => {
  res.render("createVote", { message: null });
});

router.post("/new", votingsController.createVoting);

router.get("/:id", votingsController.readVoting);

module.exports = router;
