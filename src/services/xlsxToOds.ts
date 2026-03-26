import JSZip from 'jszip'
import * as XLSX from 'xlsx'

export async function convertXlsxToOds(file: File): Promise<Blob> {
  try {
    // Read XLSX file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    // Create ODS structure
    const zip = new JSZip()

    // Create content.xml with table data
    const contentXml = createOdsContentXml(workbook)
    zip.file('content.xml', contentXml)

    // Create mimetype
    zip.file('mimetype', 'application/vnd.oasis.opendocument.spreadsheet')

    // Create META-INF/manifest.xml
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
  <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`
    zip.file('META-INF/manifest.xml', manifestXml)

    // Generate ODS file (ZIP)
    const odsBlob = await zip.generateAsync({ type: 'blob' })

    return odsBlob
  } catch (error) {
    throw new Error(`Erro ao converter XLSX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

function createOdsContentXml(workbook: XLSX.WorkBook): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
                        xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                        xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
                        xmlns:officeooo="http://openoffice.org/2009/office">
  <office:body>
    <office:spreadsheet>`

  // Process each worksheet
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][]

    xml += `
      <table:table table:name="${sheetName}">`

    // Create table columns
    if (jsonData.length > 0) {
      const maxCols = Math.max(...jsonData.map((row) => row.length))
      for (let i = 0; i < maxCols; i++) {
        xml += `
        <table:table-column/>`
      }

      // Create table rows
      jsonData.forEach((row) => {
        xml += `
        <table:table-row>`

        row.forEach((cell: any) => {
          const cellValue = cell !== null && cell !== undefined ? String(cell) : ''
          xml += `
          <table:table-cell office:value-type="string">
            <text:p>${escapeXml(cellValue)}</text:p>
          </table:table-cell>`
        })

        xml += `
        </table:table-row>`
      })
    }

    xml += `
      </table:table>`
  })

  xml += `
    </office:spreadsheet>
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

export function downloadOdsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
