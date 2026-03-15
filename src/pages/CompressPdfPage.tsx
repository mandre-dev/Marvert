import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { compressPdf, downloadCompressedPdf } from '../services/pdfCompressor'

function CompressPdfPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ original: number; compressed: number; name: string } | null>(null)

  async function handleFile(file: File) {
    setLoading(true)
    try {
      const blob = await compressPdf(file)
      const newName = file.name.replace(/\.pdf$/i, '_comprimido.pdf')
      downloadCompressedPdf(blob, newName)
      setResult({
        original: file.size,
        compressed: blob.size,
        name: newName,
      })
    } catch {
      alert('Erro ao comprimir o arquivo.')
    }
    setLoading(false)
  }

  function handleClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
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

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/')} className="text-base text-gray-500 hover:text-white transition-colors mb-8 flex items-center gap-2">
        ← Voltar
      </button>
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🗜️</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Comprimir PDF</h1>
        <p className="text-gray-500 text-sm">Reduza o tamanho do seu PDF.</p>
        <p className="text-xs text-yellow-500 mt-2">⚠️ Compressão básica, funciona melhor em PDFs simples.</p>
      </div>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:border-orange-400 transition-colors mb-6"
      >
        {loading ? (
          <div>
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-400 text-sm">Comprimindo...</p>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg font-semibold text-gray-200 mb-1">Arraste seu PDF aqui</p>
            <p className="text-sm text-gray-500">ou <span className="text-blue-400">clique para selecionar</span></p>
          </>
        )}
      </div>

      {result && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Resultado</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <span className="text-green-400">✓</span>
              <span className="text-sm text-gray-300 flex-1">{result.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Original</div>
                <div className="text-sm font-bold text-white">{formatSize(result.original)}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Comprimido</div>
                <div className="text-sm font-bold text-green-400">{formatSize(result.compressed)}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Redução</div>
                <div className="text-sm font-bold text-blue-400">
                  {Math.round((1 - result.compressed / result.original) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompressPdfPage