const Joi = require('joi');

const createSongSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'any.required': 'Song title is required',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  album: Joi.string().allow(null, '').optional(),
  genre: Joi.string().allow('').optional(),
  duration: Joi.number().min(0).optional(),
  lyrics: Joi.string().allow('').optional(),
  isPublic: Joi.boolean().optional(),
});

const updateSongSchema = Joi.object({
  title: Joi.string().trim().max(200).optional(),
  genre: Joi.string().allow('').optional(),
  duration: Joi.number().min(0).optional(),
  lyrics: Joi.string().allow('').optional(),
  isPublic: Joi.boolean().optional(),
  album: Joi.string().allow(null, '').optional(),
}).min(1);

module.exports = { createSongSchema, updateSongSchema };
