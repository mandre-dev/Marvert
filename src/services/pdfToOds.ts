import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export async function convertPdfToOds(file: File): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const workbookData: string[][][] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()

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

      workbookData.push(lines)
    }

    // Create ODS structure
    const zip = new JSZip()

    // mimetype
    zip.file('mimetype', 'application/vnd.oasis.opendocument.spreadsheet')

    // META-INF/manifest.xml
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
  <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`
    zip.file('META-INF/manifest.xml', manifestXml)

    // styles.xml
    const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0">
  <office:font-face-decls>
    <style:font-face style:name="Arial" svg:font-family="Arial"/>
  </office:font-face-decls>
  <office:styles>
    <style:default-style style:family="table-cell">
      <style:text-properties style:font-name="Arial" fo:font-size="10pt"/>
    </style:default-style>
  </office:styles>
</office:document-styles>`
    zip.file('styles.xml', stylesXml)

    // content.xml
    let contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0">
  <office:body>
    <office:spreadsheet>`

    workbookData.forEach((sheetData, sheetIndex) => {
      contentXml += `<table:table table:name="Página ${sheetIndex + 1}">`
      sheetData.forEach((row) => {
        contentXml += '<table:table-row>'
        row.forEach((cell) => {
          contentXml += `<table:table-cell office:value-type="string"><text:p>${escapeXml(cell)}</text:p></table:table-cell>`
        })
        contentXml += '</table:table-row>'
      })
      contentXml += '</table:table>'
    })

    contentXml += `
    </office:spreadsheet>
  </office:body>
</office:document-content>`

    zip.file('content.xml', contentXml)

    // Generate the ODS blob
    const odsBlob = await zip.generateAsync({ type: 'blob' })
    return odsBlob
  } catch (error) {
    throw new Error(`Erro ao converter PDF para ODS: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

export function downloadOds(blob: Blob, filename: string) {
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