const express = require('express');

const router = express.Router();

router.get('/test', (req, res) => {
  res.send('hello from test api route');
});

module.exports = router;
