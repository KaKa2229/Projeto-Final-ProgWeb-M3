const prisma = require('./PrismaClientService');
const estoqueService = require('./EstoqueService');

async function criarPedido(nomeCliente, emailCliente, itensCarrinho) {
    if (!itensCarrinho || itensCarrinho.length === 0) {
        throw new Error("O carrinho não pode estar vazio.");
    }

    let valorTotal = 0;
    const itensParaTransacao = [];

    for (const item of itensCarrinho) {
        const produtoDb = await estoqueService.validarDisponibilidade(item.produtoId);

        if (produtoDb.estoque_atual < item.quantidade) {
            throw new Error(`Estoque insuficiente para "${produtoDb.titulo}". Disponível: ${produtoDb.estoque_atual}`);
        }
        
        valorTotal += item.quantidade * item.preco;
        
        itensParaTransacao.push({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            preco_unitario: item.preco,
        });
    }
    
    const resultadoTransacao = await prisma.$transaction(async (tx) => {
        const cliente = await tx.cliente.upsert({
            where: { email: emailCliente },
            update: { nome: nomeCliente },
            create: { nome: nomeCliente, email: emailCliente },
        });

        const novoPedido = await tx.pedido.create({
            data: {
                clienteId: cliente.id,
                valor_total: valorTotal,
                status: 'Novo',
            },
        });

        const operacoesEstoque = [];
        
        for (const item of itensParaTransacao) {
            await tx.itemPedido.create({
                data: {
                    pedidoId: novoPedido.id,
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco_unitario,
                },
            });
            
            operacoesEstoque.push(
                tx.produto.update({
                    where: { id: item.produtoId },
                    data: {
                        estoque_atual: {
                            decrement: item.quantidade,
                        },
                    },
                })
            );
        }
        
        await Promise.all(operacoesEstoque);

        return novoPedido;
    });

    return resultadoTransacao;
}


async function listarPedidosPorCliente(emailCliente) {
    const cliente = await prisma.cliente.findUnique({
        where: { email: emailCliente },
        select: { id: true }
    });

    if (!cliente) {
        throw new Error('Cliente não encontrado.');
    }

    const pedidos = await prisma.pedido.findMany({
        where: { clienteId: cliente.id },
        orderBy: { data_pedido: 'desc' }, 
        select: {
            id: true,
            data_pedido: true, 
            valor_total: true, 
            itensPedido: {
                select: {
                    quantidade: true,
                    preco_unitario: true,
                    produto: {
                        select: {
                            titulo: true, 
                            imagem_url: true, 
                        },
                    },
                },
            },
        },
    });

    return pedidos.map(pedido => ({
        id: pedido.id,
        data: pedido.data_pedido,
        valor_total: pedido.valor_total,
        produtos: pedido.itensPedido.map(item => ({
            titulo: item.produto.titulo,
            quantidade: item.quantidade,
            preco_unitario: item.preco_unitario,
            imagem_url: item.produto.imagem_url,
        }))
    }));
}

module.exports = {
    criarPedido,
    listarPedidosPorCliente, 
};