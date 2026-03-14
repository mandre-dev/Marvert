import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

export async function convertXlsxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const firstSheet = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheet]
  const rows: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

  const pdf = new jsPDF({ orientation: 'landscape' })
  const pageWidth = pdf.internal.pageSize.width - 20
  const colWidth = rows[0] ? pageWidth / rows[0].length : pageWidth

  let y = 20

  rows.forEach((row, rowIndex) => {
    if (y > pdf.internal.pageSize.height - 20) {
      pdf.addPage()
      y = 20
    }

    row.forEach((cell, colIndex) => {
      const x = 10 + colIndex * colWidth
      const text = String(cell ?? '').substring(0, 20)
      if (rowIndex === 0) {
        pdf.setFont('helvetica', 'bold')
      } else {
        pdf.setFont('helvetica', 'normal')
      }
      pdf.setFontSize(9)
      pdf.text(text, x, y)
    })
    y += 8
  })

  return pdf.output('blob')
}

export function downloadPdfFromXlsx(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}