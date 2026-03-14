import * as pdfjsLib from 'pdfjs-dist'
import { Document, Packer, Paragraph, TextRun } from 'docx'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export async function convertPdfToDocx(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const paragraphs: Paragraph[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()

    const lines: string[] = []
    let currentLine = ''
    let lastY: number | null = null

    textContent.items.forEach((item: any) => {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        if (currentLine.trim()) lines.push(currentLine.trim())
        currentLine = ''
      }
      currentLine += item.str + ' '
      lastY = item.transform[5]
    })

    if (currentLine.trim()) lines.push(currentLine.trim())

    lines.forEach((line) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: 24, font: 'Arial' })],
          spacing: { after: 100 },
        })
      )
    })

    if (i < pdf.numPages) {
      paragraphs.push(new Paragraph({ children: [new TextRun('')] }))
    }
  }

  const doc = new Document({
    sections: [{ children: paragraphs }],
  })

  return Packer.toBlob(doc)
}

export function downloadDocx(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}