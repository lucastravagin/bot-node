# Nodejs Project Bot
API desenvolvida para troca de mensagens com usuário e bot do sistema. 

### Installing
Baixar este repositório na sua máquina e rodar no terminal

```
npm install
node main.js // Run application
```

## Stack

* Nodejs (ES2018) - Framework Restful (Restify)
* MongoDB (ODM Mongoose)


## API Design

* A API foi desenvolvida utilizando o padrão Restful, com o auxílio do Framework Restify.
* Habilitação do CORS na API
* Mapeamento das Schemas dos Documentos com o Mongoose
* Tratamento de erros com o Restify

## Resources

* **/bot** : Gerencia as operações relacionadas ao bot.

**GET http://localhost:3003/bots**

Response

```
[
    {
        "_id": "5d03f92babc9fa1e50dc5221",
        "name": "Atendente 1",
        "__v": 0
    }
]
````
**POST http://localhost:3003/bots**

Response

```
[
    {
        "_id": "5d03f92babc9fa1e50dc5221",
        "name": "Atendente 1",
        "__v": 0
    }
]
````

**PUT http://localhost:3003/bots/5d03f92babc9fa1e50dc5221 (id)**

Request Body

```
Objeto que você vai alterar

    {
        "name": "Atendente 1"
    }

````

**Delete http://localhost:3003/bots/5d03f92babc9fa1e50dc5221 (id)**

Status Code: 204 (No Content)



## Code Review

* **Arquivo Main** : Script responsável por manipular o método bootstrap da Classe Server e orientar a manipulação de erros
ser houver falha. 
  O método bootstrap criado na Classe Server, recebe um array de Routers possibilitando a extensão da API
para outros recursos.

**main.js**
```
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
```

* **Router** : Script que realiza o render das requisições, criando uma responsabilidade única, tornando o request e response
das requisições em um só padrão.

**common/router.js**
```
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

```

* **Model Router** :  A ideia do ModelRouer é enxugar um pouco a complexidade do Router e tirar um pouco da responsabilidade de lidar
     com os métodos que gerenciam requisições e respostas

**common/model.router.js**
```
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
```

