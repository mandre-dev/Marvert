import { useNavigate } from 'react-router-dom'
import { convertImageToPng, convertImageToJpg, downloadFile } from '../services/imageConverter'
import { convertXlsxToCsv, downloadCsv } from '../services/spreadsheetConverter'
import { convertPdfToJpg } from '../services/pdfConverter'
import { useState } from 'react'

export type ConversionType = 'pdf-jpg' | 'jpg-png' | 'png-jpg' | 'xlsx-csv'

interface Props {
  type: ConversionType
}

const config = {
  'pdf-jpg': { from: 'PDF', to: 'JPG', accept: '.pdf', label: 'PDF → JPG', icon: '📄', color: 'border-red-500' },
  'jpg-png': { from: 'JPG', to: 'PNG', accept: '.jpg,.jpeg', label: 'JPG → PNG', icon: '🖼️', color: 'border-yellow-500' },
  'png-jpg': { from: 'PNG', to: 'JPG', accept: '.png', label: 'PNG → JPG', icon: '🖼️', color: 'border-blue-500' },
  'xlsx-csv': { from: 'XLSX', to: 'CSV', accept: '.xlsx', label: 'XLSX → CSV', icon: '📊', color: 'border-green-500' },
}

interface ConvertedFile {
  name: string
}

function ConverterPage({ type }: Props) {
  const navigate = useNavigate()
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [loading, setLoading] = useState(false)
  const conf = config[type]

  async function handleFile(file: File) {
    setLoading(true)
    try {
      if (type === 'jpg-png') {
        const result = await convertImageToPng(file)
        const newName = file.name.replace(/\.(jpg|jpeg)$/i, '.png')
        downloadFile(result, newName)
        setConvertedFiles((prev) => [{ name: newName }, ...prev])
      }
      if (type === 'png-jpg') {
        const result = await convertImageToJpg(file)
        const newName = file.name.replace(/\.png$/i, '.jpg')
        downloadFile(result, newName)
        setConvertedFiles((prev) => [{ name: newName }, ...prev])
      }
      if (type === 'xlsx-csv') {
        const csv = await convertXlsxToCsv(file)
        const newName = file.name.replace(/\.xlsx$/i, '.csv')
        downloadCsv(csv, newName)
        setConvertedFiles((prev) => [{ name: newName }, ...prev])
      }
      if (type === 'pdf-jpg') {
        const images = await convertPdfToJpg(file)
        images.forEach((img, index) => {
          const newName = file.name.replace(/\.pdf$/i, `_page${index + 1}.jpg`)
          downloadFile(img, newName)
          setConvertedFiles((prev) => [{ name: newName }, ...prev])
        })
      }
    } catch (error) {
      alert('Erro ao converter o arquivo.')
    }
    setLoading(false)
  }

  function handleClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = conf.accept
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
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-500 hover:text-white transition-colors mb-8 flex items-center gap-2"
      >
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
        className={`border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:${conf.color} transition-colors mb-6`}
      >
        {loading ? (
          <div>
            <div className="text-4xl mb-4 animate-spin">⚙️</div>
            <p className="text-gray-400 text-sm">Convertendo...</p>
          </div>
        ) : (
          <>
            <div className="text-4xl sm:text-5xl mb-4">📂</div>
            <p className="text-base sm:text-lg font-semibold text-gray-200 mb-1">
              Arraste seu arquivo aqui
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              ou <span className="text-blue-400">clique para selecionar</span>
            </p>
          </>
        )}
      </div>

      {convertedFiles.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            Conversões realizadas
          </p>
          <div className="flex flex-col gap-2">
            {convertedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3"
              >
                <span className="text-green-400">✓</span>
                <span className="text-sm text-gray-300">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConverterPage
