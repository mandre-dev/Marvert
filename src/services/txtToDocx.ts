import { Document, Packer, Paragraph, TextRun } from 'docx'

export async function convertTxtToDocx(file: File): Promise<Blob> {
  const text = await file.text()
  const lines = text.split('\n')

  const paragraphs = lines.map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 24, font: 'Arial' })],
        spacing: { after: 100 },
      })
  )

  const doc = new Document({
    sections: [{ children: paragraphs }],
  })

  return Packer.toBlob(doc)
}

export function downloadDocxFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}