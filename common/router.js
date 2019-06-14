'use strict'

const events_ = require('events')
const restify_errors = require("restify-errors");

class Router extends events_.EventEmitter {

    envolope(document) {
        return document;
    }

    envelopeAll(documents, options = {}) {
        return documents
    }
 
    
    render(response, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(this.envolope(document))
            }
            else {
                throw new restify_errors.NotFoundError('Documento não encontrado')
            }
            return next(false)
        }
    }

    renderAll(response, next, options = {}) {
        return (documents) => {
            if(documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document)
                    array[index] = this.envolope(document)
                })
                response.json(this.envelopeAll(documents, options))
            }else{
                response.json(this.envelopeAll([]))
            }
            return next(false)
        }
    }
}

exports.Router = Router