// Entrada: Nenhuma (inicializa e associa eventos)
// Saída: void
import { scheduleEvent, checkAuthStatus, importEventsFromSheet, logout} from './api/apiService.js';
import { displayResult } from './utils/domHandler.js';

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
        // Verifica o token com o backend
        const status = await checkAuthStatus(); // Retorna { authenticated: boolean, user: { name: string, email: string, picture: string } }
        if (status.authenticated) {
            updateProfileDisplay(true, status.user); // Preenche e mostra o perfil no header
            displayResult(`Bem-vindo(a), ${status.user.name}!`);
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
        // Se houver erro no logout, mesmo assim tenta redirecionar para a página de login
        // para evitar que o usuário fique em um estado "meio logado".
        localStorage.removeItem('appJwt'); // Garante que o token é removido mesmo com erro no backend.
        window.location.href = 'http://127.0.0.1:5500/login.html';
    }
}

// =============================================================
// Referências aos elementos do Novo Header
// =============================================================
const hamburgerMenu = document.getElementById('hamburgerMenu');
const mainNav = document.getElementById('mainNav');
const mainNavCloseBtn = document.getElementById('mainNavCloseBtn'); // Botão Fechar do menu principal
const profileMenuImage = document.getElementById('profileMenuImage');
const profileCardDropdown = document.getElementById('profileCardDropdown');
const profileDropdownCloseBtn = document.getElementById('profileDropdownCloseBtn'); // Botão Fechar do dropdown de perfil
const profilePicture = document.getElementById('profilePicture');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const logoutBtn = document.getElementById('logoutBtn');


function updateProfileDisplay(isAuthenticated, user = null) {
    if (isAuthenticated && user) {
        profileMenuImage.src = user.picture || 'https://placehold.co/35?text=IMG';
        profileMenuImage.style.display = 'block';
        
        profilePicture.src = user.picture || 'https://placehold.co/100?text=No\nPhoto';
        profileName.textContent = user.name || 'Usuário Desconhecido';
        profileEmail.textContent = user.email || '';
    } else {
        profileMenuImage.style.display = 'none';
        profileCardDropdown.classList.remove('active');
        profileCardDropdown.classList.remove('mobile-active');
    }
}

// =============================================================
// As funções show/hide agora gerenciam ambas as classes (active/mobile-active)
// =============================================================
let profileDropdownTimeout;

function showProfileDropdown() {
    clearTimeout(profileDropdownTimeout);
    if (profileCardDropdown) {
        // Desktop
        if (window.innerWidth > 768) {
            profileCardDropdown.classList.add('active');
            mainNav.classList.remove('active'); // Garante que o mainNav esteja fechado (se aberto por JS)
        } 
        // Mobile - Usa mobile-active
        else {
            profileCardDropdown.classList.add('mobile-active');
            mainNav.classList.remove('active'); // Garante que o mainNav esteja fechado
        }
    }
}

function hideProfileDropdown() {
    profileDropdownTimeout = setTimeout(() => {
        if (profileCardDropdown) {
            profileCardDropdown.classList.remove('active');
            profileCardDropdown.classList.remove('mobile-active');
        }
    }, 200);
}

// Lógica de toggle do menu hambúrguer
function toggleHamburgerMenu() {
    mainNav.classList.toggle('active');
    // Fecha o dropdown de perfil se o menu hambúrguer for aberto
    if (mainNav.classList.contains('active')) {
        hideProfileDropdown(); // Usa hideProfileDropdown para fechar
    }
}


// =============================================================
// Função para lidar com o clique do botão "Agendar Evento"
// =============================================================
async function handleScheduleEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    // Usa o operador || '0' para garantir que empty strings se tornem '0' para parseInt.
    // Se o input.value for "", parseInt("") é NaN.
    // Se for "0", parseInt("0") é 0.
    const year = parseInt(document.getElementById('eventYear').value || '0', 10);
    const month = parseInt(document.getElementById('eventMonth').value || '0', 10);
    const day = parseInt(document.getElementById('eventDay').value || '0', 10);
    const hour = parseInt(document.getElementById('eventHour').value || '0', 10);
    const minute = parseInt(document.getElementById('eventMinute').value || '0', 10);

    console.log(year, month, day, hour, minute);

    // Validação estendida no front-end
    if (!title) {
        displayResult('Título do evento é obrigatório.', true);
        return;
    }
    // Verifica se os valores são válidos numericamente e nos limites
    // A validação de range (min/max nos inputs HTML) e o || '0' deveriam evitar NaN.
    if (year < 1900 || year > 2100 ||
        month < 1 || month > 12 ||
        day < 1 || day > 31 ||
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59) {
        displayResult('Por favor, preencha todos os campos de data e hora com valores válidos.', true);
        return;
    }

    try {
        const result = await scheduleEvent({ title, year, month, day, hour, minute });
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
    
    // Listeners para a imagem de perfil
    if (profileMenuImage) {
        profileMenuImage.addEventListener('click', showProfileDropdown); // Click para abrir/fechar o dropdown de perfil
        // Desktop hover listeners
        profileMenuImage.addEventListener('mouseenter', showProfileDropdown);
        profileMenuImage.addEventListener('mouseleave', hideProfileDropdown);
    }
    // Listeners para o próprio card de perfil (dropdown)
    if (profileCardDropdown) {
        profileCardDropdown.addEventListener('mouseenter', showProfileDropdown);
        profileCardDropdown.addEventListener('mouseleave', hideProfileDropdown);
    }

    // =============================================================
    // Listeners para os botões de fechar "X"
    // =============================================================
    if (mainNavCloseBtn) {
        mainNavCloseBtn.addEventListener('click', () => {
            mainNav.classList.remove('active'); // Fecha o menu principal
            hideProfileDropdown(); // Garante que o perfil também feche
        });
    }
    if (profileDropdownCloseBtn) {
        profileDropdownCloseBtn.addEventListener('click', hideProfileDropdown); // Fecha o dropdown de perfil
    }


    // Esconde o dropdown/menu se clicar fora
    document.addEventListener('click', (event) => {
        const isClickInsideHeader = document.querySelector('.app-header').contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);
        const isClickOnProfileImage = profileMenuImage.contains(event.target);
        const isClickInsideProfileDropdown = profileCardDropdown.contains(event.target); // Para verificar clique dentro do dropdown

        if (!isClickInsideHeader || (!isClickOnHamburger && !isClickOnProfileImage && !isClickInsideProfileDropdown)) {
            mainNav.classList.remove('active');
            hideProfileDropdown();
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleHamburgerMenu);
    }
    
    verifyAuthAndLoadContent();
});