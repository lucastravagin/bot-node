'use strict'

exports.environment = {
    server: {port: process.env.SERVER_PORT || 3003},
    db: {url: process.env.DB_URL || 'mongodb://localhost/banco-teste'}
}