const express = require('express');
const router = express.Router();

const pool = require('../database')

router.get('/add', (req, res)=>{
    res.send('estas en la ruta add')
})

module.exports = router;