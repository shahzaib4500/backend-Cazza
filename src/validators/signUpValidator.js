import { isString } from "../utils/helperfunction";
import { validateEmail } from "../utils/helperfunction";

module.exports = function signUpValidator(req, res, next) {
  const { email, password, name } = req.body || {};
  const errors = [];

  if (!isString(email)) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (!isString(password)) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (password.length < 8) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters",
    });
  }

  if (name !== undefined && (!isString(name) || name.length < 2)) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters if provided",
    });
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  next();
};
