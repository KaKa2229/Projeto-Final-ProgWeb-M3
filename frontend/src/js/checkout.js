import { apiPost } from './api.js';
import { getItensCarrinho, limparCarrinho } from './carrinho.js';

export function initCheckout() {
    const carrinho = getItensCarrinho();

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        window.location.href = 'index.html';
        return;
    }

    renderizarResumo(carrinho);
    configurarFormulario();
}

function renderizarResumo(carrinho) {
    const lista = document.getElementById('checkout-cart-list');
    const totalEl = document.getElementById('checkout-total');
    const countBadge = document.getElementById('cart-count-badge');
    
    lista.innerHTML = '';
    let total = 0;
    let qtdTotal = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        qtdTotal += item.quantidade;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between lh-sm';
        li.innerHTML = `
            <div>
                <h6 class="my-0">${item.nome}</h6>
                <small class="text-body-secondary">Qtd: ${item.quantidade}</small>
            </div>
            <span class="text-body-secondary">R$ ${subtotal.toFixed(2)}</span>
        `;
        lista.appendChild(li);
    });

    totalEl.textContent = `R$ ${total.toFixed(2)}`;
    countBadge.textContent = qtdTotal;
}

function configurarFormulario() {
    const form = document.getElementById('form-checkout');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const btn = document.getElementById('btn-finalizar');
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const carrinho = getItensCarrinho();

        const payload = {
            nome: nome,
            email: email,
            carrinho: carrinho.map(item => ({
                produtoId: item.id,
                quantidade: item.quantidade,
                preco: item.preco
            }))
        };

        try {
            btn.disabled = true;
            btn.textContent = 'Processando...';

            const resposta = await apiPost('/pedidos', payload);

            mostrarModalSucesso(resposta.numero_pedido, nome);
            limparCarrinho(); 

        } catch (error) {
            console.error(error);
            alert(`Erro ao finalizar compra: ${error.message}`);
            btn.disabled = false;
            btn.textContent = 'Finalizar Compra';
        }
    });
}

function mostrarModalSucesso(pedidoId, nome) {
    document.getElementById('sucesso-pedido-id').textContent = `#${pedidoId}`;
    document.getElementById('sucesso-nome-cliente').textContent = nome;
    
    const modalEl = document.getElementById('modalSucesso');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}