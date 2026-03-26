import JSZip from 'jszip'

export async function convertOdpToJpg(file: File): Promise<string[]> {
  try {
    // Read ODP file as binary
    const arrayBuffer = await file.arrayBuffer()

    // Extract ZIP contents from ODP
    const zip = new JSZip()
    await zip.loadAsync(arrayBuffer)

    // Get content.xml from ODP
    const contentXml = await zip.file('content.xml')?.async('text')
    if (!contentXml) {
      throw new Error('Arquivo ODP inválido: content.xml não encontrado')
    }

    // Parse ODP XML to extract text content from slides
    const slides = parseOdpContent(contentXml)

    // Generate images for each slide
    const images: string[] = []
    for (let i = 0; i < slides.length; i++) {
      const imageDataUrl = await generateSlideImage(slides[i], i + 1)
      images.push(imageDataUrl)
    }

    return images
  } catch (error) {
    throw new Error(`Erro ao converter ODP: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

function parseOdpContent(xmlContent: string): string[] {
  const slides: string[] = []

  // Simple XML parsing using regex to extract slides and text
  const slideRegex = /<draw:page[^>]*>([\s\S]*?)<\/draw:page>/g
  let slideMatch

  while ((slideMatch = slideRegex.exec(xmlContent)) !== null) {
    const slideContent = slideMatch[1]
    const textContent = extractTextFromSlide(slideContent)
    slides.push(textContent)
  }

  return slides
}

function extractTextFromSlide(slideContent: string): string {
  const textMatches = slideContent.match(/<text:p[^>]*>([\s\S]*?)<\/text:p>/g) || []
  const texts = textMatches.map(match => {
    const textMatch = match.match(/<text:p[^>]*>([\s\S]*?)<\/text:p>/)
    return textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : ''
  }).filter(text => text.length > 0)

  return texts.join('\n')
}

async function generateSlideImage(text: string, slideNumber: number): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não foi possível criar contexto 2D')

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Border
  ctx.strokeStyle = '#cccccc'
  ctx.lineWidth = 2
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

  // Title
  ctx.fillStyle = '#333333'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`Slide ${slideNumber}`, canvas.width / 2, 50)

  // Text content
  ctx.fillStyle = '#000000'
  ctx.font = '16px Arial'
  ctx.textAlign = 'left'

  const lines = text.split('\n')
  let y = 100
  const maxWidth = canvas.width - 40
  const lineHeight = 24

  for (const line of lines) {
    if (y > canvas.height - 50) break // Prevent overflow

    const words = line.split(' ')
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine + word + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine !== '') {
        ctx.fillText(currentLine, 20, y)
        currentLine = word + ' '
        y += lineHeight
      } else {
        currentLine = testLine
      }
    }

    ctx.fillText(currentLine, 20, y)
    y += lineHeight
  }

  return canvas.toDataURL('image/jpeg', 0.92)
}

export function downloadJpg(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}