const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/EstoqueController');

router.post('/estoque/validar', estoqueController.postValidarEstoque);

module.exports = router;