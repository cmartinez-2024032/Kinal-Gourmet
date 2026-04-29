import ExcelJS from 'exceljs';

export const buildSalesExcel = async (salesData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas');

    // 🧱 Columnas
    worksheet.columns = [
        { header: 'Fecha', key: 'date', width: 20 },
        { header: 'Órdenes', key: 'orders', width: 15 },
        { header: 'Ingresos (Q)', key: 'revenue', width: 20 },
        { header: 'Promedio (Q)', key: 'avg', width: 20 },
    ];

    // 📊 Datos
    salesData.forEach(item => {
        worksheet.addRow({
            date: item._id,
            orders: item.totalOrders,
            revenue: item.totalRevenue,
            avg: item.averageOrderValue
        });
    });

    // 🎨 Estilo encabezado
    worksheet.getRow(1).font = { bold: true };

    // 💰 Formato moneda (Quetzales)
    worksheet.getColumn('revenue').numFmt = '"Q" #,##0.00';
    worksheet.getColumn('avg').numFmt = '"Q" #,##0.00';

    // ➕ Totales al final
    const totalOrders = salesData.reduce((acc, item) => acc + item.totalOrders, 0);
    const totalRevenue = salesData.reduce((acc, item) => acc + item.totalRevenue, 0);

    worksheet.addRow({});
    worksheet.addRow({
        date: 'TOTAL',
        orders: totalOrders,
        revenue: totalRevenue,
        avg: ''
    });

    // 🔥 Resaltar fila TOTAL
    const lastRow = worksheet.lastRow;
    lastRow.font = { bold: true };

    return workbook;
};