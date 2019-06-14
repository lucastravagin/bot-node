'use strict'
const restify = require('restify')
const environment = require('../common/environment')
const mongoose = require("mongoose")
const error_handler = require('./error.handler')
const corsMiddleware = require('restify-cors-middleware')

class Server {

    initializeDb() {
        mongoose.Promise = global.Promise
        mongoose.set('useCreateIndex', true)
        return mongoose.connect(environment.environment.db.url, {useNewUrlParser: true, useCreateIndex: true})
    }

    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {

                //Configuracao do Plugin Restify
                this.application = restify.createServer({
                    name: 'teste-nodejs',
                    version: '1.0.0'
                })

                const corsOptions = corsMiddleware.Options =  {
                    preflightMaxAge: 10,
                    origins: ['*']
                }

                const cors = corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions)

                this.application.pre(cors.preflight)

                

                this.application.use(cors.actual)
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())

                

                this.application.listen(environment.environment.server.port, () => {
                    resolve(this.application)
                })
                
                this.application.on('restifyError', error_handler.handleError)

                //Percorre o array Routers adicionando as rotas
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

            } catch (error) {
                reject(error)
            }
        })
    }

    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this))
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}

exports.Server = Server