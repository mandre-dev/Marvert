
# Marvert

Conversor de arquivos web — rápido, gratuito e agora com backend para conversão de vídeos!

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

🌐 [Acessar o projeto](https://marvert.vercel.app)

## 📌 Sobre o projeto


O **Marvert** é uma aplicação web moderna para conversão de arquivos entre diferentes formatos.

**Novidade:** Agora conta com um backend Node.js/Express para conversão de vídeos WebM ↔ MP4 usando ffmpeg, garantindo maior compatibilidade e desempenho para vídeos pesados.

Outros arquivos continuam sendo processados no navegador, garantindo privacidade e velocidade.

## ✅ Funcionalidades


**🖼️ Imagens**
- JPG → PNG
- PNG → JPG
- JPG → PDF
- PNG → PDF

**📄 PDF**
- PDF → JPG
- PDF → PNG
- PDF → DOCX
- PDF → XLSX
- Juntar múltiplos PDFs
- Comprimir PDF

**📝 Documentos**
- DOCX → TXT
- DOCX → PDF
- TXT → DOCX

**📊 Planilhas**
- XLSX → CSV
- CSV → XLSX
- XLSX → PDF

**🎬 Vídeos**
- WebM → MP4 (via backend)
- MP4 → WebM (via backend)

- [React](https://react.dev) — biblioteca de interface
- [TypeScript](https://www.typescriptlang.org) — tipagem estática
- [Vite](https://vitejs.dev) — bundler moderno
- [Tailwind CSS](https://tailwindcss.com) — estilização utilitária
- [React Router](https://reactrouter.com) — navegação entre páginas
- [Node.js](https://nodejs.org) + [Express](https://expressjs.com) — backend para conversão de vídeos
- [ffmpeg](https://ffmpeg.org) — conversão de vídeos no backend
- [PDF.js](https://mozilla.github.io/pdf.js/) — conversão de PDF no browser
- [pdf-lib](https://pdf-lib.js.org) — junção de PDFs
- [SheetJS](https://sheetjs.com) — leitura e exportação de planilhas
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) — extração de texto DOCX
- [jsPDF](https://github.com/parallax/jsPDF) — geração de PDFs
- [ExcelJS](https://github.com/exceljs/exceljs) — geração de planilhas
- [docx](https://docx.js.org) — geração de documentos Word
- Canvas API — conversão de imagens nativa do browser


## 🛠️ Como rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/mandre-dev/marvert.git
cd marvert
```

### 2. Instale as dependências do frontend
```bash
cd marvert
npm install
```

### 3. Instale as dependências do backend
```bash
cd ../backend
npm install
```

### 4. Inicie o backend (requer ffmpeg instalado no sistema)
```bash
npm start
# O backend estará em http://localhost:3001
```

### 5. Em outro terminal, inicie o frontend
```bash
cd ../marvert
npm run dev
# O frontend estará em http://localhost:5173
```


## 📁 Estrutura do projeto
```
marvert-project/
├── backend/              # Backend Node.js/Express para conversão de vídeos
│   ├── index.js
│   ├── package.json
│   └── ...
├── marvert/              # Frontend React (Vite)
│   ├── src/
│   ├── package.json
│   └── ...
├── README.md             # Este arquivo
└── ...
```

## 👨‍💻 Autor

Feito por **Mandré** — projeto desenvolvido para portfólio!

🔗 [marvert.vercel.app](https://marvert.vercel.app)
