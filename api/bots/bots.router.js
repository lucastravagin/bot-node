'user strict'

const bot_model = require('../bots/bots.module')
const model_router = require('../../common/model.router')

class BootsRouter extends model_router.ModelRouter {
    constructor() {
        super(bot_model.Bot)
    }

    applyRoutes(application) {
        application.get(`${this.basePath}`, [this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}/:id`, this.replace)
        application.del(`${this.basePath}/:id`, this.delete)
    }
}

exports.bootsRouter = new BootsRouter()