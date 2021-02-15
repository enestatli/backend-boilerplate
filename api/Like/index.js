const DislikeModel = require('../../db/models/disLike');
const LikeModel = require('../../db/models/like');

const { logger } = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { protectWithApiKey } = require('../../middleware/protectWithApiKey');

class Like {
  constructor(router) {
    this.router = router;
    this.likeRoutes();
  }

  likeRoutes() {
    this.router.get(
      '/like/up',
      protectWithApiKey,
      // requireAuth,
      this.unlike.bind(this)
    );
    this.router.get(
      '/like/down',
      protectWithApiKey,
      // requireAuth,
      this.like.bind(this)
    );
    this.router.get(
      '/likes',
      protectWithApiKey,
      // requireAuth,
      this.getLikes.bind(this)
    );
  }

  async getLikes(req, res) {
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

    LikeModel.find(variable).exec((err, likes) => {
      if (err) {
        res.sendStatus(400);
        return;
      }
      res.json({ likes, status: 200 });
    });
  }

  async unlike(req, res) {
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

  async like(req, res) {
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

    DislikeModel.findOneAndDelete(variable).exec((err, result) => {
      if (err) {
        res.sendStatus(400);
        return;
      }
      res.sendStatus(200);
    });
  }
}

module.exports = { Like };
