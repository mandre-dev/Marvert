# Marvert Backend

Backend simples para conversão de vídeos WebM para MP4 usando ffmpeg.

## Requisitos

- Node.js 18+
- ffmpeg instalado no sistema (`ffmpeg` disponível no PATH)

## Instalação

```bash
npm install
```

## Uso

```bash
npm start
```

O servidor irá rodar em http://localhost:3001

## Endpoint

### POST /convert

- Formato: multipart/form-data
- Campo do arquivo: `video`
- Retorna: arquivo convertido em MP4

Exemplo usando curl:

```bash
curl -F "video=@seuarquivo.webm" http://localhost:3001/convert --output convertido.mp4
```
