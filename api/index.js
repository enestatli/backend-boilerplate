const express = require('express');

const router = express.Router();

const { Auth } = require('./Auth');
const { Comment } = require('./Comment');
const { Entity } = require('./Entity');
const { Like } = require('./Like');
const { User } = require('./User');

new Auth(router);
new Comment(router);
new Entity(router);
new Like(router);

new User(router);

module.exports = router;
