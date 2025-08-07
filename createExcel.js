import excel from 'exceljs';
import { mapeoDatos } from './mapeoDatos.js';

const main = async () => {
    try {
        // 1. Llama a la función mapeoDatos y espera su resultado
        const datos = await mapeoDatos();

        // 2. Crea un nuevo libro de trabajo y una hoja
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Datos del Reporte');

        // 3. Define las columnas basándose en las claves
        const claves = [
            'Fecha Alta', 'Razon Social', 'email', 'email empleador',
            'Cantidad de empleados', 'cuit', 'lugar de identificacion',
            'domicilio', 'Actividad principal', 'codigo',
            'tipoEmpresa', 'usuario', 'estado'
        ];
        worksheet.columns = claves.map(clave => ({
            header: clave,
            key: clave,
            width: 25
        }));

        // 4. Añade los datos mapeados a la hoja de trabajo
        // Se utiliza addRows() que es más eficiente que un bucle forEach
        worksheet.addRows(datos);

        // 5. Escribe el archivo en disco
        await workbook.xlsx.writeFile('reporte.xlsx');
        console.log('Archivo Excel "reporte.xlsx" generado exitosamente.');
    } catch (error) {
        console.error('Error durante la ejecución:', error);
    }
};

// Llama a la función principal
main();