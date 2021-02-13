const CommentModel = require('../../db/models/comment');
const { logger } = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { protectWithApiKey } = require('../../middleware/protectWithApiKey');

class Comment {
  constructor(router) {
    this.router = router;
    this.authRoutes();
  }

  authRoutes() {
    this.router.post(
      '/comment/saveComment',
      protectWithApiKey,
      // requireAuth,
      this.saveComment.bind(this)
    );
  }

  async saveComment(req, res) {
    if (!req.body) {
      res.sendStatus(400); // missing body
      return;
    }

    const comment = new CommentModel(req.body);

    try {
      if (!comment) {
        res.sendStatus(999); // TODO: status code should be changed
        return;
      }

      const savedComment = await comment.save();

      if (!savedComment) {
        res.sendStatus(999); // TODO: status code should be changed
        return;
      }

      CommentModel.find({ _id: comment._id })
        .populate('writer')
        .exec((err, result) => {
          if (err) {
            res.json({ success: false, err });
            return;
          }
          return res.status(200).json({ success: true, result });
        });
    } catch (error) {
      logger.error(__dirname + '\\index.js', error);
      res.sendStatus(500);
    }
  }
}

module.exports = { Comment };
