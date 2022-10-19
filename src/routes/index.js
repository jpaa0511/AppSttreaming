const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    res.send('tonces que putita');
})
module.exports = router;