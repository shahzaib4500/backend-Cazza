export function isString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export function validateEmail(email) {
  // simple, permissive email regex
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
