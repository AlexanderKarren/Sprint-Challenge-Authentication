const db = require('../database/dbConfig.js')

module.exports = {
    find,
    register
}

function find(filter) {
    if (filter) return db('users').where(filter)
}

function register(user) {
    return db('users').insert(user, 'id')
        .then(([id]) => find({id}))
}