const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../database/secrets.js');
const Users = require('./auth-model.js')
const router = require('express').Router()

router.post('/register', (req, res) => {
  let newUser = req.body;

  const rounds = process.env.HASH_ROUNDS || 10;

  newUser.password = bcrypt.hashSync(newUser.password, rounds);

  Users.register(newUser).then(([user]) => res.status(201).json(user))
  .catch(error => res.status(500).json({ error: error.message }))
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  Users.find({ username }).then(([user]) => {
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({username, token})
      }
      else res.status(401).json({ error: "Incorrect password" })
    }
    else res.status(401).json({ error: "Could not find user with provided credentials" })
  })
  .catch(error => res.status(500).json({ error: error.message }))
});

function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  }
  const secret = jwtSecret;
  const options = {
      expiresIn: 1000 * 60
  }

  return jwt.sign(payload, secret, options);
}

module.exports = router;
