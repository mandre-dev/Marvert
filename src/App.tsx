import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ConverterPage from './pages/ConverterPage'
import MergePdfPage from './pages/MergePdfPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf-to-jpg" element={<ConverterPage type="pdf-jpg" />} />
          <Route path="/pdf-to-png" element={<ConverterPage type="pdf-png" />} />
          <Route path="/jpg-to-png" element={<ConverterPage type="jpg-png" />} />
          <Route path="/png-to-jpg" element={<ConverterPage type="png-jpg" />} />
          <Route path="/xlsx-to-csv" element={<ConverterPage type="xlsx-csv" />} />
          <Route path="/docx-to-txt" element={<ConverterPage type="docx-txt" />} />
          <Route path="/merge-pdf" element={<MergePdfPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App