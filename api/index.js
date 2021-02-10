const express = require('express');

const router = express.Router();

const { Auth } = require('./Auth');

new Auth(router);

module.exports = router;
