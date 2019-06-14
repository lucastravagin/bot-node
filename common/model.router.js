'use strict'

const router = require('./router')
const mongoose = require('mongoose')
const restify_errors = require('restify-errors')


/* 
    * A ideia do ModelRouer é enxugar um pouco a complexidade do Router e tirar um pouco da responsabilidade de lidar
    * com os métodos de request e response
*/

class ModelRouter extends router.Router {
    constructor(model) {
        super()
        this.model = model

        //Método para validar se o Id que está vindo no parâmetro é valido
        this.validateId = (req, res, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(restify_errors.NotFoundError('Document not found'))
            } else {
                next()
            }
        }

        this.findAll = (req, resp, next) => {
            this.model.find()
                .then(this.render(resp, next))
                .catch(next)
        }

        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next)
        }

        this.save = (req, resp, next) => {
            let document = new this.model(req.body)
            document.save()
                .then(this.render(resp, next))
                .catch(next)
        }

        this.replace = (req, resp, next) => {
            const options = {
                runValidators: true,
                overwrite: true
            }
            this.model.update({
                _id: req.params.id
            }, req.body, options)
                .exec().then(result => {
                    if (result.n) {
                        return this.prepareOne(this.model.findById(req.params.id))
                    }
                    else {
                        throw new restify_errors_1.NotFoundError('Documento não encontrado')
                    }
                }).then(this.render(resp, next))
                .catch(next)
        }

        this.delete = (req, resp, next) => {
            this.model.remove({
                _id: req.params.id
            }).exec().then((cmdResult) => {
                if (cmdResult.n) {
                    resp.send(204)
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado')
                }
                return next()
            })
        }



        this.basePath = `/${model.collection.name}`
    }

    prepareOne(query) {
        return query
    }
}
exports.ModelRouter = ModelRouter