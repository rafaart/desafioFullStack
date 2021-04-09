const express = require('express')
const axios = require('axios')
const rotas = express.Router()
const Pesquisa = require('../modelos/pesquisa')
const ObjectId = require('mongoose/lib/schema/objectid')


//pegar da API do mercado livre
rotas.get('/:Web/:filtro', pegarUmaPesquisa, async (req, res) => {
    console.log(req.params.filtro)

    switch(req.params.Web){
        case "MercadoLivre":
            res.json(res.pesquisa)
            break
        case "Buscape":
            res.json('API do Buscapé indisponivel')
            break
        default:
    }
    

})

//atualizar um
rotas.patch('/atualizar/:Web/:filtro', pegarUmaPesquisa, async (req,res) => {

    try{

        const {data} = await axios(process.env.API_MLB_URL+req.params.filtro)
            let pesquisa = res.pesquisa
            let dia = Date.now()
            pesquisa
                {
                    pesquisa.pesquisaFiltro = data.query,
                    pesquisa.horarioPesquisa = dia

                    for(var i = 0; i < data.results.length; i++){
                        
                            {
                                pesquisa.results[i].thumbnail = data.results[i].thumbnail,
                                pesquisa.results[i].title = data.results[i].title,
                                pesquisa.results[i].address_city_name = data.results[i].address.city_name,
                                pesquisa.results[i].price = data.results[i].price,
                                pesquisa.results[i].permalink = data.results[i].permalink
                            }
                        
                    }
                }
            
                
                console.log(pesquisa)
        const pesquisaAtualizada = await pesquisa.save()
        res.json(pesquisaAtualizada)
    }catch (err) {
        res.status(400).json({message: err.message})
    }
})


//midleware
async function pegarUmaPesquisa(req, res, next) {
    let pesquisa
    try{
        pesquisa = await Pesquisa.find({"pesquisaFiltro": req.params.filtro})
        if (pesquisa.length < 1){

            console.log("pesquisa retornou null")
            
            const {data} = await axios(process.env.API_MLB_URL+req.params.filtro)
    
            let pesquisa = new Pesquisa(
                {
                    pesquisaFiltro: data.query
                    
                }
            )
            
            for(let result of data.results){
                pesquisa.results.push(
                    {
                    thumbnail: result.thumbnail,
                        title: result.title,
                        address_city_name: result.address.city_name,
                        price: result.price,
                        permalink: result.permalink
                }
                )
            }
            await salvarUmaPesquisa(pesquisa)
            res.pesquisa = pesquisa
        }else{
            res.pesquisa = pesquisa[0]
        }

    
    

    }catch (err) {
        return res.status(500).json({message: err.message})
    }
    
    next()
}

async function salvarUmaPesquisa(data){
    try{
        const novaPesquisa = await data.save()
        
        //res.status(201).json(novaPesquisa)
        
    } catch (err){
        //res.status(400).json({ message: err.message})
    }
}


module.exports = rotas