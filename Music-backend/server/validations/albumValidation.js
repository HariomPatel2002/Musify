const Joi = require('joi');

const createAlbumSchema = Joi.object({
  title: Joi.string().trim().max(200).required().messages({
    'any.required': 'Album title is required',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  releaseYear: Joi.number().min(1900).max(2100).optional(),
  genre: Joi.string().allow('').optional(),
  isPublic: Joi.boolean().optional(),
});

const updateAlbumSchema = Joi.object({
  title: Joi.string().trim().max(200).optional(),
  releaseYear: Joi.number().min(1900).max(2100).optional(),
  genre: Joi.string().allow('').optional(),
  isPublic: Joi.boolean().optional(),
}).min(1);

const addSongToAlbumSchema = Joi.object({
  songId: Joi.string().required().messages({
    'any.required': 'Song ID is required',
  }),
});

module.exports = { createAlbumSchema, updateAlbumSchema, addSongToAlbumSchema };
