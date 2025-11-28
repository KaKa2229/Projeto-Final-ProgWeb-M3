const produtoService = require('../services/ProdutoService');

async function getProdutos(req, res) {
    const { categoria, busca } = req.query; 
    
    try {
        const produtos = await produtoService.listarProdutos(categoria, busca);
        res.status(200).json(produtos); 
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ erro: 'Falha ao buscar produtos.' });
    }
}

async function getProdutoDetalhe(req, res) {
    const produtoId = parseInt(req.params.id); 

    if (isNaN(produtoId)) {
        return res.status(400).json({ erro: 'ID de produto inválido.' });
    }

    try {
        const produto = await produtoService.detalharProduto(produtoId);
        res.status(200).json(produto); 
    } catch (error) {
        if (error.message === 'Produto não encontrado.') {
            return res.status(404).json({ erro: error.message });
        }
        console.error('Erro ao detalhar produto:', error);
        res.status(500).json({ erro: 'Falha ao buscar detalhes do produto.' });
    }
}

module.exports = {
    getProdutos,
    getProdutoDetalhe,
};