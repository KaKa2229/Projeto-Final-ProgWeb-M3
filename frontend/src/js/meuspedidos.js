import { apiGet } from './api.js';

export function initMeusPedidos() {
    const form = document.getElementById('form-busca-pedidos');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email-cliente').value.trim();
        if (!email) return;

        await buscarPedidos(email);
    });
}

async function buscarPedidos(email) {
    const container = document.getElementById('resultado-pedidos');
    container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p>Buscando pedidos...</p></div>';

    try {
        const pedidos = await apiGet(`/pedidos/cliente/${encodeURIComponent(email)}`);

        renderizarListaPedidos(pedidos);

    } catch (error) {
        console.error(error);
        if (error.message.includes('404')) {
             container.innerHTML = `
                <div class="alert alert-warning text-center">
                    Nenhum cliente encontrado com este e-mail.
                </div>`;
        } else {
            container.innerHTML = `
                <div class="alert alert-danger text-center">
                    Erro ao buscar pedidos: ${error.message}
                </div>`;
        }
    }
}

function renderizarListaPedidos(pedidos) {
    const container = document.getElementById('resultado-pedidos');
    container.innerHTML = '';

    if (pedidos.length === 0) {
        container.innerHTML = '<div class="alert alert-info text-center">Você ainda não fez nenhum pedido conosco.</div>';
        return;
    }

    const accordion = document.createElement('div');
    accordion.className = 'accordion';
    accordion.id = 'accordionPedidos';

    pedidos.forEach((pedido, index) => {
        const dataFormatada = new Date(pedido.data).toLocaleDateString('pt-BR', { 
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        });

        const itensHtml = pedido.produtos.map(prod => `
            <tr>
                <td>
                    <img src="${prod.imagem_url}" alt="" style="width: 40px; height: 40px; object-fit: contain;">
                    ${prod.titulo}
                </td>
                <td class="text-center">${prod.quantidade}</td>
                <td class="text-end">R$ ${prod.preco_unitario.toFixed(2)}</td>
                <td class="text-end fw-bold">R$ ${(prod.quantidade * prod.preco_unitario).toFixed(2)}</td>
            </tr>
        `).join('');

        const itemAccordion = document.createElement('div');
        itemAccordion.className = 'accordion-item';
        
        itemAccordion.innerHTML = `
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                    <div class="d-flex w-100 justify-content-between me-3 align-items-center">
                        <span><strong>Pedido #${pedido.id}</strong> <small class="text-muted ms-2">${dataFormatada}</small></span>
                        <span class="badge bg-success rounded-pill">Total: R$ ${pedido.valor_total.toFixed(2)}</span>
                    </div>
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#accordionPedidos">
                <div class="accordion-body">
                    <h6 class="mb-3">Itens do Pedido:</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered">
                            <thead class="table-light">
                                <tr>
                                    <th>Produto</th>
                                    <th class="text-center">Qtd</th>
                                    <th class="text-end">Unit.</th>
                                    <th class="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itensHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        accordion.appendChild(itemAccordion);
    });

    container.appendChild(accordion);
}