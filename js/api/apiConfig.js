let API_BASE_URL;

// Verifica se o hostname atual é 'localhost' ou '127.0.0.1'
// (indicando que se está em ambiente de desenvolvimento local)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Ambiente de desenvolvimento local:
    // Conecta diretamente ao servidor backend local, na porta 3001 (ou qual estiver definida).
    API_BASE_URL = 'http://localhost:3001/';
} else {
    // Ambiente de produção (Vercel):
    // Usa o caminho relativo '/api/'.
    // O 'vercel.json' do frontend reescreverá /api/ para o URL do backend na Vercel.
    API_BASE_URL = '/api/';
}

export { API_BASE_URL };