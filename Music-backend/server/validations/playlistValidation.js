const Joi = require('joi');

const createPlaylistSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    'any.required': 'Playlist name is required',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  description: Joi.string().max(500).allow('').optional(),
  isPublic: Joi.boolean().optional(),
});

const updatePlaylistSchema = Joi.object({
  name: Joi.string().trim().max(100).optional(),
  description: Joi.string().max(500).allow('').optional(),
  isPublic: Joi.boolean().optional(),
}).min(1);

const addSongToPlaylistSchema = Joi.object({
  songId: Joi.string().required().messages({
    'any.required': 'Song ID is required',
  }),
});

module.exports = { createPlaylistSchema, updatePlaylistSchema, addSongToPlaylistSchema };
