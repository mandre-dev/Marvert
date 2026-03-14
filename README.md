<h1 align="center">
  <img src="public/logo.png" width="80" height="80" style="border-radius:16px" /><br/>
  Marvert
</h1>

<p align="center">
  Conversor de arquivos web — rápido, gratuito e seus arquivos nunca saem do seu dispositivo.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  <a href="https://marvert.vercel.app" target="_blank">🌐 Acessar o projeto</a>
</p>

---

## 📌 Sobre o projeto

O **Marvert** é uma aplicação web moderna para conversão de arquivos entre diferentes formatos. Todo o processamento acontece diretamente no navegador, sem enviar dados para servidores externos, garantindo privacidade e velocidade.

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

**📝 Documentos**
- DOCX → TXT
- DOCX → PDF
- TXT → DOCX

**📊 Planilhas**
- XLSX → CSV
- CSV → XLSX
- XLSX → PDF

## 🚀 Tecnologias

- [React](https://react.dev) — biblioteca de interface
- [TypeScript](https://www.typescriptlang.org) — tipagem estática
- [Vite](https://vitejs.dev) — bundler moderno
- [Tailwind CSS](https://tailwindcss.com) — estilização utilitária
- [React Router](https://reactrouter.com) — navegação entre páginas
- [PDF.js](https://mozilla.github.io/pdf.js/) — conversão de PDF no browser
- [pdf-lib](https://pdf-lib.js.org) — junção de PDFs
- [SheetJS](https://sheetjs.com) — leitura e exportação de planilhas
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) — extração de texto DOCX
- [jsPDF](https://github.com/parallax/jsPDF) — geração de PDFs
- [ExcelJS](https://github.com/exceljs/exceljs) — geração de planilhas
- [docx](https://docx.js.org) — geração de documentos Word
- Canvas API — conversão de imagens nativa do browser

## 🛠️ Como rodar localmente
```bash
# Clone o repositório
git clone https://github.com/mandre-dev/marvert.git

# Entre na pasta
cd marvert

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 📁 Estrutura do projeto
```
src/
├── components/
│   └── Header.tsx
├── pages/
│   ├── Home.tsx
│   ├── ConverterPage.tsx
│   ├── MergePdfPage.tsx
│   ├── PdfToDocxPage.tsx
│   ├── PdfToXlsxPage.tsx
│   ├── TxtToDocxPage.tsx
│   ├── DocxToPdfPage.tsx
│   ├── CsvToXlsxPage.tsx
│   ├── XlsxToPdfPage.tsx
│   └── ImageToPdfPage.tsx
├── services/
│   ├── imageConverter.ts
│   ├── spreadsheetConverter.ts
│   ├── pdfConverter.ts
│   ├── pdfMerger.ts
│   ├── docxConverter.ts
│   ├── pdfToDocx.ts
│   ├── pdfToXlsx.ts
│   ├── txtToDocx.ts
│   ├── docxToPdf.ts
│   ├── csvToXlsx.ts
│   ├── xlsxToPdf.ts
│   └── imageToPdf.ts
└── App.tsx
```

## 👨‍💻 Autor

Feito por **Mandré** — projeto desenvolvido para portfólio!

🔗 [marvert.vercel.app](https://marvert.vercel.app)