const prisma = require('./PrismaClientService');


const importarProdutos = async () => {
    console.log('Iniciando importação de produtos...');
    
    const response = await fetch('https://fakestoreapi.com/products');
    const produtosFakeStore = await response.json();

    let produtosProcessados = 0;

    for (const produto of produtosFakeStore) {
        await prisma.produto.upsert({
            where: { fakeStoreId: produto.id }, 
            
            update: {
                titulo: produto.title,
                preco: produto.price,
                descricao: produto.description,
                categoria: produto.category,
                imagem_url: produto.image,
            },
            
            create: {
                fakeStoreId: produto.id,
                titulo: produto.title,
                preco: produto.price,
                descricao: produto.description,
                categoria: produto.category,
                imagem_url: produto.image,
                estoque_atual: 50 
            }
        });
        produtosProcessados++;
    }

    console.log(`Importação concluída. ${produtosProcessados} produtos processados.`);
    return produtosProcessados;
};

module.exports = {
    importarProdutos,
};