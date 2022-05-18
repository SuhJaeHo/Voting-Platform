const passport = require("passport");

exports.localLogin = async(req, res, next) => {
  const { from } = req.body;

  passport.authenticate("local", { failureRedirect: "/login" }, (authError, user, info) => {
    if (authError) {
      return next(authError);
    }

    if (!user) {
      return res.render("login", { message: info.message });
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        next(loginError);
      } else {
        (from !== "") ? res.redirect(from) : res.redirect("/"); 
      }
    })
  })(req, res, next);
}
