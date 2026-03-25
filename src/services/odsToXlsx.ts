import JSZip from 'jszip'
import * as XLSX from 'xlsx'

interface CellData {
    row: number
    col: number
    value: string | number
}

export async function convertOdsToXlsx(file: File): Promise<Blob> {
    try {
        // Read ODS file as binary
        const arrayBuffer = await file.arrayBuffer()

        // Extract ZIP contents from ODS
        const zip = new JSZip()
        await zip.loadAsync(arrayBuffer)

        // Get content.xml from ODS
        const contentXml = await zip.file('content.xml')?.async('text')
        if (!contentXml) {
            throw new Error('Arquivo ODS inválido: content.xml não encontrado')
        }

        // Parse ODS XML to extract table data
        const cellsData = parseOdsContent(contentXml)

        // Create XLSX workbook from extracted data
        const workbook = XLSX.utils.book_new()

        // Extract sheets from parsed data
        const sheets = groupDataBySheet(cellsData)

        sheets.forEach((sheetData, sheetName) => {
            // Find max row and col
            let maxRow = 0
            let maxCol = 0

            sheetData.forEach((cell) => {
                maxRow = Math.max(maxRow, cell.row)
                maxCol = Math.max(maxCol, cell.col)
            })

            // Create matrix for worksheet
            const matrix: (string | number)[][] = []
            for (let i = 0; i <= maxRow; i++) {
                matrix[i] = []
            }

            // Fill matrix with cell values
            sheetData.forEach((cell) => {
                matrix[cell.row][cell.col] = cell.value
            })

            // Create worksheet from matrix
            const worksheet = XLSX.utils.aoa_to_sheet(matrix)
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
        })

        // Generate XLSX file
        const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

        return new Blob([xlsxBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
    } catch (error) {
        throw new Error(`Erro ao converter ODS: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
}

function parseOdsContent(xmlContent: string): CellData[] {
    const cells: CellData[] = []
    let rowIndex = 0

    // Simple XML parsing using regex to extract table and cell data
    const tableRegex = /<table:table[^>]*table:name="([^"]*)"[^>]*>([\s\S]*?)<\/table:table>/g
    let tableMatch

    while ((tableMatch = tableRegex.exec(xmlContent)) !== null) {
        const tableContent = tableMatch[2]
        rowIndex = 0

        // Extract rows from table
        const rowRegex = /<table:table-row[^>]*>([\s\S]*?)<\/table:table-row>/g
        let rowMatch

        while ((rowMatch = rowRegex.exec(tableContent)) !== null) {
            const rowContent = rowMatch[1]
            let colIndex = 0

            // Extract cells from row
            const cellRegex = /<table:table-cell[^>]*table:value-type="([^"]*)"[^>]*>([\s\S]*?)<\/table:table-cell>/g
            let cellMatch

            while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
                const cellType = cellMatch[1]
                const cellContent = cellMatch[2]

                // Extract text/value from cell
                const valueMatch = /<text:p>([\s\S]*?)<\/text:p>/.exec(cellContent)
                let cellValue: string | number = ''

                if (valueMatch) {
                    // Remove XML tags from text content
                    cellValue = valueMatch[1].replace(/<[^>]*>/g, '')
                }

                // Convert to appropriate type
                if (cellType === 'float' || cellType === 'percentage') {
                    const numValue = parseFloat(cellValue as string)
                    if (!isNaN(numValue)) {
                        cellValue = numValue
                    }
                } else if (cellType === 'date') {
                    cellValue = cellValue || ''
                }

                if (cellValue !== '') {
                    cells.push({
                        row: rowIndex,
                        col: colIndex,
                        value: cellValue,
                    })
                }

                colIndex++
            }

            rowIndex++
        }
    }

    return cells
}

function groupDataBySheet(cells: CellData[]): Map<string, CellData[]> {
    const sheets = new Map<string, CellData[]>()

    // For now, we'll put all data in a single default sheet
    // In a more advanced implementation, multiple table:table elements could be detected
    const sheetData = cells.length > 0 ? cells : [{ row: 0, col: 0, value: '' }]

    sheets.set('Sheet1', sheetData)

    return sheets
}

export function downloadXlsxFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
