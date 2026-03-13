import { convertImageToPng, downloadFile } from '../services/imageConverter'

function DropZone() {
  async function handleFile(file: File) {
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      alert('Por enquanto só aceitamos arquivos JPG!')
      return
    }

    try {
      const result = await convertImageToPng(file)
      const newName = file.name.replace(/\.(jpg|jpeg)$/i, '.png')
      downloadFile(result, newName)
    } catch (error) {
      alert('Erro ao converter o arquivo.')
    }
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
      <p className="text-xs text-gray-600 mt-3">Suporte atual: JPG → PNG</p>
    </div>
  )
}

export default DropZone