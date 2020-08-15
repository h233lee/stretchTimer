const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const User = require('./user');
const { json } = require('body-parser');
const { check, validationResult } = require('express-validator');
// -------------------Middleware--------------------------------------
mongoose.connect(
  'mongodb://localhost:27017/stretchTimer',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log('Mongoose Is Connected');
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// -------------------Routes--------------------------------------
app.post(
  '/register',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) throw err;
        if (user) res.json(user).send('user already exists');
        if (!user) {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);

          const user = new User({
            email: req.body.email,
            password: hashedPassword,
            timer: req.body.timer,
            alert: req.body.alert,
          });
          await user.save();
          res.json(user);
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

app.post(
  '/login',
  [check('email', 'Please include a valid email').isEmail()],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      await passport.authenticate('local', (err, user, info) => {
        if (err) throw err;
        if (!user) res.send('No User Exists');
        else {
          req.logIn(user, (err) => {
            if (err) throw err;

            res.json(user);
          });
        }
      })(req, res, next);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

app.post('/login/google', (req, res) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (err) throw err;
    if (user) res.json(user);
    if (!user) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        googleId: req.body.googleId,
      });
      await user.save();
      res.json(user);
    }
  });
});

app.put('/update', (req, res) => {
  const filter = { email: req.body.email };
  const update = { $set: { timer: req.body.timer, alert: req.body.alert } };
  User.findOneAndUpdate(filter, update, { new: true }).exec((err, user) => {
    if (err) throw err;
    res.json(user);
  });
});

app.get('/user', (req, res) => {
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('/');
});

//Start Server
app.listen(5000, () => {
  console.log('Server Has Started');
});
