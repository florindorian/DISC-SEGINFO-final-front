// =============================================================
// Define as funções de requisição para as rotas da API do backend (services)
// =============================================================
// Entrada: Nenhuma (define e exporta funções de serviço)
// Saída: Objeto (apiService com métodos)

import { API_BASE_URL } from './apiConfig.js';

const getJwt = () => {
    return localStorage.getItem('appJwt');
};

async function httpRequest(url, options = {}) {
    const jwtToken = getJwt();
    if (jwtToken) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${jwtToken}`
        };
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, options);

        if (!response.ok) {
            let errorDetails = `HTTP error! status: ${response.status}`;
            try {
                const errorBody = await response.json().catch(() => response.text());
                if (typeof errorBody === 'object' && errorBody !== null) {
                    errorDetails += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
                } else if (typeof errorBody === 'string' && errorBody.length > 0) {
                    errorDetails += ` - ${errorBody}`;
                } else {
                    errorDetails += ` - No details provided.`;
                }
            } catch (parseError) {
                errorDetails += ` - Failed to parse error response body.`;
            }
            throw new Error(errorDetails);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }

    } catch (error) {
        console.error(`Erro na requisição para ${url}:`, error);
        throw error;
    }
}

async function getGreeting() { return httpRequest('/'); }
async function postData(data) {
    return httpRequest('/dados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}
async function scheduleEvent(eventDetails) {
    return httpRequest('/schedule-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventDetails)
    });
}
async function checkAuthStatus() {
    return httpRequest('/check-auth');
}
async function importEventsFromSheet(spreadsheetId, sheetName) {
    return httpRequest('/sheets/import-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId, sheetName })
    });
}

/**
 * Realiza o logout do usuário.
 * @returns {Promise<object>} - A resposta do servidor sobre o logout.
 */
// Entrada: Nenhuma
// Saída: Promise<Object>
async function logout() {
    // Logout é uma requisição POST para invalidar a sessão no backend.
    // O JWT será automaticamente incluído por httpRequest.
    return httpRequest('/auth/logout', {
        method: 'POST'
        // Não precisa de body, o backend pega sessionId do JWT.
    });
}


export { getGreeting, postData, scheduleEvent, checkAuthStatus, importEventsFromSheet, logout };