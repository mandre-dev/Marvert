import type { Format } from '../App'

interface Props {
  format: Format
  setFormat: (f: Format) => void
}

const formats: { from: string; to: string; value: Format }[] = [
  { from: 'JPG', to: 'PNG', value: 'jpg-png' },
  { from: 'PNG', to: 'JPG', value: 'png-jpg' },
  { from: 'XLSX', to: 'CSV', value: 'xlsx-csv' },
  { from: 'PDF', to: 'JPG', value: 'pdf-jpg' },
]

function FormatSelector({ format, setFormat }: Props) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
        Escolha a conversão
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {formats.map((f) => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            className={`border rounded-xl py-3 px-4 text-sm transition-colors ${
              format === f.value
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-800 bg-gray-900 hover:border-blue-500'
            }`}
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