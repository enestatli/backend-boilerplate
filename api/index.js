const express = require('express');

const router = express.Router();

const { Auth } = require('./Auth');
const { Comment } = require('./Comment');
const { Entity } = require('./Entity');
const { Like } = require('./Like');

new Auth(router);
new Comment(router);
new Entity(router);
new Like(router);

module.exports = router;
