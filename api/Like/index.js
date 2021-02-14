const DislikeModel = require('../../db/models/disLike');
const LikeModel = require('../../db/models/like');
const UserModel = require('../../db/models/user');
const CommentModel = require('../../db/models/comment');
const EntityModel = require('../../db/models/entity');

const { logger } = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { protectWithApiKey } = require('../../middleware/protectWithApiKey');

class Like {
  constructor(router) {
    this.router = router;
    this.authRoutes();
  }

  authRoutes() {
    this.router.get(
      '/like/up',
      protectWithApiKey,
      // requireAuth,
      this.upLike.bind(this)
    );
    this.router.get(
      '/like/down',
      protectWithApiKey,
      // requireAuth,
      this.upLike.bind(this)
    );
  }

  async downLike(req, res) {
    if (!req.query) {
      res.sendStatus(422);
      return;
    }

    let variable = {};

    if (req.query.entityId) {
      variable = { entityId: req.query.entityId, userId: req.query.userId };
    } else {
      variable = { commentId: req.query.commentId, userId: req.query.userId };
    }

    LikeModel.findOneAndDelete(variable).exec((err, result) => {
      if (err) {
        res.sendStatus(400);
        return;
      }
      res.sendStatus(200);
    });
  }

  async upLike(req, res) {
    if (!req.query) {
      res.sendStatus(422);
      return;
    }

    let variable = {};

    if (req.query.entityId) {
      variable = { entityId: req.query.entityId, userId: req.query.userId };
    } else {
      variable = { commentId: req.query.commentId, userId: req.query.userId };
    }

    const like = new LikeModel(variable);

    const savedLike = await like.save();

    if (!savedLike) {
      res.sendStatus(999);
      return;
    }

    DislikeModel.findOneAndDelete(variable).exec((err, dislikeResult) => {
      if (err) {
        res.sendStatus(400);
        return;
      }
      res.sendStatus(200);
    });
  }
}

module.exports = { Like };

//TODO: getting number of comments should be limited per page
