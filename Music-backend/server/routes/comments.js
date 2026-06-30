const express = require('express');
const { getComments, addComment, updateComment, deleteComment, likeComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createCommentSchema, updateCommentSchema } = require('../validations/commentValidation');

const router = express.Router({ mergeParams: true });

router.get('/', getComments);
router.post('/', protect, validate(createCommentSchema), addComment);

module.exports = router;

const commentRouter = express.Router();

commentRouter.put('/:id', protect, validate(updateCommentSchema), updateComment);
commentRouter.delete('/:id', protect, deleteComment);
commentRouter.post('/:id/like', protect, likeComment);

module.exports.commentRoutes = commentRouter;
