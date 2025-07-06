// Entrada: Nenhuma (inicializa e associa eventos)
// Saída: void
import { scheduleEvent, checkAuthStatus, importEventsFromSheet, logout} from './api/apiService.js';
import { displayResult, updateLoginStatusDisplay } from './utils/domHandler.js';

const appContent = document.getElementById('app-content');

// =============================================================
// Lógica de verificação de autenticação na página principal
// =============================================================
const verifyAuthAndLoadContent = async () => {
    const token = localStorage.getItem('appJwt');
    if (!token) {
        // Se não tem token no localStorage, redireciona para a página de login
        console.warn('Token JWT não encontrado. Redirecionando para login.');
        window.location.href = 'http://127.0.0.1:5500/login.html';
        return;
    }

    try {
        const status = await checkAuthStatus(); // Verifica o token com o backend
        if (status.authenticated) {
            updateLoginStatusDisplay(true, status.user.name);
            updateLoginButtonVisibility(true);
            displayResult(`Bem-vindo, ${status.user.name}!`);
            appContent.style.display = 'block'; // Mostra o conteúdo após a autenticação bem-sucedida
        } else {
            console.warn('Token JWT inválido ou sessão inativa. Redirecionando para login.');
            localStorage.removeItem('appJwt'); // Limpa token inválido
            window.location.href = 'http://127.0.0.1:5500/login.html';
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação inicial:', error);
        localStorage.removeItem('appJwt'); // Limpa token inválido ou erro de fetch
        window.location.href = 'http://127.0.0.1:5500/login.html';
    }
};

// Botão de Logout específico para index.html
async function handleLogout() {
    displayResult('Realizando logout...');
    try {
        await logout();
        localStorage.removeItem('appJwt');
        window.location.href = 'http://127.0.0.1:5500/login.html';
    } catch (error) {
        console.error('Erro ao realizar logout:', error);
        displayResult(`Erro ao realizar logout: ${error.message}`, true);
        // Se houver erro no logout, mesmo assim tente redirecionar para a página de login
        // para evitar que o usuário fique em um estado "meio logado".
        localStorage.removeItem('appJwt'); // Garante que o token é removido mesmo com erro no backend.
        window.location.href = 'http://127.0.0.1:5500/teste-frontend/login.html';
    }
}

// Gerenciamento de visibilidade de botões (agora apenas o botão de Logout é gerenciado)
const logoutBtn = document.getElementById('logoutBtn');
function updateLoginButtonVisibility(isAuthenticated) {
    if (isAuthenticated) {
        logoutBtn.style.display = 'inline-block';
    } else {
        logoutBtn.style.display = 'none';
    }
}



// =============================================================
// Função para lidar com o clique do botão "Agendar Evento"
// =============================================================
async function handleScheduleEvent() {
    const title = document.getElementById('eventTitle').value;
    const year = parseInt(document.getElementById('eventYear').value, 10);
    const month = parseInt(document.getElementById('eventMonth').value, 10);
    const day = parseInt(document.getElementById('eventDay').value, 10);

    if (!title || isNaN(year) || isNaN(month) || isNaN(day)) {
        displayResult('Por favor, preencha todos os campos do evento.', true);
        return;
    }

    try {
        const result = await scheduleEvent({ title, year, month, day });
        console.log('POST /schedule-event: ', result);
        displayResult(`Evento agendado com sucesso! <a href="${result.eventLink}" target="_blank">Ver no Google Calendar</a>`);
    } catch (error) {
        console.error('Erro ao agendar evento:', error);
        displayResult(`Erro ao agendar evento: ${error.message}`, true);
    }
}

// =============================================================
// Função auxiliar para extrair o ID da planilha da URL
// =============================================================
/**
 * Extrai o ID da planilha Google Sheets de uma URL.
 * @param {string} url - A URL completa da planilha (ex: "https://docs.google.com/spreadsheets/d/ID_AQUI/edit#gid=0").
 * @returns {string | null} - O ID da planilha ou null se não for encontrada.
 */
// Entrada: url (String)
// Saída: String (ID da planilha) ou null
function extractSpreadsheetIdFromUrl(url) {
    // Regex para capturar o ID entre "/d/" e "/edit" (ou outro "/view", etc.)
    // ou entre "/spreadsheets/" e "/edit" se for uma URL mais longa.
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)(?:\/edit|\/view|\/pub|\/export)?(?:#gid=\d+)?/i;
    const match = url.match(regex);
    if (match && match[1]) {
        console.log(`Front-end: ID da planilha extraído: ${match[1]}`);
        return match[1];
    }
    console.warn(`Front-end: Não foi possível extrair o ID da planilha da URL: "${url}"`);
    return null;
}


// Função para lidar com o clique do botão "Importar Eventos da Planilha"
async function handleImportEvents() {
    const spreadsheetUrl = document.getElementById('spreadsheetIdInput').value.trim(); // URL da planilha
    const sheetNameInput = document.getElementById('sheetNameInput').value.trim();

    if (!spreadsheetUrl) {
        displayResult('Por favor, insira a URL da Planilha Google.', true);
        return;
    }
    if (!sheetNameInput) {
        displayResult('Por favor, insira o Nome da Aba (ex: Sheet1).', true);
        return;
    }

    const spreadsheetId = extractSpreadsheetIdFromUrl(spreadsheetUrl); // extrai o ID da URL fornecida
    if (!spreadsheetId) {
        displayResult('Não foi possível extrair um ID válido da URL da planilha fornecida. Verifique se a URL está correta.', true);
        return;
    }

    displayResult(`Importando eventos da planilha "${spreadsheetId}" na aba "${sheetNameInput}"...`);

    try {
        const result = await importEventsFromSheet(spreadsheetId, sheetNameInput); // Passa o ID extraído
        console.log('POST /sheets/import-events: ', result);
        let successMessage = `Importação concluída! ${result.processedEvents.length} eventos processados.`;
        if (result.processedEvents.length > 0) {
             successMessage += `<br>Verifique seu Google Calendar e a planilha.`;
        }
        displayResult(successMessage);
    } catch (error) {
        console.error('Erro ao importar eventos da planilha:', error);
        displayResult(`Erro ao importar eventos da planilha: ${error.message}`, true);
    }
}

// ======================================================================
// Inicializa os eventos de clique e verifica o estado de autenticação
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scheduleEventBtn').addEventListener('click', handleScheduleEvent);
    document.getElementById('importEventsBtn').addEventListener('click', handleImportEvents);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Inicia a verificação de autenticação e carregamento do conteúdo.
    verifyAuthAndLoadContent();
});