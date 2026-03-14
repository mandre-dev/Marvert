import * as XLSX from 'xlsx'

export async function convertCsvToXlsx(file: File): Promise<Blob> {
  const text = await file.text()
  const workbook = XLSX.read(text, { type: 'string' })
  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

export function downloadXlsxFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}