import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import ConverterPage from './pages/ConverterPage'
import MergePdfPage from './pages/MergePdfPage'
import PdfToDocxPage from './pages/PdfToDocxPage'
import PdfToXlsxPage from './pages/PdfToXlsxPage'
import TxtToDocxPage from './pages/TxtToDocxPage'
import DocxToPdfPage from './pages/DocxToPdfPage'
import CsvToXlsxPage from './pages/CsvToXlsxPage'
import XlsxToPdfPage from './pages/XlsxToPdfPage'
import ImageToPdfPage from './pages/ImageToPdfPage'

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
          <Route path="/pdf-to-docx" element={<PdfToDocxPage />} />
          <Route path="/pdf-to-xlsx" element={<PdfToXlsxPage />} />
          <Route path="/txt-to-docx" element={<TxtToDocxPage />} />
          <Route path="/docx-to-pdf" element={<DocxToPdfPage />} />
          <Route path="/csv-to-xlsx" element={<CsvToXlsxPage />} />
          <Route path="/xlsx-to-pdf" element={<XlsxToPdfPage />} />
          <Route path="/jpg-to-pdf" element={<ImageToPdfPage type="jpg-pdf" />} />
          <Route path="/png-to-pdf" element={<ImageToPdfPage type="png-pdf" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App