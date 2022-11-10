const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password)
      if (validPassword) {
        done(null, user, req.flash('exitoso', 'Welcome ' + user.username));
      } else {
        done(null, false, req.flash('mensaje', 'Contraseña incorrecta'));
      }
    } else {
      return done(null, false, req.flash('mensaje', 'El nombre de usuario no existe.'));
    }
  }));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const newUser = {
        username,
        password,
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
    newUser.Idusuario = result.insertId;
    return done(null, newUser);
}
)
);

passport.serializeUser((user, done) => {
    done(null, user.Idusuario);
});

passport.deserializeUser(async (Idusuario, done) => {
    const rows = await pool.query('SELECT * FROM usuario where Idusuario = ?', [Idusuario]);
    done(null, rows[0]);
});
