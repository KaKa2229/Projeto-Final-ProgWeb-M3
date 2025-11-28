const estoqueService = require('../services/EstoqueService');

async function postValidarEstoque(req, res) {
    const { produtoId, quantidade } = req.body;

    if (!produtoId || !quantidade || typeof quantidade !== 'number') {
        return res.status(400).json({ erro: 'Dados de entrada inválidos (produtoId e quantidade são obrigatórios).' });
    }

    try {
        await estoqueService.validarDisponibilidade(produtoId, quantidade);
        
        res.status(200).json({ mensagem: 'Estoque disponível.' });

    } catch (error) {
        if (error.message.includes('Estoque insuficiente')) {
            return res.status(409).json({ 
                erro: error.message
            });
        }
        
        console.error('Erro na validação de estoque:', error.message);
        res.status(500).json({ erro: 'Erro interno na validação de estoque.' });
    }
}

module.exports = {
    postValidarEstoque,
};