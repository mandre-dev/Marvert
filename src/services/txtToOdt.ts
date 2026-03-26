import JSZip from 'jszip'

export async function convertTxtToOdt(file: File): Promise<Blob> {
  try {
    // Read TXT file
    const text = await file.text()

    // Create ODT structure
    const zip = new JSZip()

    // Create content.xml with text content
    const contentXml = createOdtContentXml(text)
    zip.file('content.xml', contentXml)

    // Create mimetype
    zip.file('mimetype', 'application/vnd.oasis.opendocument.text')

    // Create META-INF/manifest.xml
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
  <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`
    zip.file('META-INF/manifest.xml', manifestXml)

    // Generate ODT file (ZIP)
    const odtBlob = await zip.generateAsync({ type: 'blob' })

    return odtBlob
  } catch (error) {
    throw new Error(`Erro ao converter TXT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

function createOdtContentXml(textContent: string): string {
  // Split text into paragraphs by double newlines or single newlines
  const paragraphs = textContent.split(/\n\s*\n/).filter(p => p.trim().length > 0)

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                        xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                        xmlns:officeooo="http://openoffice.org/2009/office">
  <office:body>
    <office:text>`

  // Add each paragraph
  paragraphs.forEach(paragraph => {
    // Split paragraph into lines and join with spaces
    const lines = paragraph.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const paragraphText = lines.join(' ')

    if (paragraphText.trim()) {
      const escapedText = escapeXml(paragraphText.trim())
      xml += `
      <text:p>${escapedText}</text:p>`
    }
  })

  // If no paragraphs were found, add a default one
  if (paragraphs.length === 0 && textContent.trim()) {
    const escapedText = escapeXml(textContent.trim())
    xml += `
      <text:p>${escapedText}</text:p>`
  }

  xml += `
    </office:text>
  </office:body>
</office:document-content>`

  return xml
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

export function downloadOdtFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
