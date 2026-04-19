
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertVideo } from '../services/videoConverter';


function VideoConverter({ type }: { type: 'webm-to-mp4' | 'mp4-to-webm' }) {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const conf = type === 'webm-to-mp4'
    ? { label: 'WEBM → MP4', accept: '.webm', color: 'hover:border-pink-500', icon: '🎬' }
    : { label: 'MP4 → WEBM', accept: '.mp4', color: 'hover:border-pink-300', icon: '🎬' };

  function handleClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = conf.accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setFile(file);
      setOutputUrl(null);
    };
    input.click();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setFile(file);
    setOutputUrl(null);
  }

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await convertVideo(file, type);
      setOutputUrl(URL.createObjectURL(result));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/')} className="text-base text-gray-500 hover:text-white transition-colors mb-8 flex items-center gap-2">
        ← Voltar
      </button>
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">{conf.icon}</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{conf.label}</h1>
        <p className="text-gray-500 text-sm">Processamento 100% no navegador, sem envio de dados.</p>
      </div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer ${conf.color} transition-colors mb-6`}
      >
        {loading ? (
          <div>
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-400 text-sm">Convertendo...</p>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg font-semibold text-gray-200 mb-1">Arraste seu vídeo aqui</p>
            <p className="text-sm text-gray-500">ou <span className="text-blue-400">clique para selecionar</span></p>
          </>
        )}
      </div>
      {file && !loading && (
        <button
          className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold mb-6"
          onClick={handleConvert}
        >
          Converter
        </button>
      )}
      {outputUrl && (
        <div className="mt-6">
          <video src={outputUrl} controls className="w-full rounded mb-2" />
          <a
            href={outputUrl}
            download={file?.name.replace(/\.(webm|mp4)$/i, type === 'webm-to-mp4' ? '.mp4' : '.webm')}
            className="block text-center py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-bold mt-2"
          >
            Baixar vídeo convertido
          </a>
        </div>
      )}
    </div>
  );
}

export default VideoConverter;
