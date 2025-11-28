import { apiPost } from './api.js';

let carrinhoItens = JSON.parse(localStorage.getItem('carrinho')) || [];

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinhoItens));
    atualizarContadorNavbar();
}

export function atualizarContadorNavbar() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItens = carrinhoItens.reduce((acc, item) => acc + item.quantidade, 0);
        cartCount.textContent = totalItens;
    }
}

export function adicionarItemAoCarrinho(item) {
    const itemExistente = carrinhoItens.find(i => i.id === item.id);
    if (itemExistente) {
        itemExistente.quantidade += item.quantidade;
    } else {
        carrinhoItens.push(item);
    }
    salvarCarrinho();
}

export function getItensCarrinho() {
    return carrinhoItens;
}

export function limparCarrinho() {
    carrinhoItens = [];
    salvarCarrinho();
}


export function initCarrinho() {
    atualizarContadorNavbar();
    renderizarTabela();
}

function renderizarTabela() {
    const tbody = document.getElementById('tabela-carrinho');
    const msgVazio = document.getElementById('msg-carrinho-vazio');
    const btnCheckout = document.getElementById('btn-checkout');
    const totalEl = document.getElementById('total-carrinho');

    if (!tbody) return; 

    tbody.innerHTML = '';

    if (carrinhoItens.length === 0) {
        msgVazio.classList.remove('d-none');
        if(btnCheckout) btnCheckout.classList.add('disabled');
        totalEl.textContent = 'R$ 0,00';
        return;
    }

    msgVazio.classList.add('d-none');
    if(btnCheckout) btnCheckout.classList.remove('disabled');

    let totalGeral = 0;

    carrinhoItens.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="fw-bold">${item.nome}</span>
            </td>
            <td>
                <input type="number" class="form-control form-control-sm qtd-input" 
                    value="${item.quantidade}" min="1" data-index="${index}" data-id="${item.id}">
            </td>
            <td class="text-end">R$ ${item.preco.toFixed(2)}</td>
            <td class="text-end fw-bold">R$ ${subtotal.toFixed(2)}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger btn-remover" data-index="${index}">
                    &times;
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    totalEl.textContent = `R$ ${totalGeral.toFixed(2)}`;

    adicionarEventosTabela();
}

function adicionarEventosTabela() {
    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            carrinhoItens.splice(index, 1);
            salvarCarrinho();
            renderizarTabela();
        });
    });

    document.querySelectorAll('.qtd-input').forEach(input => {
        input.addEventListener('change', async (e) => {
            const index = e.target.dataset.index;
            const id = parseInt(e.target.dataset.id);
            const novaQtd = parseInt(e.target.value);

            if (novaQtd < 1) return;

            try {
                await apiPost('/estoque/validar', { produtoId: id, quantidade: novaQtd });
                
                carrinhoItens[index].quantidade = novaQtd;
                salvarCarrinho();
                renderizarTabela();
            } catch (error) {
                alert(`Estoque indisponível: ${error.message}`);
                e.target.value = carrinhoItens[index].quantidade; 
            }
        });
    });
}