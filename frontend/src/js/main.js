import { initCatalogo } from './catalogo.js';
import { initCarrinho, atualizarContadorNavbar } from './carrinho.js';
import { initCheckout } from './checkout.js';
import { initMeusPedidos } from './meuspedidos.js';

document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorNavbar();


    if (document.getElementById('product-list')) {
        console.log('Página detectada: Catálogo');
        initCatalogo();
    }

    if (document.getElementById('tabela-carrinho')) {
        console.log('Página detectada: Carrinho');
        initCarrinho();
    }

    if (document.getElementById('form-checkout')) {
        console.log('Página detectada: Checkout');
        initCheckout();
    }

    if (document.getElementById('form-busca-pedidos')) {
        console.log('Página detectada: Minhas Compras');
        initMeusPedidos();
    }
});