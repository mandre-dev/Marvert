import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { convertJpgToOdt, downloadOdt } from '../services/jpgToOdt'

function JpgToOdtPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [convertedFiles, setConvertedFiles] = useState<string[]>([])

  async function handleFile(file: File) {
    setLoading(true)
    try {
      const blob = await convertJpgToOdt(file)
      const newName = file.name.replace(/\.(jpg|jpeg)$/i, '.odt')
      downloadOdt(blob, newName)
      setConvertedFiles((prev) => [newName, ...prev])
    } catch {
      alert('Erro ao converter o arquivo.')
    }
    setLoading(false)
  }

  function handleClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.jpeg'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFile(file)
    }
    input.click()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/')} className="text-base text-gray-500 hover:text-white transition-colors mb-8 flex items-center gap-2">
        ← Voltar
      </button>
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🖼️</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">JPG → ODT</h1>
        <p className="text-gray-500 text-sm">Incorpore sua imagem JPG em um documento LibreOffice.</p>
        <p className="text-xs text-yellow-500 mt-2">⚠️ A imagem será incorporada no documento ODT.</p>
      </div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-300 transition-colors mb-6"
      >
        {loading ? (
          <div>
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-400 text-sm">Convertendo...</p>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg font-semibold text-gray-200 mb-1">Arraste sua imagem JPG aqui</p>
            <p className="text-sm text-gray-500">ou <span className="text-blue-400">clique para selecionar</span></p>
          </>
        )}
      </div>
      {convertedFiles.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Conversões realizadas</p>
          <div className="flex flex-col gap-2">
            {convertedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <span className="text-green-400">✓</span>
                <span className="text-sm text-gray-300">{file}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default JpgToOdtPage