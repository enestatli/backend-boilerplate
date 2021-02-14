const express = require('express');

const router = express.Router();

const { Auth } = require('./Auth');
const { Comment } = require('./Comment');
const { Entity } = require('./Entity');

new Auth(router);
new Comment(router);
new Entity(router);

module.exports = router;
