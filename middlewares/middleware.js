
// VALIDAÇÕES (middleware)

const validaID = (request, response, next) => {
    const { id } = request.params
    const dados = objetos.find(obj => obj.id === id)
    if(!dados){
        return response
                .status(400)
                .json({ error: 'Id inválido' })
    }

    return next()    
}

const validaCadastro = (request, response, next) => {
    const { dataCompra, localCompra, valor, responsavel } = request.body

    if(!dataCompra || !localCompra || !valor || !responsavel){
        return response
                .status(400)
                .json({ error: 'Favor Preencher todos os campos' })
    }    
    return next()
}
