'use strict'
const _server = require('./server/server')
const server = new _server.Server()
const bots_router = require('./api/bots/bots.router')
const messages_router = require('./api/messages/messages.router')
/**
 * Método que inicializa o servidor e manipula o erro se houver falha
 * O método bootstrap criado na Classe Server, recebe um array de Routers possibilitando
 * a extensão da API para outros recursos
 */

server.bootstrap([
    bots_router.bootsRouter,
    messages_router.messagesRouter
]).then(server => {
    console.log('Servidor escutando em:', server.application.address())
}).catch(error => {
    console.log('Falha ao iniciar o servidor')
    console.error(error)
    process.exit(1)
})