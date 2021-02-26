const EntityModel = require('../../db/models/entity');
const log = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { protectWithApiKey } = require('../../middleware/protectWithApiKey');

class Entity {
  constructor(router) {
    this.router = router;
    this.authRoutes();
  }

  authRoutes() {
    this.router.post(
      '/entity/add',
      protectWithApiKey,
      // requireAuth,
      this.addEntity.bind(this)
    );
    this.router.get(
      '/entities',
      protectWithApiKey,
      // requireAuth,
      this.getEntities.bind(this)
    );
    this.router.get(
      '/entity/:entityId',
      protectWithApiKey,
      // requireAuth,
      this.getEntity.bind(this)
    );
  }

  async addEntity(req, res) {
    if (!req.body) {
      res.sendStatus(400); // missing body
      return;
    }

    const entity = new EntityModel(req.body);

    try {
      if (!entity) {
        res.sendStatus(999); // TODO: status code should be changed
        return;
      }

      if (entity.description.length > 200) {
        res.sendStatus(400); // is longer than the maximum allowed length(n)
        return;
      }

      const savedEntity = await entity.save();

      if (!savedEntity) {
        res.sendStatus(999); // TODO: status code should be changed
        return;
      }

      EntityModel.find({ _id: savedEntity._id })
        .populate('writer')
        .exec((err, result) => {
          if (err) {
            res.sendStatus(400);
            return;
          }
          res.json({ status: 200, result });
        });
    } catch (error) {
      log("error", __dirname + '\\index.js' + error.toString());
      res.sendStatus(500);
    }
  }

  async getEntity(req, res) {
    if (!req || !req.params || !req.params.entityId) {
      res.sendStatus(422); // unprocessable entity
      return;
    }

    EntityModel.findOne({ _id: req.params.entityId })
      .populate('writer')
      .exec((err, entity) => {
        if (err || entity === null) {
          res.sendStatus(404); // no entity
          return;
        }
        res.json({ status: 200, entity });
      });
  }

  async getEntities(req, res) {
    if (!req.query) {
      res.sendStatus(422);
      return;
    }
    const { skip, limit } = req.query;

    try {
      const entities = await EntityModel.find()
        .limit(parseInt(limit, 10) - 1)
        .skip(parseInt(skip, 10) - 1)
        .populate('writer');

      if (entities === null) {
        res.sendStatus(404); // no entities
        return;
      }

      res.json({ status: 200, entities });
    } catch (error) {
      log("error", 'Error in getEntities <Entity>' + error.toString());
      res.sendStatus(500);
    }
  }
}

module.exports = { Entity };

//TODO: getting number of comments should be limited per page
