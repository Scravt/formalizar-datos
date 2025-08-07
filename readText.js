import { promises as fs } from 'fs';
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const pregunta = (texto) => {
    return new Promise((resolve) => {
        rl.question(texto, resolve);
    });
};

export const leer = async (nombreArchivo) => {
    try {
        // Si no se proporciona nombre, usar datos.txt por defecto
        if (!nombreArchivo) {
            nombreArchivo = 'datos.txt';
        }
        
        // Si el archivo no tiene extensión, agregar .txt
        if (!path.extname(nombreArchivo)) {
            nombreArchivo += '.txt';
        }
        
        // Construir la ruta relativa al directorio actual
        const archivo = path.join(process.cwd(), nombreArchivo);
        
        console.log(`\n📁 Leyendo archivo: ${nombreArchivo}`);
        const data = await fs.readFile(archivo, 'utf8');
        console.log('✅ Archivo leído correctamente\n');
        return data;
    } catch (err) {
        console.error(`❌ Error al leer el archivo ${nombreArchivo}:`, err.message);
        throw err;
    }
};

// Función para listar archivos .txt en el directorio
const listarArchivos = async () => {
    try {
        const archivos = await fs.readdir(process.cwd());
        const txtFiles = archivos.filter(file => file.endsWith('.txt'));
        
        if (txtFiles.length > 0) {
            console.log('\n📋 Archivos .txt disponibles:');
            txtFiles.forEach((file, index) => {
                console.log(`   ${index + 1}. ${file}`);
            });
        } else {
            console.log('\n⚠️  No se encontraron archivos .txt en el directorio actual');
        }
        
        return txtFiles;
    } catch (err) {
        console.error('Error al listar archivos:', err.message);
        return [];
    }
};

const main = async () => {
    console.log('🚀 Procesador de archivos de texto\n');
    console.log('Directorio actual:', process.cwd(), '\n');
    
    // Mostrar archivos disponibles
    await listarArchivos();
    
    try {
        while (true) {
            const respuesta = await pregunta('\n📝 Ingresa el nombre del archivo (o "salir" para terminar): ');
            
            if (respuesta.toLowerCase() === 'salir' || respuesta.toLowerCase() === 'exit') {
                console.log('👋 ¡Hasta luego!');
                break;
            }
            
            if (!respuesta.trim()) {
                console.log('⚠️  Por favor ingresa un nombre de archivo válido');
                continue;
            }
            
            try {
                const contenido = await leer(respuesta.trim());
                console.log('📄 Contenido del archivo:');
                console.log('-'.repeat(50));
                console.log(contenido);
                console.log('-'.repeat(50));
                
                // Aquí puedes agregar tu lógica para procesar el archivo y generar Excel
                console.log('✨ Procesando archivo y generando Excel...');
                // await generarExcel(contenido); // Tu función existente
                
            } catch (error) {
                console.log('💡 Intenta con otro archivo o verifica que existe en el directorio actual');
            }
        }
    } catch (error) {
        console.error('Error en la aplicación:', error);
    } finally {
        rl.close();
    }
};

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}