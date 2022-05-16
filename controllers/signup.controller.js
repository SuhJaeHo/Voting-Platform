const User = require("../models/User");
const bcrypt = require("bcrypt");
const { messages } = require("../constants/messages");
const saltSize = 10;

exports.createUser = async(req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (user) {
      return res.render("signup", { message: messages.isRegisteredEmail });
    }

    bcrypt.hash(password, saltSize, async(err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      await User.create({
        email,
        password: hashedPassword,
      });

      return res.render("login", { message: null });
    })
  } catch (err) {
    next(err);
  }
}
