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
