import jsPDF from 'jspdf'

export async function convertImageToPdf(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const isLandscape = img.width > img.height
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height],
      })

      pdf.addImage(img, file.type.includes('png') ? 'PNG' : 'JPEG', 0, 0, img.width, img.height)
      URL.revokeObjectURL(url)
      resolve(pdf.output('blob'))
    }

    img.onerror = () => reject('Erro ao carregar imagem')
    img.src = url
  })
}

export function downloadPdfFromImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}