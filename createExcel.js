
import os from 'os';
import path from 'path';
import readline from 'readline';
import excel from 'exceljs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const userHomeDir = os.homedir();
const filePath = path.join(userHomeDir, 'Desktop', 'reporte.xlsx');

export const createExcel = async (respuesta) => {
    const claves = [
        'Fecha Alta', 'Razon Social', 'email', 'email empleador',
        'Cantidad de empleados', 'cuit', 'lugar de identificacion',
        'domicilio', 'Actividad principal', 'codigo',
        'tipoEmpresa', 'usuario', 'estado'
    ];

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Datos del Reporte');
    worksheet.columns = claves.map(clave => ({
        header: clave,
        key: clave,
        width: 25
    }));

    console.log(respuesta)
    worksheet.addRows(respuesta);

    // 5. Escribe el archivo en disco
    await workbook.xlsx.writeFile(filePath);

    console.log('📊 Archivo Excel "reporte.xlsx" generado exitosamente.');


}

