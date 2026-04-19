import JSZip from 'jszip'
import jsPDF from 'jspdf'

export async function convertOdtToPdf(file: File): Promise<Blob> {
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
        const textContent = parseOdtContent(contentXml)

        // Create PDF from text content
        const pdfBlob = await createPdfFromText(textContent)

        return pdfBlob
    } catch (error) {
        throw new Error(`Erro ao converter ODT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
}

function parseOdtContent(xmlContent: string): string {
    const paragraphs: string[] = []

    // Simple XML parsing using regex to extract paragraphs and text
    const paragraphRegex = /<text:p[^>]*>([\s\S]*?)<\/text:p>/g
    let paragraphMatch

    while ((paragraphMatch = paragraphRegex.exec(xmlContent)) !== null) {
        const paragraphContent = paragraphMatch[1]

        // Extract text from paragraph, handling spans
        let text = ''

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
                    text += cleanText
                }
            }

            // Add the span text
            const spanText = cleanTextContent(spanMatch[1])
            if (spanText) {
                text += spanText
            }

            lastIndex = spanRegex.lastIndex
        }

        // Add any remaining text after the last span
        if (lastIndex < paragraphContent.length) {
            const remainingText = paragraphContent.substring(lastIndex)
            const cleanText = cleanTextContent(remainingText)
            if (cleanText) {
                text += cleanText
            }
        }

        // If no text was found, try to extract plain text
        if (!text) {
            text = cleanTextContent(paragraphContent)
        }

        // Add paragraph if we have text
        if (text.trim()) {
            paragraphs.push(text.trim())
        }
    }

    // Join paragraphs with newlines
    return paragraphs.join('\n\n')
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

async function createPdfFromText(textContent: string): Promise<Blob> {
    const pdf = new jsPDF()

    // Split text into lines that fit the page width
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin

    // Set font and size
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)

    const lines = pdf.splitTextToSize(textContent, maxWidth)
    let yPosition = margin + 10

    lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin + 10
        }
        pdf.text(line, margin, yPosition)
        yPosition += 7 // Line height
    })

    // Return as blob
    return pdf.output('blob')
}

export function downloadPdfFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
