const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    res.send('en linea');
})
module.exports = router;