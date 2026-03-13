import Header from './components/Header.tsx'
import DropZone from './components/Dropzone.tsx'
import FormatSelector from './components/FormatSelector.tsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <DropZone />
        <FormatSelector />
      </main>
    </div>
  )
}

export default App