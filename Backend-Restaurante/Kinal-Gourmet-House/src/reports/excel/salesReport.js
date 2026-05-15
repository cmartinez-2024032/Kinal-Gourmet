import ExcelJS from 'exceljs';

export const buildSalesExcel = async (salesData) => {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Kinal Gourmet House';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Reporte de Ventas', {
        pageSetup: {
            paperSize: 9,
            orientation: 'landscape',
            fitToPage: true,
        },
        views: [{ showGridLines: false }],
    });

    // ── Paleta de colores ──────────────────────────────────────────
    const ORANGE      = 'FFE65100';
    const ORANGE_SOFT = 'FFFFF3E0';
    const DARK        = 'FF1C1A17';
    const WHITE       = 'FFFFFFFF';
    const GRAY_LIGHT  = 'FFF5F5F5';
    const GRAY_MID    = 'FFE0E0E0';
    const GRAY_TEXT   = 'FF757575';
    const GREEN       = 'FF2E7D32';
    const GREEN_SOFT  = 'FFE8F5E9';

    // ── Anchos de columna ──────────────────────────────────────────
    worksheet.columns = [
        { key: 'date',    width: 22 },
        { key: 'orders',  width: 16 },
        { key: 'revenue', width: 22 },
        { key: 'avg',     width: 22 },
    ];

    // ── Fila 1: Logo / Título principal ───────────────────────────
    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = '🍽  KINAL GOURMET HOUSE';
    titleCell.font  = { name: 'Calibri', size: 18, bold: true, color: { argb: WHITE } };
    titleCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 42;

    // ── Fila 2: Subtítulo ─────────────────────────────────────────
    worksheet.mergeCells('A2:D2');
    const subCell = worksheet.getCell('A2');
    subCell.value = 'REPORTE DE VENTAS';
    subCell.font  = { name: 'Calibri', size: 11, bold: true, color: { argb: WHITE } };
    subCell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: ORANGE } };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(2).height = 26;

    // ── Fila 3: Fecha de generación ───────────────────────────────
    worksheet.mergeCells('A3:D3');
    const dateCell = worksheet.getCell('A3');
    dateCell.value = `Generado el ${new Date().toLocaleDateString('es-GT', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })}`;
    dateCell.font      = { name: 'Calibri', size: 9, italic: true, color: { argb: GRAY_TEXT } };
    dateCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAY_LIGHT } };
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(3).height = 18;

    // ── Fila 4: espacio ───────────────────────────────────────────
    worksheet.getRow(4).height = 8;

    // ── Fila 5: Encabezados de tabla ──────────────────────────────
    const headers = ['Fecha', 'Órdenes', 'Ingresos (Q)', 'Promedio por Orden (Q)'];
    const headerRow = worksheet.getRow(5);
    headerRow.height = 30;

    headers.forEach((h, i) => {
        const col  = String.fromCharCode(65 + i); // A, B, C, D
        const cell = worksheet.getCell(`${col}5`);
        cell.value = h;
        cell.font  = { name: 'Calibri', size: 10, bold: true, color: { argb: WHITE } };
        cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: ORANGE } };
        cell.alignment = {
            horizontal: i === 0 ? 'left' : 'center',
            vertical: 'middle',
        };
        cell.border = {
            top:    { style: 'thin', color: { argb: ORANGE } },
            bottom: { style: 'thin', color: { argb: ORANGE } },
            left:   { style: 'thin', color: { argb: ORANGE } },
            right:  { style: 'thin', color: { argb: ORANGE } },
        };
    });

    // ── Filas de datos ────────────────────────────────────────────
    salesData.forEach((item, index) => {
        const rowNum  = 6 + index;
        const isEven  = index % 2 === 0;
        const bgColor = isEven ? WHITE : GRAY_LIGHT;
        const row     = worksheet.getRow(rowNum);
        row.height    = 22;

        const values = [
            item._id,
            item.totalOrders,
            item.totalRevenue,
            item.averageOrderValue,
        ];

        values.forEach((val, i) => {
            const col  = String.fromCharCode(65 + i);
            const cell = worksheet.getCell(`${col}${rowNum}`);
            cell.value = val;
            cell.font  = { name: 'Calibri', size: 10, color: { argb: DARK } };
            cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
            cell.alignment = {
                horizontal: i === 0 ? 'left' : 'center',
                vertical:   'middle',
            };
            cell.border = {
                top:    { style: 'hair', color: { argb: GRAY_MID } },
                bottom: { style: 'hair', color: { argb: GRAY_MID } },
                left:   { style: 'hair', color: { argb: GRAY_MID } },
                right:  { style: 'hair', color: { argb: GRAY_MID } },
            };

            // Formato monetario
            if (i === 2 || i === 3) {
                cell.numFmt    = '"Q" #,##0.00';
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
            }
        });
    });

    // ── Fila separadora ───────────────────────────────────────────
    const sepRowNum = 6 + salesData.length;
    worksheet.getRow(sepRowNum).height = 6;

    // ── Fila TOTAL ────────────────────────────────────────────────
    const totalRowNum = sepRowNum + 1;
    const totalOrders  = salesData.reduce((acc, i) => acc + i.totalOrders,  0);
    const totalRevenue = salesData.reduce((acc, i) => acc + i.totalRevenue, 0);
    const avgGeneral   = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalRow   = worksheet.getRow(totalRowNum);
    totalRow.height  = 28;

    const totalValues = ['TOTAL PERÍODO', totalOrders, totalRevenue, avgGeneral];

    totalValues.forEach((val, i) => {
        const col  = String.fromCharCode(65 + i);
        const cell = worksheet.getCell(`${col}${totalRowNum}`);
        cell.value = val;
        cell.font  = { name: 'Calibri', size: 11, bold: true, color: { argb: WHITE } };
        cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN } };
        cell.alignment = {
            horizontal: i === 0 ? 'left' : 'center',
            vertical:   'middle',
        };
        cell.border = {
            top:    { style: 'medium', color: { argb: GREEN } },
            bottom: { style: 'medium', color: { argb: GREEN } },
            left:   { style: 'thin',   color: { argb: GREEN } },
            right:  { style: 'thin',   color: { argb: GREEN } },
        };

        if (i === 2 || i === 3) {
            cell.numFmt    = '"Q" #,##0.00';
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
        }
    });

    // ── Fila resumen destacado ─────────────────────────────────────
    const summaryRowNum = totalRowNum + 2;
    worksheet.mergeCells(`A${summaryRowNum}:D${summaryRowNum}`);
    const summaryCell   = worksheet.getCell(`A${summaryRowNum}`);
    summaryCell.value   = `✔  ${salesData.length} día(s) con actividad  ·  ${totalOrders} órdenes  ·  Q ${totalRevenue.toFixed(2)} en ingresos`;
    summaryCell.font    = { name: 'Calibri', size: 10, italic: true, bold: true, color: { argb: GREEN } };
    summaryCell.fill    = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN_SOFT } };
    summaryCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(summaryRowNum).height = 22;

    // ── Pie de página ─────────────────────────────────────────────
    const footerRowNum = summaryRowNum + 2;
    worksheet.mergeCells(`A${footerRowNum}:D${footerRowNum}`);
    const footerCell   = worksheet.getCell(`A${footerRowNum}`);
    footerCell.value   = 'Documento generado automáticamente por el sistema de gestión · Kinal Gourmet House';
    footerCell.font    = { name: 'Calibri', size: 8, italic: true, color: { argb: GRAY_TEXT } };
    footerCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(footerRowNum).height = 16;

    return workbook;
};