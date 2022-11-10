const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const pool = require('./database');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');


//inicializaciones
const app = express();
require('./lib/passport');

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
app.use(session({
    secret: 'jpaa0511',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//variable globales
app.use((req, res, next)=>{
    app.locals.exitoso = req.flash('exitoso');
    app.locals.mensaje = req.flash('mensaje');
    app.locals.user = req.user;
    next();
});


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
