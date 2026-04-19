import React from 'react';
import VideoConverter from '../components/VideoConverter';

function VideoConverterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-6">Conversor de Vídeo</h1>
      <VideoConverter />
    </div>
  );
}

export default VideoConverterPage;
