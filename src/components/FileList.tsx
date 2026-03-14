interface ConvertedFile {
  name: string
  from: string
  to: string
}

interface Props {
  files: ConvertedFile[]
}

function FileList({ files }: Props) {
  if (files.length === 0) return null

  return (
    <div className="mt-8">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
        Conversões realizadas
      </p>
      <div className="flex flex-col gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-lg">✓</span>
              <span className="text-sm text-gray-300">{file.name}</span>
            </div>
            <span className="text-xs text-gray-500">
              <span className="text-gray-400 font-bold">{file.from}</span>
              <span className="mx-1">→</span>
              <span className="text-blue-400 font-bold">{file.to}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileList
export type { ConvertedFile }