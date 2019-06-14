'user strict'

const message_model = require('../messages/messages.module')
const model_router = require('../../common/model.router')

class MessagesRouter extends model_router.ModelRouter {
    constructor() {
        super(message_model.Message)

        this.findByConversationId = (req, resp, next) => {
            if (req.query.conversationId) {
                message_model.Message.findByConversationId(req.query.conversationId)
                    .then(message => message ? [message] : [])
                    .then(this.renderAll(resp, next))
                .catch(next)
            }
            next()
        }

    }

    applyRoutes(application) {
        application.get(`${this.basePath}`, [ this.findByConversationId,this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}/:id`, this.replace)
        application.del(`${this.basePath}/:id`, this.delete)
    }
}

exports.messagesRouter = new MessagesRouter()