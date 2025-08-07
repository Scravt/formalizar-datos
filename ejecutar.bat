@echo off
echo 🚀 Iniciando procesador de archivos...
cd /d "%~dp0"

REM Usar el nombre correcto de tu archivo
node navegador.js

echo.
echo ✅ Proceso completado. Presiona cualquier tecla para cerrar.
pause >nul