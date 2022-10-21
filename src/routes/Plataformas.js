const express = require('express');
const router = express.Router();

const pool = require('../database')

router.get('/add', (req, res)=>{
    res.render('Plataformas/add')
});

router.post('/add', async (req, res)=> {
    const {Imagen_URL, Titulo, Descripcion, Precio} = req.body;
    const newPlataforma = {
        Imagen_URL, 
        Titulo, 
        Descripcion,
        Precio
    };
    await pool.query('INSERT INTO plataforma set ?', [newPlataforma]);
    res.redirect('/Plataformas');
});

router.get('/', async (req, res) =>{
    const plataform = await pool.query('SELECT * FROM plataforma');
    res.render('Plataformas/lista', {plataform});
});

router.get('/delete/:IdPlataforma', async (req,res)=>{
    const {IdPlataforma} = req.params;
    await pool.query('DELETE FROM plataforma WHERE IdPlataforma = ?', [IdPlataforma]);
    res.redirect('/Plataformas');
});

module.exports = router;