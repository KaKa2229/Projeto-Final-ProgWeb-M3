const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/ProdutoController');

router.get('/produtos', produtoController.getProdutos);

router.get('/produtos/:id', produtoController.getProdutoDetalhe);

module.exports = router;