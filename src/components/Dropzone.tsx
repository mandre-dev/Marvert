function DropZone() {
  return (
    <div className="border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors mb-6">
      <div className="text-5xl mb-4">📂</div>
      <p className="text-lg font-semibold text-gray-200 mb-1">
        Arraste seus arquivos aqui
      </p>
      <p className="text-sm text-gray-500">
        ou <span className="text-blue-400">clique para selecionar</span> — até 50MB
      </p>
    </div>
  )
}

export default DropZone