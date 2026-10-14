@echo off
cd /d "%~dp0"
if not exist node_modules (
  call npm.cmd ci
  if errorlevel 1 goto error
)
echo Iniciando la prueba local de WordPress...
echo Cuando este lista, abre http://127.0.0.1:9400 en tu navegador.
echo Deja esta ventana abierta. Ctrl+C detiene la prueba.
call npm.cmd run wordpress:demo
if errorlevel 1 goto error
exit /b 0
:error
echo No se pudo iniciar. Revisa el mensaje anterior y los puertos 9400 y 5000.
pause
exit /b 1
