const Joi = require('joi');

const updateProfileSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).optional(),
  bio: Joi.string().max(500).allow('').optional(),
}).min(1);

const followUserSchema = Joi.object({}).optional();

module.exports = { updateProfileSchema, followUserSchema };
