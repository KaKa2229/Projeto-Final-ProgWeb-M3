const prisma = require('./PrismaClientService');


async function validarDisponibilidade(produtoId) {
    
    const produto = await prisma.produto.findUnique({
        where: { id: produtoId },
        select: { estoque_atual: true, titulo: true } 
    });

    if (!produto) {
        throw new Error(`Produto de ID ${produtoId} não encontrado.`);
    }

    return produto; 
}

module.exports = {
    validarDisponibilidade,
};