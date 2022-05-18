const express = require("express");
const votingsController = require("../controllers/votings.controller");
const { checkLogin } = require("../middlewares/checkLogin");

const router = express.Router();

router.get("/new", checkLogin, async(req, res, next) => {
  res.render("createVote", { message: null });
});

router.post("/new", votingsController.createVoting);

router.get("/success", async(req, res, next) => {
  res.render("success");
});

router.get("/:id", votingsController.readVoting);

router.post("/:id", votingsController.completeVoting);

router.delete("/delete/:id", votingsController.deleteVoting);

module.exports = router;
