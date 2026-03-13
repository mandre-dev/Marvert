import * as XLSX from 'xlsx'

export function convertXlsxToCsv(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheet = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheet]
        const csv = XLSX.utils.sheet_to_csv(worksheet)
        resolve(csv)
      } catch {
        reject('Erro ao converter planilha')
      }
    }

    reader.onerror = () => reject('Erro ao ler arquivo')
    reader.readAsBinaryString(file)
  })
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}