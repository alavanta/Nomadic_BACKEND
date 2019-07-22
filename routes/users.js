const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({
    nomadic: {
      status: 'Sukses fetch Data'
    }
  });
});

module.exports = router;
