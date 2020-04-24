/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../database/secrets.js');

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, jwtSecret,
    (err, decoded) => {
        if (err) {
            res.status(401).json({ error: "Bad token"});
        }
        else {
            console.log(decoded);
            req.decoded = decoded;
            next();
        }
    })
}
else res.status(400).json({ error: "You need to log in to access this page" })
};
