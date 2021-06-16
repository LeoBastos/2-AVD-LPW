const express = require('express')
const app = express()
app.use(express.json())
const uuid = require('uuid')


let objetos = [
    { id: uuid.v4(), dataCompra: '2021/06/15', localCompra: 'Distribuidora A', valor: 500, responsavel: 'jose'},
    { id: uuid.v4(), dataCompra: '2021/06/10', localCompra: 'Distribuidora BC', valor: 3500, responsavel: 'maria'},    
]


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


// ROUTES

//BUSCAR VALOR TOTAL GASTO
app.get('/despesas/gastototal', (request, response) => {
    const gastoTotal = objetos.reduce((valorTotal, valores) => valorTotal += valores.valor, 0)
    if(gastoTotal >= 5000){
        return response 
            .status(200)
            .json({GastoTotal: gastoTotal})
    }else {
        return response 
            .status(200)
            .json(`Valor inferior à 5000 : ${gastoTotal}`)
    }
    
})

//BUSCAR TODO GASTO DO RESPONSÁVEL
//http://localhost:3333/despesas/gastoresponsavel?responsavel=jose
//http://localhost:3333/despesas/gastoresponsavel?responsavel=maria

app.get('/despesas/gastoresponsavel', (request, response) => {
    const { responsavel } = request.query
    const dadosResponsavel = objetos.filter(obj => obj.responsavel === responsavel)
    return response 
            .status(200)
            .json(dadosResponsavel)
})
    


//LISTAR DESPESAS
app.get('/despesas', (request, response) => {
    return response
            .status(200)
            .json(objetos)
})

//BUSCAR CADASTRO DE DESPESA POR ID
app.get('/despesas/:id', validaID, (request, response) => {
    const { id } = request.params    
    const dadosDespesas = objetos.find(obj => obj.id === id)
    return response
            .status(200)
            .json(dadosDespesas)
})



//CADASTRAR DESPESA
app.post('/despesas', validaCadastro, (request, response) => {
    const { dataCompra, localCompra, valor, responsavel } = request.body
    const dadosDespesas = {
        id: `${uuid.v4()}`,
        dataCompra,
        localCompra,
        valor,
        responsavel       
    }

    objetos = [...objetos, dadosDespesas]   
    return response
            .status(200)
            .json(dadosDespesas)
})


app.listen(3333, () => {
    console.log('Server Up')
})
