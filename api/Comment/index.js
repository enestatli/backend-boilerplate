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
      '/comment/add',
      protectWithApiKey,
      // requireAuth,
      this.addComment.bind(this)
    );
    this.router.get(
      '/comments/:postId',
      protectWithApiKey,
      // requireAuth,
      this.getComments.bind(this)
    );
  }

  async addComment(req, res) {
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
            res.sendStatus(400);
            return;
          }
          res.json({ status: 200, result });
        });
    } catch (error) {
      logger.error(__dirname + '\\index.js', error);
      res.sendStatus(500);
    }
  }

  async getComments(req, res) {
    if (!req || !req.params || !req.params.postId) {
      res.sendStatus(422); // unprocessable entity
      return;
    }

    CommentModel.find({ postId: req.params.postId })
      .populate('writer')
      .exec((err, comments) => {
        if (err) {
          res.sendStatus(400);
          return;
        }
        res.json({ status: 200, comments });
      });
  }
}

module.exports = { Comment };

//TODO: getting number of comments should be limited per page
