const Joi = require("joi");
const createError = require("http-errors");

exports.loginVerify = async(req, res, next) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown();

  try {
    schema.validateAsync({ email, password });
    next();
  } catch (err) {
    next(createError(400, "잘못된 입력값을 입력하셨습니다"));
  }
}

exports.signupVerify = async(req, res, next) => {
  const { email, password, username } = req.body;

  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
  }).unknown();

  try {
    schema.validateAsync({ email, password, username });
    next();
  } catch (err) {
    next(createError(400, "잘못된 입력값을 입력하셨습니다"));
  }
}
