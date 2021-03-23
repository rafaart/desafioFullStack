const express = require('express')
const axios = require('axios')
const rotas = express.Router()
const Pesquisa = require('../modelos/pesquisa')

rotas.get('/pesquisaML', async (req, res) => {
    try{
        const {data} = await axios('https://api.mercadolibre.com/sites/MLB/search?q=celular')
        res.json(data)
        console.log(data)

    } catch (err){
        console.error(err)
    }
})

//pegar todos
rotas.get('/', async (req, res) => {
    try{
        const pesquisa = await Pesquisa.find()
        res.json(pesquisa)
    } catch (err){
        res.status(500).json({ message: err.message})
    }
})
//pegar um
rotas.get('/:id', pegarPesquisa, (req, res) => {
    res.json(res.pesquisa.nome)
})
//colocar um
rotas.post('/', async (req,res) => {
    const pesquisa = new Pesquisa({
        pesquisaFiltro: req.body.pesquisaFiltro,
        thumbnail: req.body.thumbnail,
        title: req.body.title,
        address_city_name: req.body.address_city_name,
        price: req.body.price,
        permalink: req.body.permalink
    })
    try{
        const novaPesquisa = await pesquisa.save()
        res.status(201).json(novaPesquisa)
    } catch (err){
        res.status(400).json({ message: err.message})
    }

})
//atualizar um
rotas.patch('/:id', pegarPesquisa, async (req,res) => {
    if(req.body.pesquisaFiltro != null){
        res.pesquisa.pesquisaFiltro = req.body.pesquisaFiltro
    }
    if(req.body.thumbnail != null){
        res.pesquisa.thumbnail = req.body.thumbnail
    }
    if(req.body.title != null){
        res.pesquisa.title = req.body.title
    }
    if(req.body.address_city_name != null){
        res.pesquisa.address_city_name = req.body.address_city_name
    }
    if(req.body.price != null){
        res.pesquisa.price = req.body.price
    }
    if(req.body.permalink != null){
        res.pesquisa.permalink = req.body.permalink
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
        await res.pesquisa.remove()
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


module.exports = rotas