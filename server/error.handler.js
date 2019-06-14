'use strict'

exports.handleError = (req, resp,err, done) => {
   
    switch(err.name) {
        case 'MongoError':
            if(err.code === 11000) {
                err.statusCode = 400
            }
        break
        case 'ValidationError':
            err.statusCode = 400
            const messages = []
            for (let name in err.errors) {
                messages.push(err.errors[name].message)
            }
            err.toJSON = () => ({
                message: 'Validation error while processing your request.',
                errors: messages
            })
            break    
}
    done()
}