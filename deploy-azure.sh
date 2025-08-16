#!/bin/bash

# Script de despliegue para Azure - CRM Trigal
# Ejecutar: ./deploy-azure.sh

set -e

# Configuración por defecto
RESOURCE_GROUP="trigal-crm-rg-$(openssl rand -hex 2)"
LOCATION="West US 2"
APP_NAME="trigal-crm-$(openssl rand -hex 3)"
SQL_SERVER_NAME="trigal-crm-server-$(openssl rand -hex 3)"
DATABASE_NAME="trigal_crm"
SQL_ADMIN_PASSWORD="TrigalCRM2025Complex!"

echo "🌽 Iniciando despliegue de CRM Trigal en Microsoft Azure..."

# Verificar Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI no encontrado. Instálalo desde: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

echo "✅ Azure CLI encontrado"

# Verificar login
echo "🔐 Verificando login en Azure..."
if ! az account show &> /dev/null; then
    echo "👤 Iniciando login en Azure..."
    az login
fi

echo "👤 Usuario actual: $(az account show --query 'user.name' -o tsv)"

# Crear Resource Group
echo "📦 Creando Resource Group: $RESOURCE_GROUP..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Crear Azure SQL Server
echo "🗄️ Creando Azure SQL Server..."
az sql server create \
    --name $SQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --admin-user "trigal_admin" \
    --admin-password "$SQL_ADMIN_PASSWORD"

# Configurar firewall
echo "🔥 Configurando firewall de SQL Server..."
az sql server firewall-rule create \
    --resource-group $RESOURCE_GROUP \
    --server $SQL_SERVER_NAME \
    --name "AllowAzureServices" \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0

# Permitir acceso desde tu IP actual
MY_IP=$(curl -s ifconfig.me)
echo "🌐 Permitiendo acceso desde tu IP: $MY_IP"
az sql server firewall-rule create \
    --resource-group $RESOURCE_GROUP \
    --server $SQL_SERVER_NAME \
    --name "MyIP" \
    --start-ip-address $MY_IP \
    --end-ip-address $MY_IP

# Crear base de datos
echo "💾 Creando base de datos SQL..."
az sql db create \
    --resource-group $RESOURCE_GROUP \
    --server $SQL_SERVER_NAME \
    --name $DATABASE_NAME \
    --service-objective Basic

# Crear App Service Plan
echo "📋 Creando App Service Plan..."
az appservice plan create \
    --name "$APP_NAME-plan" \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku B1 \
    --is-linux

# Crear Web App
echo "🌐 Creando Web App..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan "$APP_NAME-plan" \
    --name $APP_NAME \
    --runtime "NODE:18-lts"

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
        NODE_ENV=production \
        PORT=8080 \
        AZURE_SQL_SERVER="$SQL_SERVER_NAME.database.windows.net" \
        AZURE_SQL_DATABASE=$DATABASE_NAME \
        AZURE_SQL_USERNAME="trigal_admin" \
        AZURE_SQL_PASSWORD="$SQL_ADMIN_PASSWORD" \
        JWT_SECRET="azure_trigal_crm_jwt_secret_super_seguro_2025" \
        JWT_EXPIRES_IN="24h"

# Crear Storage Account
echo "💾 Creando Storage Account..."
STORAGE_ACCOUNT_NAME="trigalcrmstorage$(openssl rand -hex 2)"
az storage account create \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku Standard_LRS

# Obtener connection string del storage
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP \
    --query connectionString \
    --output tsv)

# Actualizar configuración con storage
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
        AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION_STRING"

# Crear Application Insights
echo "📊 Creando Application Insights..."
az monitor app-insights component create \
    --app $APP_NAME \
    --location "$LOCATION" \
    --resource-group $RESOURCE_GROUP

# Obtener instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
    --app $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query instrumentationKey \
    --output tsv)

# Actualizar configuración con Application Insights
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
        APPINSIGHTS_INSTRUMENTATIONKEY="$INSTRUMENTATION_KEY"

# Configurar HTTPS only
echo "🔒 Configurando HTTPS only..."
az webapp update \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --https-only true

# Mostrar información final
echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📋 Información del despliegue:"
echo "🌐 URL de la aplicación: https://$APP_NAME.azurewebsites.net"
echo "🗄️ Servidor SQL: $SQL_SERVER_NAME.database.windows.net"
echo "💾 Base de datos: $DATABASE_NAME"
echo "👤 Usuario SQL: trigal_admin"
echo "🔑 Contraseña SQL: $SQL_ADMIN_PASSWORD"
echo "💾 Storage Account: $STORAGE_ACCOUNT_NAME"
echo ""
echo "📝 Próximos pasos:"
echo "1. Ejecutar el script SQL para crear las tablas"
echo "2. Subir el código de la aplicación"
echo "3. Configurar dominio personalizado (opcional)"
echo ""
echo "🔗 Portal de Azure: https://portal.azure.com"
echo ""
echo "📄 Para conectarte a la base de datos:"
echo "   Server: $SQL_SERVER_NAME.database.windows.net"
echo "   Database: $DATABASE_NAME"
echo "   User: trigal_admin"
echo "   Password: $SQL_ADMIN_PASSWORD"
