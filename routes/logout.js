const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  req.logOut();
  req.session.destroy(function (err) {
    if(err) next(err);
    res.redirect("/login");
  })
});

module.exports = router;
