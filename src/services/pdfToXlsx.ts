import * as pdfjsLib from 'pdfjs-dist'
import * as ExcelJS from 'exceljs'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export async function convertPdfToXlsx(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const workbook = new ExcelJS.Workbook()

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const worksheet = workbook.addWorksheet(`Página ${i}`)

    const lines: string[][] = []
    let currentRow: string[] = []
    let lastY: number | null = null

    textContent.items.forEach((item: any) => {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        if (currentRow.length > 0) lines.push(currentRow)
        currentRow = []
      }
      currentRow.push(item.str.trim())
      lastY = item.transform[5]
    })

    if (currentRow.length > 0) lines.push(currentRow)

    lines.forEach((row) => {
      worksheet.addRow(row)
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export function downloadXlsx(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}