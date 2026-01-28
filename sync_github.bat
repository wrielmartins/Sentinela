@echo off
echo ===================================================
echo   SINCRONIZANDO PROJETO COM GITHUB (Sentinela)
echo ===================================================
echo.

:: Tenta usar git do PATH, se falhar usa caminho padrao
where git >nul 2>nul
if %errorlevel% neq 0 (
    set GIT_CMD="C:\Program Files\Git\cmd\git.exe"
) else (
    set GIT_CMD=git
)

echo Adicionando alteracoes...
%GIT_CMD% add .

echo Registrando versao...
%GIT_CMD% commit -m "Atualizacao: %date% %time%"

echo Enviando para nuvem...
%GIT_CMD% push origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Nao foi possivel enviar. Verifique se voce esta logado.
    echo Na primeira vez, uma janela de login do GitHub deve aparecer.
) else (
    echo.
    echo [SUCESSO] Projeto sincronizado com sucesso!
)

echo.
pause
