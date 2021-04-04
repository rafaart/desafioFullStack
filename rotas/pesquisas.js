const express = require('express')
const axios = require('axios')
const rotas = express.Router()
const Pesquisa = require('../modelos/pesquisa')
const ObjectId = require('mongoose/lib/schema/objectid')


//pegar da API do mercado livre
rotas.get('/:Web/:filtro', pegarUmaPesquisa, async (req, res) => {

    
    if(res.pesquisa!=null){
        console.log("pesquisa não voltou null")
        console.log(res.pesquisa[0].id)
    }else{
        console.log("pesquisa voltou null")
    }

        try{
            if(req.params.Web != 'Buscape'){
                const {data} = await axios(process.env.API_MLB_URL+req.params.filtro)
                res.json(data)
                console.log(req.params.filtro)
            }else{
                res.json('API do Buscapé indisponivel')
            }

        } catch (err){
            console.error(err)
        }

    
    
    })
/*
rotas.get('/Buscape/:filtro', async (req, res) => {
    
})
*/

//pegar todos
rotas.get('/', async (req, res) => {
    let data = new Date()
    try{
        const pesquisa = await Pesquisa.find()
        res.json(pesquisa)
        for(let result of pesquisa){
            if(Number(result.horarioPesquisa)< Number(data)){
                console.log("Desatualizado desde: "+result.horarioPesquisa + "horario atual: " + data)
            }else{
                console.log("atualizado desde: "+result.horarioPesquisa+ "horario atual: " + data)
            }
        }

    } catch (err){
        res.status(500).json({ message: err.message})
    }
})
//pegar um
rotas.get('/:id', pegarPesquisa, (req, res) => {
    let data = new Date()
    if(Number(res.pesquisa.horarioPesquisa)< Number(data)){
        console.log("Desatualizado desde: "+res.pesquisa.horarioPesquisa + "horario atual: " + data)
    }else{
        console.log("atualizado desde: "+res.pesquisa.horarioPesquisa+ "horario atual: " + data)
    }
    res.json(res.pesquisa)
})
//colocar um
rotas.post('/:filtro', async (req,res) => {
    const {data} = await axios(process.env.API_URL+req.params.filtro)
    let pesquisa = new Pesquisa(
        {
            pesquisaFiltro: data.query,
            resultados:[{
                
            }]
            
        }
    )
    
    for(let result of data.results){
        pesquisa.resultados.push(
            {
            thumbnail: result.thumbnail,
                title: result.title,
                address_city_name: result.address_city_name,
                price: result.price,
                permalink: result.permalink
        }
        )
    }

    console.log(pesquisa.resultados[1])
    //console.log(data.results[30])
    try{
        const novaPesquisa = await pesquisa.save()
        res.status(201).json(novaPesquisa)
    } catch (err){
        res.status(400).json({ message: err.message})
    }

})
//atualizar um
rotas.patch('/:id', pegarPesquisa, async (req,res) => {
    //se a pesquisa estiver desatualizada
    if(req.body.pesquisaFiltro != null){

    }
    try{
        const pesquisaAtualizada = await res.pesquisa.save()
        res.json(pesquisaAtualizada)
    }catch (err) {
        res.status(400).json({message: err.message})
    }
})
//deletar um
rotas.delete('/:id', pegarPesquisa, async (req,res) => {
    try{
        await res.pesquisa.drop()

        res.json({message: "pesquisa deletada"})
    }catch (err) {
        res.status(500).json({message: err.message})
    }
})

//midleware
async function pegarPesquisa(req, res, next) {
    let pesquisa
    try{
        pesquisa = await Pesquisa.findById(req.params.id)
        if (pesquisa == null){
            return res.status(404).json({message: "pesquisa não foi encontrada"})
        }
    }catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.pesquisa = pesquisa
    next()
}

async function pegarUmaPesquisa(req, res, next) {
    let pesquisa
    try{
        pesquisa = await Pesquisa.find({"pesquisaFiltro": req.params.filtro})
        if (pesquisa == null){
            console.log("pesquisa voltou null")
            return res.status(404).json({message: "pesquisa não foi encontrada"})
            
        }
    }catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.pesquisa = pesquisa
    next()
}


module.exports = rotas