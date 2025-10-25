import { isString } from "../utils/helperfunction";
import { validateEmail } from "../utils/helperfunction";

module.exports = function signInValidator(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!isString(email)) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (!isString(password)) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};
