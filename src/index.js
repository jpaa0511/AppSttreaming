const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const pool = require('./database');

//inicializaciones
const app = express();

//configuraciones
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlerbars')
}));
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//variable globales
app.use((req, res, next)=>{
    next();
});

/* Prueba de conexion api postman
app.get('/api/plataforma', (req,res) =>{
    pool.query('SELECT * FROM plataforma', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    });
});*/

//rutas
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/Plataformas', require ('./routes/Plataformas'));


//public
app.use(express.static(path.join(__dirname, 'public')));


//iniciar servidor
const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function(){
    console.log("Servidor en linea en puerto "+ puerto);
});
