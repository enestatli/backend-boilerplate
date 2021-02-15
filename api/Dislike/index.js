const DislikeModel = require('../../db/models/disLike');
const LikeModel = require('../../db/models/like');

const { logger } = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { protectWithApiKey } = require('../../middleware/protectWithApiKey');

class Dislike {
  constructor(router) {
    this.router = router;
    this.dislikeRoutes();
  }

  dislikeRoutes() {
    this.router.get(
      '/dislike/up',
      protectWithApiKey,
      // requireAuth,
      this.dislike.bind(this)
    );
    this.router.get(
      '/dislike/down',
      protectWithApiKey,
      // requireAuth,
      this.unDislike.bind(this)
    );
    this.router.get(
      '/dislikes/down',
      protectWithApiKey,
      // requireAuth,
      this.getDislikes.bind(this)
    );
  }

  async getDislikes(req, res) {
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

    DislikeModel.find(variable).exec((err, dislike) => {
      if (err) {
        res.sendStatus(400);
        return;
      }
      res.json({ dislikes, status: 200 });
    });
  }

  async unDislike(req, res) {
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

    DislikeModel.findOneAndDelete(variable).exec((err, result) => {
      if (err) {
        res.sendStatus(400);
        return;
      }
      res.sendStatus(200);
    });
  }

  async dislike(req, res) {
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

    const dislike = new DislikeModel(variable);

    const savedDislike = await dislike.save();

    if (!savedDislike) {
      res.sendStatus(999);
      return;
    }

    //In case Like Button is already clicked, we need to decrease the like by 1
    Like.findOneAndDelete(variable).exec((err, result) => {
      if (err) {
        res.sendStatus(400);
        return;
      }
      res.sendStatus(200);
    });
  }
}

module.exports = { Dislike };
