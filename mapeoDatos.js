import { leer } from "./readText.js";

const claves = [
    'Fecha Alta', 'Razon Social', 'email', 'email empleador',
    'Cantidad de empleados', 'cuit', 'lugar de identificacion',
    'domicilio', 'Actividad principal', 'codigo',
    'tipoEmpresa', 'usuario', 'estado'
];

export const mapeoDatos = async (contenidoTexto) => {
    try {
        
        const lineas = contenidoTexto.split('\n');

        return lineas.map(linea => {
            if (linea.trim() === '') {
                return null;
            }
            const valores = linea.split(';');
            const objeto = {};
            claves.forEach((clave, index) => {
                objeto[clave] = valores[index] ? valores[index].trim() : '';
            });
            return objeto;
        }).filter(Boolean);
    } catch (error) {
        console.error("Error al mapear los datos:", error);
        return []; // Retorna un array vacío en caso de error
    }
};

