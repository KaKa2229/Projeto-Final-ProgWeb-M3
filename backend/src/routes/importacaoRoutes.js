const express = require('express');
const router = express.Router();
const importacaoService = require('../services/ImportacaoService');

router.post('/importar-produtos', async (req, res) => {
    try {
        const count = await importacaoService.importarProdutos();
        
        res.status(200).json({ 
            mensagem: 'Importação realizada com sucesso.',
            produtos_processados: count
        });
    } catch (error) {
        console.error("Erro na rota de importação:", error);
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;