'use strict'

const modal = document.querySelector('.modal')
const tbody = document.querySelector('tbody')
const fornecedor = document.querySelector('#m-fornecedor')
const equipamento = document.querySelector('#m-equipamento')
const nSerie = document.querySelector('#m-nSerie')
const ult_mp = document.querySelector('#m-ult_mp')
const prox_mp = document.querySelector('#m-prox_mp')
const certificado = document.querySelector('#m-certificado')

let itens
let id

const getItensBD = () => JSON.parse(localStorage.getItem('dbFunc')) ?? []
const setItensBD = (itens) => localStorage.setItem('dbFunc', JSON.stringify(itens))

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

loadItens()



const openModal = () => document.getElementById('modal')
  .classList.add('active')

const closeModal = () => document.getElementById('modal')
  .classList.remove('active')


