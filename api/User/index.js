const UserModel = require('../../db/models/user');
const { logger } = require('../../logger');
const { requireAuth } = require('../../middleware/auth');
const { Utils } = require('../../utils');
const { protectWithApiKey } = require('../../middleware/protectWithApiKey');
const { config } = require('../../config');
const { SendEmail } = require('../../libs');
const { isValidObjectId } = require('mongoose');

class User {
  constructor(router) {
    this.router = router;
    this.userRoutes();
  }

  userRoutes() {
    this.router.post(
      '/user/follow/:loggedUserId',
      protectWithApiKey,
      // requireAuth,
      this.follow.bind(this)
    );
  }

  async follow(req, res) {
    if (
      !req.params ||
      !req.params.loggedUserId ||
      !req.body ||
      !req.body.followedUserId
    ) {
      res.sendStatus(400); // missing body
      return;
    }

    const { loggedUserId } = req.params;
    const { followedUserId } = req.body;

    if (!isValidObjectId(loggedUserId) || !isValidObjectId(followedUserId)) {
      res.sendStatus(404); // invalid id
      return;
    }

    const loggedUser = await UserModel.findOne({ _id: loggedUserId });
    const followedUser = await UserModel.findOne({ _id: followedUserId });

    try {
      if (!loggedUser || !followedUser) {
        res.sendStatus(404); // user not found
        return;
      }

      const existFollower = followedUser.followers.some(
        (followerId) => followerId === loggedUserId
      );

      const existFollowing = loggedUser.followings.some(
        (followingId) => followingId === followedUserId
      );

      // if loggedUser already in followedUser's follower array, remove (unfollow)

      if (existFollower) {
        const index = followedUser.followers.indexOf(loggedUserId);
        if (index > 0) {
          followedUser.followers.splice(index, 1);
        } else {
          followedUser.followers.shift();
        }
        await followedUser.save();
      }

      // if followedUser already in loggedUser's following array, remove (unfollow)

      if (existFollowing) {
        const index = loggedUser.followings.indexOf(followedUserId);
        if (index > 0) {
          loggedUser.followings.splice(index, 1);
        } else {
          loggedUser.followings.shift();
        }

        await loggedUser.save();
      }

      // if this is first time, add (follow)

      if (!existFollower && !existFollowing) {
        followedUser.followers.push(loggedUserId);
        await followedUser.save();

        loggedUser.followings.push(followedUserId);
        await loggedUser.save();

        // return res.sendStatus(200);
      }

      return res.json(loggedUser);
    } catch (error) {
      logger.error('Error in follow <User>', error);
      res.sendStatus(500);
    }
  }
}

module.exports = { User };
