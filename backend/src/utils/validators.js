const Joi = require('joi');

// Client validation schemas
const clientValidation = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required().trim(),
    email: Joi.string().email().required().trim().lowercase(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required().trim(),
    property_interest: Joi.string().valid(
      '1BR_APARTMENT',
      '2BR_APARTMENT', 
      '3BR_APARTMENT',
      'VILLA',
      'STUDIO',
      'DUPLEX',
      'PENTHOUSE',
      'COMMERCIAL'
    ).optional(),
    budget_range: Joi.string().pattern(/^\d+-\d+$/).optional(), // e.g., "500000-800000"
    source: Joi.string().valid(
      'website_form',
      'manual_entry',
      'referral',
      'phone_call',
      'social_media',
      'advertisement'
    ).default('manual_entry'),
    notes: Joi.string().max(500).optional().trim()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional().trim(),
    email: Joi.string().email().optional().trim().lowercase(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional().trim(),
    property_interest: Joi.string().valid(
      '1BR_APARTMENT',
      '2BR_APARTMENT',
      '3BR_APARTMENT', 
      'VILLA',
      'STUDIO',
      'DUPLEX',
      'PENTHOUSE',
      'COMMERCIAL'
    ).optional(),
    budget_range: Joi.string().pattern(/^\d+-\d+$/).optional(),
    status: Joi.string().valid('LEAD', 'PROSPECT', 'ACTIVE', 'CLOSED').optional(),
    notes: Joi.string().max(500).optional().trim()
  }).min(1) // At least one field must be updated
};

// Contact form validation
const contactFormValidation = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required().trim(),
  property_interest: Joi.string().required(),
  budget_range: Joi.string().optional(),
  message: Joi.string().max(1000).optional().trim(),
  preferred_contact_method: Joi.string().valid('email', 'phone', 'whatsapp').default('email')
});

// Generic validation function
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false, // Return all validation errors
    stripUnknown: true // Remove unknown fields
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context.value
    }));
    return { isValid: false, errors, data: null };
  }

  return { isValid: true, errors: null, data: value };
};

// Validation middleware factory
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { isValid, errors, data } = validate(schema, req.body);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Replace request body with validated and cleaned data
    req.body = data;
    next();
  };
};

module.exports = {
  clientValidation,
  contactFormValidation,
  validate,
  validateMiddleware
};
