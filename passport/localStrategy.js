const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { messages } = require("../constants/messages");

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
  }, async(email, password, done) => {
    try {
      const user = await User.findOne({ email }).lean();

      if (user) {
        const result = await bcrypt.compare(password, user.password);

        if (result) {
          done(null, user);
        } else {
          done(null, false, { message: messages.incorrectPassword });
        }
      } else {
        done(null, false, { message: messages.notRegisteredEmail });
      }
    } catch (err) {
      done(err);
    }
  }));
}
