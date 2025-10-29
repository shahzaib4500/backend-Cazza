// ===============================
// Helper for validation errors
// ===============================
export const handleValidationError = (res, error) => {
  res.status(400).json({
    success: false,
    message: "Validation error",
    details: error.details.map((d) => d.message),
  });
};

export const verificationTemplate = (name, code) => `
  <h1>Hello ${name}</h1>
  <p>Here’s your verification code:</p>
  <h3 style="color:#E63946;">${code}</h3>
  <p>This code expires in 15 minutes.</p>
`;
