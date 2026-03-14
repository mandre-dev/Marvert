import { convertImageToPng, convertImageToJpg, downloadFile } from '../services/imageConverter'
import { convertXlsxToCsv, downloadCsv } from '../services/spreadsheetConverter'
import { convertPdfToJpg } from '../services/pdfConverter'
import type { Format } from '../App'
import type { ConvertedFile } from './FileList'

interface Props {
  format: Format
  onConverted: (file: ConvertedFile) => void
}

function DropZone({ format, onConverted }: Props) {
  async function handleFile(file: File) {
    try {
      if (format === 'jpg-png') {
        if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
          alert('Selecione um arquivo JPG!')
          return
        }
        const result = await convertImageToPng(file)
        const newName = file.name.replace(/\.(jpg|jpeg)$/i, '.png')
        downloadFile(result, newName)
        onConverted({ name: newName, from: 'JPG', to: 'PNG' })
      }

      if (format === 'png-jpg') {
        if (!file.type.includes('png')) {
          alert('Selecione um arquivo PNG!')
          return
        }
        const result = await convertImageToJpg(file)
        const newName = file.name.replace(/\.png$/i, '.jpg')
        downloadFile(result, newName)
        onConverted({ name: newName, from: 'PNG', to: 'JPG' })
      }

      if (format === 'xlsx-csv') {
        if (!file.name.endsWith('.xlsx')) {
          alert('Selecione um arquivo XLSX!')
          return
        }
        const csv = await convertXlsxToCsv(file)
        const newName = file.name.replace(/\.xlsx$/i, '.csv')
        downloadCsv(csv, newName)
        onConverted({ name: newName, from: 'XLSX', to: 'CSV' })
      }

      if (format === 'pdf-jpg') {
        if (!file.type.includes('pdf')) {
          alert('Selecione um arquivo PDF!')
          return
        }
        const images = await convertPdfToJpg(file)
        images.forEach((img, index) => {
          const newName = file.name.replace(/\.pdf$/i, `_page${index + 1}.jpg`)
          downloadFile(img, newName)
          onConverted({ name: newName, from: 'PDF', to: 'JPG' })
        })
      }

    } catch (error) {
      console.error('Erro na conversão:', error)
      alert('Erro ao converter o arquivo.')
    }
  }

  function handleClick() {
    const input = document.createElement('input')
    input.type = 'file'
    if (format === 'jpg-png') input.accept = '.jpg,.jpeg'
    if (format === 'png-jpg') input.accept = '.png'
    if (format === 'xlsx-csv') input.accept = '.xlsx'
    if (format === 'pdf-jpg') input.accept = '.pdf'
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

  const labels: Record<Format, string> = {
    'jpg-png': 'JPG → PNG',
    'png-jpg': 'PNG → JPG',
    'xlsx-csv': 'XLSX → CSV',
    'pdf-jpg': 'PDF → JPG',
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors mb-6"
    >
      <div className="text-5xl mb-4">📂</div>
      <p className="text-lg font-semibold text-gray-200 mb-1">
        Arraste seus arquivos aqui
      </p>
      <p className="text-sm text-gray-500">
        ou <span className="text-blue-400">clique para selecionar</span> — até 50MB
      </p>
      <p className="text-xs text-gray-600 mt-3">Conversão ativa: {labels[format]}</p>
    </div>
  )
}

export default DropZone