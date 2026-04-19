


export async function convertVideo(file: File, type: 'webm-to-mp4' | 'mp4-to-webm'): Promise<Blob> {
  const ffmpegModule = await import('@ffmpeg/ffmpeg');
  const createFFmpeg = ffmpegModule.createFFmpeg || ffmpegModule.default.createFFmpeg;
  const fetchFile = ffmpegModule.fetchFile || ffmpegModule.default.fetchFile;
  const ffmpeg = createFFmpeg({ log: false });

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const inputExt = type === 'webm-to-mp4' ? 'webm' : 'mp4';
  const outputExt = type === 'webm-to-mp4' ? 'mp4' : 'webm';
  const inputName = `input.${inputExt}`;
  const outputName = `output.${outputExt}`;

  ffmpeg.FS('writeFile', inputName, await fetchFile(file));

  await ffmpeg.run('-i', inputName, '-c:v', 'copy', '-c:a', 'aac', outputName);

  const data = ffmpeg.FS('readFile', outputName);
  return new Blob([data.buffer], { type: `video/${outputExt}` });
}
