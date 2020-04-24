const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const SamlStrategy = require('passport-saml').Strategy
const config = require('./config')
const fs = require('fs')

const app = express()

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use(new SamlStrategy(
  {
    path: config.passport.saml.path,
    entryPoint: config.passport.saml.entryPoint,
    issuer: config.passport.saml.issuer,
    cert: fs.readFileSync(`./${config.passport.saml.cert}`).toString('utf-8')
  },
  (profile, done) => done(null, profile)
))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(session(
  {
    resave: true,
    saveUninitialized: true,
    secret: 'this shit hits'
  }))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.send(`
      <h1>Hello, ${req.user.firstName} </h1>
        <a href="/profile">Profile</a>
        <br />
        <a href="/logout">Logout</a>
    `)
  } else {
    res.send(`
    <h1>Welcome</h1>
    <br />
    <a href="/login">Login</a>
    `)
  }
})

app.get('/login',
  passport.authenticate(config.passport.strategy,
    {
      successRedirect: '/',
      failureRedirect: '/login'
    })
)

app.post(config.passport.saml.path,
passport.authenticate(config.passport.strategy,
  {
    failureRedirect: '/',
    failureFlash: true
  }),
  function (req, res) {
    res.redirect('/')
  }
)

app.get('/profile', function (req, res) {
  if (req.isAuthenticated()) {
    res.send(`
      <h1>Profile</h1>
      ${JSON.stringify(req.user)}
	    <a href="/logout">Logout</a>
    `)
  } else {
    res.redirect('/login')
  }
})

app.get('/logout', function (req, res) {
  req.logout()
  // TODO: invalidate session on IP
  res.redirect('/')
})

app.listen(config.port, () => console.log(`🚀🚀🚀 App listening on http://localhost:${config.port}`))
