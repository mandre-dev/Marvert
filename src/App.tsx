import { useState } from 'react'
import Header from './components/Header'
import DropZone from './components/DropZone'
import FormatSelector from './components/FormatSelector'
import FileList from './components/FileList'
import type { ConvertedFile } from './components/FileList'

export type Format = 'jpg-png' | 'png-jpg' | 'xlsx-csv' | 'pdf-jpg'

function App() {
  const [format, setFormat] = useState<Format>('jpg-png')
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])

  function addConvertedFile(file: ConvertedFile) {
    setConvertedFiles((prev) => [file, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <DropZone format={format} onConverted={addConvertedFile} />
        <FormatSelector format={format} setFormat={setFormat} />
        <FileList files={convertedFiles} />
      </main>
    </div>
  )
}

export default App