import * as mammoth from 'mammoth'
import jsPDF from 'jspdf'

export async function convertDocxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const text = result.value

  const pdf = new jsPDF()
  const lines = pdf.splitTextToSize(text, 180)

  let y = 20
  const lineHeight = 7
  const pageHeight = pdf.internal.pageSize.height - 20

  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight) {
      pdf.addPage()
      y = 20
    }
    pdf.text(line, 15, y)
    y += lineHeight
  })

  return pdf.output('blob')
}

export function downloadPdfFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}