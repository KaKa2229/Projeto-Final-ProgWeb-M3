const pedidoService = require('../services/PedidoService');

async function postCriarPedido(req, res) {
    const { nome, email, carrinho } = req.body;

    if (!nome || !email || !carrinho || carrinho.length === 0) {
        return res.status(400).json({ erro: 'Dados do cliente (nome, email) e itens do carrinho são obrigatórios.' });
    }
    
    if (!email.includes('@')) {
        return res.status(400).json({ erro: 'Formato de e-mail inválido.' });
    }

    try {
        const novoPedido = await pedidoService.criarPedido(nome, email, carrinho);

        res.status(201).json({ 
            mensagem: 'Compra finalizada com sucesso!',
            numero_pedido: novoPedido.id,
            data_pedido: novoPedido.data_pedido
        });

    } catch (error) {
        if (error.message.includes('Estoque insuficiente') || error.message.includes('Item inválido')) {
            return res.status(409).json({ 
                erro: error.message,
                detalhe: "O pedido não foi criado devido a indisponibilidade de estoque."
            });
        }
        
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ erro: 'Falha interna ao processar o pedido.' });
    }
}

async function getPedidosCliente(req, res) {
    const emailCliente = req.params.email; 

    if (!emailCliente || !emailCliente.includes('@')) {
        return res.status(400).json({ erro: 'E-mail inválido ou ausente.' });
    }

    try {
        const pedidos = await pedidoService.listarPedidosPorCliente(emailCliente);
        
        if (pedidos.length === 0) {
            return res.status(200).json([]); 
        }

        res.status(200).json(pedidos);
    } catch (error) {
        if (error.message === 'Cliente não encontrado.') {
            return res.status(404).json({ erro: error.message });
        }
        console.error('Erro ao listar pedidos do cliente:', error);
        res.status(500).json({ erro: 'Falha interna ao buscar histórico de compras.' });
    }
}

module.exports = {
    postCriarPedido,
    getPedidosCliente,
};