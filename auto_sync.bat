@echo off
setlocal
echo ===================================================
echo   MODO AUTOMATICO: MONITORANDO SENTINELA
echo ===================================================
echo   Este script vai verificar alteracoes a cada 30 segundos
echo   e enviar para o GitHub automaticamente.
echo   [!] Nao feche esta janela para manter ativo.
echo ===================================================
echo.

:: Detectar Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    set GIT_CMD="C:\Program Files\Git\cmd\git.exe"
) else (
    set GIT_CMD=git
)

:LOOP
:: Verifica status
%GIT_CMD% status --porcelain > nul
if %errorlevel% neq 0 (
    echo [ERRO] Nao foi possivel verificar status. Tentando novamente em 30s...
    timeout /t 30 >nul
    goto LOOP
)

:: Se houver saida no status (alteracoes), faz o sync
for /f "delims=" %%i in ('%GIT_CMD% status --porcelain') do (
    echo [%date% %time%] Alteracao detectada! Sincronizando...
    
    %GIT_CMD% add .
    %GIT_CMD% commit -m "Auto-sync: %date% %time%"
    %GIT_CMD% push origin main
    
    if %errorlevel% equ 0 (
        echo [SUCESSO] Atualizado no GitHub.
    ) else (
        echo [ERRO] Falha ao enviar. Verifique sua conexao/login.
    )
    
    echo Aguardando novas alteracoes...
    echo.
    goto WAIT
)

:: Se nao houver alteracoes
:: echo [%time%] Nada novo. Monitorando...

:WAIT
timeout /t 30 >nul
goto LOOP
