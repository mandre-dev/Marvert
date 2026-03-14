import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mergePdfs, downloadPdf } from '../services/pdfMerger'

function MergePdfPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function handleClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.multiple = true
    input.onchange = (e) => {
      const selected = Array.from((e.target as HTMLInputElement).files || [])
      setFiles((prev) => [...prev, ...selected])
    }
    input.click()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped])
  }

  async function handleMerge() {
    if (files.length < 2) {
      alert('Adicione pelo menos 2 arquivos PDF!')
      return
    }
    setLoading(true)
    try {
      const merged = await mergePdfs(files)
      downloadPdf(merged, 'merged.pdf')
      setDone(true)
    } catch {
      alert('Erro ao juntar os PDFs.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-500 hover:text-white transition-colors mb-8 flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="text-center mb-10">
        <div className="text-5xl mb-4">📎</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Juntar PDFs</h1>
        <p className="text-gray-500 text-sm">Adicione os PDFs na ordem desejada e clique em juntar.</p>
      </div>

      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors mb-6"
      >
        <div className="text-4xl sm:text-5xl mb-4">📂</div>
        <p className="text-base sm:text-lg font-semibold text-gray-200 mb-1">
          Arraste seus PDFs aqui
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          ou <span className="text-blue-400">clique para selecionar</span> — múltiplos arquivos
        </p>
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            Arquivos adicionados ({files.length})
          </p>
          <div className="flex flex-col gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-red-400 text-sm font-bold">PDF</span>
                  <span className="text-sm text-gray-300">{file.name}</span>
                </div>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  className="text-gray-600 hover:text-red-400 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleMerge}
            disabled={loading}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Juntando...' : `Juntar ${files.length} PDFs`}
          </button>

          {done && (
            <div className="mt-4 flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <span className="text-green-400">✓</span>
              <span className="text-sm text-gray-300">merged.pdf baixado com sucesso!</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MergePdfPage