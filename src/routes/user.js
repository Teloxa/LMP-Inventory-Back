const { Router } = require("express");

const router = Router();

router.get('/', (req, res) => {
  res.json({
    msg: 'ok'
  })
});

module.exports = router;
