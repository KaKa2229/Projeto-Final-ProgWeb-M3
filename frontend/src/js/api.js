const API_BASE_URL = 'http://localhost:3000/api';


async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || `Erro HTTP: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error(`Erro na requisição GET para ${endpoint}:`, error);
        throw error;
    }
}


async function apiPost(endpoint, dados) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || `Erro HTTP: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`Erro na requisição POST para ${endpoint}:`, error);
        throw error;
    }
}

export {
    apiGet,
    apiPost
};