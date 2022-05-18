const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");

require("dotenv").config();

const index = require("./routes/index");
const signup = require("./routes/signup");
const login = require("./routes/login");
const logout = require("./routes/logout");
const votings = require("./routes/votings");
const myVotings = require("./routes/my-votings");

const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport");
passportConfig(passport);

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL, { dbName: "Voting-Platform" })
  .then(() => console.log("mongoDB connected"))
  .catch(e => console.log(e));

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", index);
app.use("/login", login);
app.use("/logout", logout);
app.use("/signup", signup);
app.use("/votings", votings);
app.use("/my-votings", myVotings);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
