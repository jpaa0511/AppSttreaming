const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res)=>{
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
    req.flash('exitoso', 'Plataforma Agregada correctamente');
    res.redirect('/Plataformas');
});

router.get('/', isLoggedIn, async (req, res) =>{
    const plataform = await pool.query('SELECT * FROM plataforma');
    res.render('Plataformas/lista', {plataform});
});

router.get('/delete/:IdPlataforma', async (req,res)=>{
    const {IdPlataforma} = req.params;
    await pool.query('DELETE FROM plataforma WHERE IdPlataforma = ?', [IdPlataforma]);
    req.flash('exitoso', 'Plataforma eliminada correctamente')
    res.redirect('/Plataformas');
});

router.get('/editar/:IdPlataforma', async (req,res)=>{
    const {IdPlataforma} = req.params;
    const plataformas = await pool.query('SELECT * FROM plataforma WHERE IdPlataforma = ?', [IdPlataforma]);
    res.render('Plataformas/editar', {plataforma: plataformas[0]})
});

router.post('/editar/:IdPlataforma', async (req,res)=>{
    const {IdPlataforma} = req.params;
    const {Imagen_URL, Titulo, Descripcion, Precio} = req.body;
    const newPlataforma = {
        Imagen_URL, 
        Titulo, 
        Descripcion, 
        Precio
    };
    await pool.query('UPDATE plataforma set ? WHERE IdPlataforma = ?', [newPlataforma, IdPlataforma]);
    req.flash('exitoso', 'Plataforma actualizada correctamente')
    res.redirect('/Plataformas');
});

module.exports = router;