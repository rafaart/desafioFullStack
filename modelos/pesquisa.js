const mongoose = require('mongoose')

const pesquisaSchema = mongoose.Schema({
    pesquisaFiltro:{
        type: String,
        require: true
    },
    horarioPesquisa:{
        type: Date,
        require: true,
        default: Date.now
    },
    resultados:    
        [{
            thumbnail:{
                type: String,
                require: true
            },
            title:{
                type: String,
                require: true
            },
            address_city_name: {
                type: String,
                require:true
            },
            price: {
                type: String,
                require:true
            },
            permalink: {
                type: String,
                require:true
            }
        }]
    
    
   
})
module.exports = mongoose.model('pesquisa', pesquisaSchema)