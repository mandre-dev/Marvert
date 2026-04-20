import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { execFile } from 'child_process';
import { unlink, rename } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3001;

// Helper para caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { existsSync } from 'fs';

app.post('/convert', upload.single('video'), async (req, res) => {
  if (!req.file) {
    console.log('Nenhum arquivo enviado.');
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  const inputPath = req.file.path;
  // Detecta extensão do arquivo enviado
  const ext = path.extname(req.file.originalname).toLowerCase();
  let outputPath, ffmpegArgs, downloadName;
  if (ext === '.webm') {
    outputPath = path.join(__dirname, 'uploads', `${req.file.filename}.mp4`);
    ffmpegArgs = ['-i', inputPath, '-c:v', 'libx264', '-c:a', 'aac', outputPath];
    downloadName = 'converted.mp4';
  } else if (ext === '.mp4') {
    outputPath = path.join(__dirname, 'uploads', `${req.file.filename}.webm`);
    ffmpegArgs = ['-i', inputPath, '-c:v', 'libvpx-vp9', '-c:a', 'libopus', outputPath];
    downloadName = 'converted.webm';
  } else {
    await unlink(inputPath);
    return res.status(400).json({ error: 'Formato de arquivo não suportado.' });
  }

  console.log('Recebido arquivo para conversão:', inputPath, '->', outputPath);
  execFile('ffmpeg', ffmpegArgs, async (err, stdout, stderr) => {
    await unlink(inputPath);
    if (err) {
      console.error('Erro ao converter vídeo:', err.message);
      console.error('stderr:', stderr);
      return res.status(500).json({ error: 'Erro ao converter vídeo.', details: err.message });
    }
    if (!existsSync(outputPath)) {
      console.error('Arquivo convertido não encontrado:', outputPath);
      return res.status(500).json({ error: 'Arquivo convertido não encontrado.' });
    }
    console.log('Arquivo convertido gerado:', outputPath);
    res.download(outputPath, downloadName, async (err) => {
      if (err) {
        console.error('Erro ao enviar arquivo convertido:', err.message);
      }
      await unlink(outputPath);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
