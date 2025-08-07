import { leer } from './readText.js';
import { mapeoDatos } from './mapeoDatos.js';
// Importar tu función de crear Excel - ajusta el nombre según tu archivo
import { createExcel } from './createExcel.js'; // o como se llame tu función
import readline from 'readline';
import { promises as fs } from 'fs';
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

// Función para mostrar el contenido de una carpeta
const mostrarContenidoCarpeta = async (rutaCarpeta = process.cwd()) => {
    try {
        const elementos = await fs.readdir(rutaCarpeta, { withFileTypes: true });
        
        // Separar carpetas y archivos
        const carpetas = elementos.filter(item => item.isDirectory()).map(item => item.name);
        const archivos = elementos.filter(item => item.isFile());
        const archivosTxt = archivos.filter(item => item.name.endsWith('.txt')).map(item => item.name);
        const otrosArchivos = archivos.filter(item => !item.name.endsWith('.txt')).map(item => item.name);
        
        console.log(`\n📁 Directorio actual: ${rutaCarpeta}`);
        console.log('═'.repeat(50));
        
        // Mostrar opción para ir al directorio padre
        if (rutaCarpeta !== path.parse(rutaCarpeta).root) {
            console.log('📂 .. (directorio padre)');
        }
        
        // Mostrar carpetas
        if (carpetas.length > 0) {
            console.log('\n📂 Carpetas:');
            carpetas.forEach((carpeta, index) => {
                console.log(`   ${index + 1}. 📁 ${carpeta}/`);
            });
        }
        
        // Mostrar archivos .txt
        if (archivosTxt.length > 0) {
            console.log('\n📄 Archivos .txt disponibles:');
            archivosTxt.forEach((archivo, index) => {
                console.log(`   ${index + 1}. 📝 ${archivo}`);
            });
        } else {
            console.log('\n⚠️  No hay archivos .txt en esta carpeta');
        }
        
        // Mostrar otros archivos (solo algunos para no saturar)
        if (otrosArchivos.length > 0) {
            console.log('\n📋 Otros archivos:');
            otrosArchivos.slice(0, 5).forEach((archivo, index) => {
                console.log(`   ${index + 1}. 📄 ${archivo}`);
            });
            if (otrosArchivos.length > 5) {
                console.log(`   ... y ${otrosArchivos.length - 5} más`);
            }
        }
        
        return { carpetas, archivosTxt, otrosArchivos };
    } catch (err) {
        console.error('❌ Error al leer el directorio:', err.message);
        return { carpetas: [], archivosTxt: [], otrosArchivos: [] };
    }
};

// Función para procesar un archivo
const procesarArchivo = async (rutaCompleta, nombreArchivo) => {
    try {
        console.log(`\n🔄 Procesando archivo: ${nombreArchivo}`);
        console.log(`📍 Ruta: ${rutaCompleta}`);
        
        // Leer el archivo usando tu función
        const contenidoTexto = await fs.readFile(rutaCompleta, 'utf8');
        console.log('✅ Archivo leído correctamente');
        
        // Mapear los datos con tu función existente
        const datosMapeados = await mapeoDatos(contenidoTexto);
        console.log('✅ Datos procesados correctamente');
        
        // AQUÍ ES DONDE FALTABA: Llamar a tu función de crear Excel
        await createExcel(datosMapeados, nombreArchivo);
        console.log('📊 Archivo Excel generado exitosamente.');
        
        return true;
    } catch (error) {
        console.error('❌ Error al procesar el archivo:', error.message);
        return false;
    }
};

// Función principal de navegación
const navegarYProcesar = async () => {
    let carpetaActual = process.cwd();
    
    console.log('🚀 Navegador de archivos - Procesador de texto a Excel');
    console.log('💡 Comandos disponibles:');
    console.log('   - Escribe el nombre de una carpeta para entrar');
    console.log('   - Escribe ".." para ir al directorio padre');
    console.log('   - Escribe el nombre de un archivo .txt para procesarlo');
    console.log('   - Escribe "salir" para terminar');
    
    while (true) {
        try {
            // Mostrar contenido de la carpeta actual
            const { carpetas, archivosTxt } = await mostrarContenidoCarpeta(carpetaActual);
            
            const respuesta = await pregunta('\n🔍 ¿Qué quieres hacer? (carpeta/archivo/.. /salir): ');
            const input = respuesta.trim();
            
            if (input.toLowerCase() === 'salir' || input.toLowerCase() === 'exit') {
                console.log('👋 ¡Hasta luego!');
                break;
            }
            
            if (input === '') {
                console.log('⚠️  Por favor ingresa un comando válido');
                continue;
            }
            
            // Ir al directorio padre
            if (input === '..') {
                const nuevaCarpeta = path.dirname(carpetaActual);
                if (nuevaCarpeta !== carpetaActual) {
                    carpetaActual = nuevaCarpeta;
                    console.log(`📁 Subiendo a: ${carpetaActual}`);
                } else {
                    console.log('⚠️  Ya estás en el directorio raíz');
                }
                continue;
            }
            
            // Verificar si es una carpeta
            const rutaCarpeta = path.join(carpetaActual, input);
            try {
                const stat = await fs.stat(rutaCarpeta);
                if (stat.isDirectory()) {
                    carpetaActual = rutaCarpeta;
                    console.log(`📁 Entrando a: ${carpetaActual}`);
                    continue;
                }
            } catch (err) {
                // No es una carpeta, continuar con verificación de archivo
            }
            
            // Verificar si es un archivo .txt
            let rutaArchivo = path.join(carpetaActual, input);
            
            // Si no tiene extensión, agregar .txt
            if (!path.extname(input)) {
                rutaArchivo = path.join(carpetaActual, input + '.txt');
            }
            
            try {
                const stat = await fs.stat(rutaArchivo);
                if (stat.isFile() && rutaArchivo.endsWith('.txt')) {
                    const exito = await procesarArchivo(rutaArchivo, path.basename(rutaArchivo));
                    
                    if (exito) {
                        const continuar = await pregunta('\n¿Quieres procesar otro archivo? (s/n): ');
                        if (continuar.toLowerCase() !== 's' && continuar.toLowerCase() !== 'si') {
                            console.log('👋 ¡Hasta luego!');
                            break;
                        }
                    }
                } else {
                    console.log('⚠️  El archivo no es un .txt válido');
                }
            } catch (err) {
                console.log('❌ Archivo o carpeta no encontrado');
                console.log('💡 Verifica que el nombre esté escrito correctamente');
            }
            
        } catch (error) {
            console.error('❌ Error en la aplicación:', error.message);
        }
    }
};

// Función principal
const main = async () => {
    try {
        await navegarYProcesar();
    } catch (error) {
        console.error('Error crítico:', error);
    } finally {
        rl.close();
    }
};

main();