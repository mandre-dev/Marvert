import JSZip from 'jszip'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export async function convertOdtToDocx(file: File): Promise<Blob> {
  try {
    // Read ODT file as binary
    const arrayBuffer = await file.arrayBuffer()

    // Extract ZIP contents from ODT
    const zip = new JSZip()
    await zip.loadAsync(arrayBuffer)

    // Get content.xml from ODT
    const contentXml = await zip.file('content.xml')?.async('text')
    if (!contentXml) {
      throw new Error('Arquivo ODT inválido: content.xml não encontrado')
    }

    // Parse ODT XML to extract text content
    const paragraphs = parseOdtContent(contentXml)

    // Create DOCX document
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    })

    // Generate DOCX file
    const buffer = await Packer.toBuffer(doc)
    const uint8Array = new Uint8Array(buffer)

    return new Blob([uint8Array], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
  } catch (error) {
    throw new Error(`Erro ao converter ODT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

function parseOdtContent(xmlContent: string): Paragraph[] {
  const paragraphs: Paragraph[] = []

  // Simple XML parsing using regex to extract paragraphs and text
  const paragraphRegex = /<text:p[^>]*>([\s\S]*?)<\/text:p>/g
  let paragraphMatch

  while ((paragraphMatch = paragraphRegex.exec(xmlContent)) !== null) {
    const paragraphContent = paragraphMatch[1]

    // Extract text runs from paragraph
    const textRuns: TextRun[] = []

    // Handle text spans with formatting
    const spanRegex = /<text:span[^>]*>([\s\S]*?)<\/text:span>/g
    let spanMatch
    let lastIndex = 0

    while ((spanMatch = spanRegex.exec(paragraphContent)) !== null) {
      // Add any text before this span
      if (spanMatch.index > lastIndex) {
        const beforeText = paragraphContent.substring(lastIndex, spanMatch.index)
        const cleanText = cleanTextContent(beforeText)
        if (cleanText) {
          textRuns.push(new TextRun({ text: cleanText }))
        }
      }

      // Add the span text
      const spanText = cleanTextContent(spanMatch[1])
      if (spanText) {
        textRuns.push(new TextRun({ text: spanText }))
      }

      lastIndex = spanRegex.lastIndex
    }

    // Add any remaining text after the last span
    if (lastIndex < paragraphContent.length) {
      const remainingText = paragraphContent.substring(lastIndex)
      const cleanText = cleanTextContent(remainingText)
      if (cleanText) {
        textRuns.push(new TextRun({ text: cleanText }))
      }
    }

    // If no text runs were found, try to extract plain text
    if (textRuns.length === 0) {
      const plainText = cleanTextContent(paragraphContent)
      if (plainText) {
        textRuns.push(new TextRun({ text: plainText }))
      }
    }

    // Create paragraph if we have text
    if (textRuns.length > 0) {
      paragraphs.push(new Paragraph({
        children: textRuns,
      }))
    }
  }

  // If no paragraphs were found, create a default one
  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: 'Conteúdo extraído do documento ODT' })],
    }))
  }

  return paragraphs
}

function cleanTextContent(text: string): string {
  // Remove XML tags and decode entities
  return text
    .replace(/<[^>]*>/g, '') // Remove XML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

export function downloadDocxFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
