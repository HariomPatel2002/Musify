const Joi = require('joi');

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(300).required().messages({
    'any.required': 'Comment text is required',
    'string.min': 'Comment cannot be empty',
    'string.max': 'Comment cannot exceed 300 characters',
  }),
});

const updateCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(300).required(),
});

module.exports = { createCommentSchema, updateCommentSchema };
