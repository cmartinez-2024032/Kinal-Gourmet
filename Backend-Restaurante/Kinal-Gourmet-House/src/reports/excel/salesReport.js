import ExcelJS from 'exceljs';

export const buildSalesExcel = async (salesData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas');

    worksheet.columns = [
        { header: 'Fecha', key: 'date', width: 20 },
        { header: 'Órdenes', key: 'orders', width: 15 },
        { header: 'Ingresos (Q)', key: 'revenue', width: 20 },
        { header: 'Promedio (Q)', key: 'avg', width: 20 },
    ];

    
    salesData.forEach(item => {
        worksheet.addRow({
            date: item._id,
            orders: item.totalOrders,
            revenue: item.totalRevenue,
            avg: item.averageOrderValue
        });
    });


    worksheet.getRow(1).font = { bold: true };

    worksheet.getColumn('revenue').numFmt = '"Q" #,##0.00';
    worksheet.getColumn('avg').numFmt = '"Q" #,##0.00';

    const totalOrders = salesData.reduce((acc, item) => acc + item.totalOrders, 0);
    const totalRevenue = salesData.reduce((acc, item) => acc + item.totalRevenue, 0);

    worksheet.addRow({});
    worksheet.addRow({
        date: 'TOTAL',
        orders: totalOrders,
        revenue: totalRevenue,
        avg: ''
    });

    
    const lastRow = worksheet.lastRow;
    lastRow.font = { bold: true };

    return workbook;
};