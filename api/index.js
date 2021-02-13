const express = require('express');

const router = express.Router();

const { Auth } = require('./Auth');
const { Comment } = require('./Comment');

new Auth(router);
new Comment(router);

module.exports = router;
