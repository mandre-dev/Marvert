import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export async function convertPdfToOdt(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''

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

      fullText += lines.join('\n') + '\n\n'
    }

    // Create ODT structure
    const zip = new JSZip()

    // mimetype
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text')

    // META-INF/manifest.xml
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
  <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`
    zip.file('META-INF/manifest.xml', manifestXml)

    // content.xml
    const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0">
  <office:body>
    <office:text>
${fullText.split('\n').map(line => `      <text:p>${escapeXml(line)}</text:p>`).join('\n')}
    </office:text>
  </office:body>
</office:document-content>`
    zip.file('content.xml', contentXml)

    // Generate the ODT blob
    const odtBlob = await zip.generateAsync({ type: 'blob' })
    return odtBlob
  } catch (error) {
    throw new Error(`Erro ao converter PDF para ODT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

export function downloadOdt(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&#39;'
      case '"': return '&quot;'
      default: return c
    }
  })
}