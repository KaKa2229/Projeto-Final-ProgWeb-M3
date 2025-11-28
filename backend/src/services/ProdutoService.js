const prisma = require('./PrismaClientService');

async function listarProdutos(categoria, termoBusca) {
    let condicoes = {};

    if (categoria) {
        condicoes.categoria = categoria;
    }

    if (termoBusca) {
        condicoes.OR = [
            { titulo: { contains: termoBusca } },
            { descricao: { contains: termoBusca } }
        ];
    }

    const produtos = await prisma.produto.findMany({
        where: condicoes,
        select: {
            id: true, 
            titulo: true, 
            preco: true, 
            categoria: true, 
            imagem_url: true, 
            estoque_atual: true, 
        },
    });

    return produtos;
}

async function detalharProduto(id) {
    const produto = await prisma.produto.findUnique({
        where: { id: id },
    });

    if (!produto) {
        throw new Error('Produto não encontrado.');
    }

    return produto;
}

module.exports = {
    listarProdutos,
    detalharProduto,
};