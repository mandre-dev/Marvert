const formats = [
  { from: 'JPG', to: 'PNG' },
  { from: 'PNG', to: 'JPG' },
  { from: 'PDF', to: 'JPG' },
  { from: 'XLSX', to: 'CSV' },
]

function FormatSelector() {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
        Escolha a conversão
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {formats.map((f) => (
          <button
            key={f.from + f.to}
            className="bg-gray-900 border border-gray-800 rounded-xl py-3 px-4 text-sm hover:border-blue-500 transition-colors"
          >
            <span className="font-bold text-gray-200">{f.from}</span>
            <span className="text-gray-500 mx-2">→</span>
            <span className="font-bold text-blue-400">{f.to}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FormatSelector