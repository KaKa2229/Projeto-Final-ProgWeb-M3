const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/PedidoController');

router.post('/pedidos', pedidoController.postCriarPedido);

router.get('/pedidos/cliente/:email', pedidoController.getPedidosCliente);

module.exports = router;