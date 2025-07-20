# 🌐 G-API Orchestrator: Google Service Integrator by OAuth Consent

![Repository](https://img.shields.io/badge/Repository-Frontend-red)
![GitHub Workflow Status](https://img.shields.io/badge/status-in%20development-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js Version](https://img.shields.io/badge/node->%3D22.15.1-green.svg)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue.svg)

Uma aplicação intermediária (API Gateway) que integra e gerencia o acesso aos serviços do Google (como Google Calendar e Google Sheets) em nome de usuários, utilizando o fluxo de consentimento OAuth 2.0. Desenvolvida em Node.js com Express, esta API foca em segurança, escalabilidade e boas práticas de arquitetura.

<p align="center">
  <a href="https://disc-seginfo-final-front.vercel.app/">
    <img alt="TESTAR APP" src="https://img.shields.io/badge/-TESTAR%20APP-red">
  </a>
</p>

<p align='center'>
    <strong>Vídeo Demonstrativo</strong>
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=5vDMU-wSDUo" title="Assista ao Vídeo">
    <img src="https://img.youtube.com/vi/5vDMU-wSDUo/0.jpg" alt="Thumbnail do vídeo">
  </a>
</p>


---


<span style="color: red;">Veja mais sobre a aplicação e sua documentação no [Repositório do Backend](https://github.com/florindorian/DISC-SEGINFO-final-back)</span>

<span style="color: red;">Ou [Teste a aplicação](https://disc-seginfo-final-front.vercel.app/) em deploy na [Vercel](https://vercel.com/).</span>


---

## Configurações

Importante ter em mente que a aplicação Front-end precisa saber qual a origem (URL) do Back-end e vice-versa. Portanto, certifique-se de configurar as URLs abaixo conforme o ambiente de produção ou de desenvolvimento que você pretende usar, e não esqueça de fazer o mesmo ao usar o repositório do Back-end (a diferença é que lá é feito no arquivo `.env`.).

`js/api/apiConfig.js` :
```js
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
```

`js/config.js` :
```js
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Ambiente de desenvolvimento local:
    // Conecta diretamente ao servidor backend local, na porta 3001 (ou qual estiver definida).
    FRONT_BASE_URL = 'http://localhost:5500';
} else {
    // Ambiente de produção (Vercel):
    // Usa o caminho relativo '/api/'.
    // O 'vercel.json' do frontend reescreverá /api/ para o URL do backend na Vercel.
    FRONT_BASE_URL = '';
}
```

## 👨‍💻 Autor

<a href="https://github.com/florindorian"><img src="https://github.com/florindorian.png" width=100></a>