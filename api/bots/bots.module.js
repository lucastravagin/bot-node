'use stricit'

const mongoose = require('mongoose')


const botSchema = new mongoose.Schema({
    name: {type: String, required: true}
})

exports.Bot = mongoose.model('Bot', botSchema)