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

/**
 * Verifica o status de autenticação com o backend.
 * @returns {Promise<object>} - Objeto contendo `authenticated` (boolean) e `user` (object, se autenticado).
 */
// Entrada: Nenhuma
// Saída: Promise<Object>
async function checkAuthStatus() {
    return httpRequest('/check-auth'); // Não precisa de método específico, padrão é GET
}


/**
 * Importa eventos de uma planilha Google Sheets.
 * @param {string} spreadsheetId - O ID da planilha.
 * @param {string} sheetName - O nome da aba da planilha.
 * @returns {Promise<object>} - O resumo do processo de importação.
 */
// Entrada: spreadsheetId (String), sheetName (String)
// Saída: Promise<Object>
async function importEventsFromSheet(spreadsheetId, sheetName) {
    return httpRequest('/sheets/import-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId, sheetName })
    });
}


export { getGreeting, postData, scheduleEvent, checkAuthStatus, importEventsFromSheet }; // EXPORTA importEventsFromSheet