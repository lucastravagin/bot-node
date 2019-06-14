'use stricit'

const mongoose = require('mongoose')




const messageSchema = new mongoose.Schema({
    conversationId: {type: String, required: true},
    timestamp: {type : Date, default: Date.now},
    from: {type: String, required: true},
    to: {type: String, required: true},
    text: {type: String, required: true}
})



// const conversationSchema = new mongoose.Schema({

// })

exports.Message = mongoose.model('Message', messageSchema)