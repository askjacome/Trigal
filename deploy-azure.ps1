# Script de despliegue para Azure - CRM Trigal
# Ejecutar en PowerShell: .\deploy-azure.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName = "trigal-crm-rg",
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "East US",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "trigal-crm",
    
    [Parameter(Mandatory=$false)]
    [string]$SqlServerName = "trigal-crm-server",
    
    [Parameter(Mandatory=$false)]
    [string]$DatabaseName = "trigal_crm"
)

Write-Host "🌽 Iniciando despliegue de CRM Trigal en Microsoft Azure..." -ForegroundColor Green

# Verificar que Azure CLI está instalado
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI no encontrado. Por favor, instálalo desde: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}

# Login en Azure (si no está logueado)
Write-Host "🔐 Verificando login en Azure..." -ForegroundColor Yellow
$loginStatus = az account show 2>$null
if (!$loginStatus) {
    Write-Host "👤 Iniciando login en Azure..." -ForegroundColor Yellow
    az login
}

Write-Host "👤 Usuario actual:" -ForegroundColor Cyan
az account show --query "user.name" -o tsv

# Crear Resource Group
Write-Host "📦 Creando Resource Group: $ResourceGroupName..." -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# Crear Azure SQL Server
Write-Host "🗄️ Creando Azure SQL Server..." -ForegroundColor Yellow
$sqlAdminPassword = "TrigalCRM2025!@#$"
az sql server create `
    --name $SqlServerName `
    --resource-group $ResourceGroupName `
    --location $Location `
    --admin-user "trigal_admin" `
    --admin-password $sqlAdminPassword

# Configurar firewall de SQL Server para permitir servicios de Azure
Write-Host "🔥 Configurando firewall de SQL Server..." -ForegroundColor Yellow
az sql server firewall-rule create `
    --resource-group $ResourceGroupName `
    --server $SqlServerName `
    --name "AllowAzureServices" `
    --start-ip-address 0.0.0.0 `
    --end-ip-address 0.0.0.0

# Crear base de datos
Write-Host "💾 Creando base de datos SQL..." -ForegroundColor Yellow
az sql db create `
    --resource-group $ResourceGroupName `
    --server $SqlServerName `
    --name $DatabaseName `
    --service-objective Basic

# Crear App Service Plan
Write-Host "📋 Creando App Service Plan..." -ForegroundColor Yellow
az appservice plan create `
    --name "$AppName-plan" `
    --resource-group $ResourceGroupName `
    --location $Location `
    --sku B1 `
    --is-linux

# Crear Web App
Write-Host "🌐 Creando Web App..." -ForegroundColor Yellow
az webapp create `
    --resource-group $ResourceGroupName `
    --plan "$AppName-plan" `
    --name $AppName `
    --runtime "NODE:18-lts"

# Configurar variables de entorno
Write-Host "⚙️ Configurando variables de entorno..." -ForegroundColor Yellow
az webapp config appsettings set `
    --resource-group $ResourceGroupName `
    --name $AppName `
    --settings `
        NODE_ENV=production `
        PORT=8080 `
        AZURE_SQL_SERVER="$SqlServerName.database.windows.net" `
        AZURE_SQL_DATABASE=$DatabaseName `
        AZURE_SQL_USERNAME="trigal_admin" `
        AZURE_SQL_PASSWORD=$sqlAdminPassword `
        JWT_SECRET="azure_trigal_crm_jwt_secret_super_seguro_2025" `
        JWT_EXPIRES_IN="24h"

# Crear Storage Account para archivos
Write-Host "💾 Creando Storage Account..." -ForegroundColor Yellow
$storageAccountName = "trigalcrmstorage$(Get-Random -Minimum 1000 -Maximum 9999)"
az storage account create `
    --name $storageAccountName `
    --resource-group $ResourceGroupName `
    --location $Location `
    --sku Standard_LRS

# Obtener connection string del storage
$storageConnectionString = az storage account show-connection-string `
    --name $storageAccountName `
    --resource-group $ResourceGroupName `
    --query connectionString `
    --output tsv

# Actualizar configuración con storage
az webapp config appsettings set `
    --resource-group $ResourceGroupName `
    --name $AppName `
    --settings `
        AZURE_STORAGE_CONNECTION_STRING=$storageConnectionString

# Crear Application Insights
Write-Host "📊 Creando Application Insights..." -ForegroundColor Yellow
az monitor app-insights component create `
    --app $AppName `
    --location $Location `
    --resource-group $ResourceGroupName

# Obtener instrumentation key
$instrumentationKey = az monitor app-insights component show `
    --app $AppName `
    --resource-group $ResourceGroupName `
    --query instrumentationKey `
    --output tsv

# Actualizar configuración con Application Insights
az webapp config appsettings set `
    --resource-group $ResourceGroupName `
    --name $AppName `
    --settings `
        APPINSIGHTS_INSTRUMENTATIONKEY=$instrumentationKey

# Configurar despliegue desde Git
Write-Host "🔄 Configurando despliegue continuo..." -ForegroundColor Yellow
az webapp deployment source config `
    --name $AppName `
    --resource-group $ResourceGroupName `
    --repo-url "https://github.com/tu-usuario/trigal-crm.git" `
    --branch main `
    --manual-integration

# Mostrar información final
Write-Host "🎉 ¡Despliegue completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Información del despliegue:" -ForegroundColor Cyan
Write-Host "🌐 URL de la aplicación: https://$AppName.azurewebsites.net" -ForegroundColor White
Write-Host "🗄️ Servidor SQL: $SqlServerName.database.windows.net" -ForegroundColor White
Write-Host "💾 Base de datos: $DatabaseName" -ForegroundColor White
Write-Host "👤 Usuario SQL: trigal_admin" -ForegroundColor White
Write-Host "🔑 Contraseña SQL: $sqlAdminPassword" -ForegroundColor White
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ejecutar el script SQL para crear las tablas" -ForegroundColor White
Write-Host "2. Configurar el dominio personalizado (opcional)" -ForegroundColor White
Write-Host "3. Configurar SSL/TLS" -ForegroundColor White
Write-Host "4. Subir el código de la aplicación" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Portal de Azure: https://portal.azure.com" -ForegroundColor Cyan
