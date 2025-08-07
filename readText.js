import { promises as fs } from 'fs';

export const leer = async () => {
    try {
        const archivo = './datos.txt';
        const data = await fs.readFile(archivo, 'utf8');
        return data; // Aquí sí se retorna el contenido del archivo
    } catch (err) {
        console.error('Ocurrió un error al leer el archivo:', err);
        throw err; // Lanzamos el error para que pueda ser capturado por un .catch()
    }
};