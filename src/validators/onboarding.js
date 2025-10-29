import Joi from "joi";
import { handleValidationError } from "../utils/helperfunction.js";

// ===============================
// Joi Schema for Onboarding
// ===============================

const onboardingSchema = Joi.object({
  businessName: Joi.string().trim().required().messages({
    "any.required": "Business name is required",
    "string.empty": "Business name is required",
  }),

  businessEntityType: Joi.string()
    .valid(
      "sole-trader",
      "partnership",
      "limited-company",
      "llp",
      "charity",
      "other"
    )
    .required()
    .messages({
      "any.only": "Select a valid business entity type",
      "any.required": "Business entity type is required",
    }),

  annualRevenueBand: Joi.string()
    .valid("0-85k", "85k-750k", "750k-2m", "2m-5m", "5m-10m", "10m+")
    .required()
    .messages({
      "any.only": "Select a valid revenue band",
      "any.required": "Annual revenue band is required",
    }),

  marketplaces: Joi.array()
    .items(
      Joi.string().valid(
        "Amazon",
        "TikTok Shop",
        "WooCommerce",
        "Facebook Marketplace",
        "eBay",
        "Shopify",
        "Etsy",
        "Instagram Shopping",
        "Other"
      )
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Marketplaces must be an array",
      "array.min": "Select at least one marketplace",
      "any.required": "Marketplaces are required",
    }),

  techStack: Joi.object({
    useXero: Joi.boolean().required().messages({
      "any.required": "useXero flag is required",
    }),
    multipleCurrencies: Joi.boolean().required().messages({
      "any.required": "multipleCurrencies flag is required",
    }),
  }).required(),
});

// ===============================
// Middleware Function
// ===============================

export const validateOnboarding = (req, res, next) => {
  const { error, value } = onboardingSchema.validate(req.body, {
    abortEarly: false, // show all errors, not just the first
  });

  if (error) return handleValidationError(res, error);
  req.body = value;
  next();
};
