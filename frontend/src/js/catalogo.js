import { apiGet, apiPost } from './api.js';
import { adicionarItemAoCarrinho } from './carrinho.js';

const productList = document.getElementById('product-list');
const categoryList = document.getElementById('lista-categorias');
const searchInput = document.getElementById('filtro-texto');
const searchForm = document.getElementById('form-busca');
const statusMessage = document.getElementById('status-message');

let categoriaAtual = 'all';


function renderizarProdutos(products) {
    productList.innerHTML = '';

    if (!products || products.length === 0) {
        productList.innerHTML = '<p class="col-12 text-center text-muted">Nenhum produto encontrado.</p>';
        return;
    }

    products.forEach(product => {
        const stockClass = product.estoque_atual > 0 ? 'text-success' : 'text-danger fw-bold';
        const disabledAttr = product.estoque_atual === 0 ? 'disabled' : '';
        const textoEstoque = product.estoque_atual > 0 ? `Estoque: ${product.estoque_atual}` : 'Esgotado';
        
        const produtoCard = `
            <div class="col">
                <div class="card shadow-sm h-100 border-0">
                    <img src="${product.imagem_url}" class="card-img-top" alt="${product.titulo}" style="height: 200px; object-fit: contain; padding: 20px;">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title text-dark">${product.titulo}</h6>
                        <p class="card-text text-muted small text-uppercase">${product.categoria}</p>
                        <p class="card-text fw-bold fs-5 mt-auto text-primary">R$ ${product.preco.toFixed(2)}</p>
                        <small class="${stockClass} mb-2">${textoEstoque}</small>
                        
                        <button class="btn btn-sm btn-primary mt-2 btn-adicionar-carrinho w-100" 
                                data-id="${product.id}" 
                                data-nome="${product.titulo}"
                                data-preco="${product.preco.toFixed(2)}"
                                ${disabledAttr}>
                            ${product.estoque_atual > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        productList.innerHTML += produtoCard;
    });
    
    adicionarListenersCarrinho();
}


function adicionarListenersCarrinho() {
    document.querySelectorAll('.btn-adicionar-carrinho').forEach(button => {
        button.addEventListener('click', async (event) => {
            const btn = event.target;
            const originalText = btn.textContent;
            
            const id = parseInt(btn.dataset.id);
            const nome = btn.dataset.nome;
            const preco = parseFloat(btn.dataset.preco);
            
            try {
                btn.disabled = true;
                btn.textContent = 'Verificando...';

                await apiPost('/estoque/validar', { produtoId: id, quantidade: 1 });

                adicionarItemAoCarrinho({ id, nome, preco, quantidade: 1 });
                
                btn.textContent = 'Adicionado!';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }, 1000);

            } catch (error) {
                alert(`Não foi possível adicionar: ${error.message}`);
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    });
}


async function carregarEFiltrarProdutos() {
    statusMessage.textContent = 'Carregando Produtos...';
    productList.innerHTML = ''; 
    
    let url = '/produtos?';
    
    if (categoriaAtual !== 'all') {
        url += `categoria=${encodeURIComponent(categoriaAtual)}&`;
    }
    
    const termoBusca = searchInput.value.trim();
    if (termoBusca) {
        url += `busca=${encodeURIComponent(termoBusca)}`;
    }

    try {
        const produtos = await apiGet(url);
        statusMessage.textContent = '';
        renderizarProdutos(produtos);
    } catch (error) {
        console.error(error);
        statusMessage.textContent = 'Erro ao carregar catálogo.';
        statusMessage.className = 'text-center text-danger fw-bold mb-3';
    }
}


function carregarCategorias() {
    const categoriasConhecidas = [
        "electronics",
        "jewelery",
        "men's clothing",
        "women's clothing"
    ];

    categoryList.innerHTML = '';

    const btnAll = document.createElement('button');
    btnAll.className = 'list-group-item list-group-item-action active fw-bold';
    btnAll.textContent = 'Todas as Categorias';
    btnAll.dataset.category = 'all';
    categoryList.appendChild(btnAll);

    categoriasConhecidas.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'list-group-item list-group-item-action';
        btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.dataset.category = cat;
        categoryList.appendChild(btn);
    });
}


function controleDeCategorias() {
    categoryList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            document.querySelectorAll('#lista-categorias button').forEach(btn => {
                btn.classList.remove('active', 'fw-bold');
            });
            
            event.target.classList.add('active', 'fw-bold');
            
            categoriaAtual = event.target.dataset.category;
            carregarEFiltrarProdutos();
        }
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        carregarEFiltrarProdutos();
    });
}

export function initCatalogo() {
    carregarCategorias();
    controleDeCategorias();
    carregarEFiltrarProdutos();
}