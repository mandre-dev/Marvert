import { useState } from 'react'
import Header from './components/Header'
import DropZone from './components/DropZone'
import FormatSelector from './components/FormatSelector'

export type Format = 'jpg-png' | 'png-jpg' | 'xlsx-csv' | 'pdf-jpg'

function App() {
  const [format, setFormat] = useState<Format>('jpg-png')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <DropZone format={format} />
        <FormatSelector format={format} setFormat={setFormat} />
      </main>
    </div>
  )
}

export default App