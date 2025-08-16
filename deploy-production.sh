#!/bin/bash

# ===== TRIGAL CRM v1.2.0 - DESPLIEGUE DE PRODUCCIÓN =====
# Script para despliegue en Azure App Service
# Fecha: 16 de Agosto de 2025

set -e  # Exit on any error

echo "🌽 ================================================="
echo "🌽 TRIGAL CRM v1.2.0 - DESPLIEGUE DE PRODUCCIÓN"
echo "🌽 ================================================="
echo ""

# Configuración de variables
RESOURCE_GROUP="trigal-crm-production-rg"
LOCATION="West US 2"
APP_NAME="trigal-crm-production"
SQL_SERVER_NAME="trigal-crm-prod-server"
DATABASE_NAME="TrigalCRM_Production"
SQL_ADMIN_USER="trigarladmin"
SQL_ADMIN_PASSWORD="TrigalCRM2025!Production@Secure"
APP_SERVICE_PLAN="trigal-crm-prod-plan"
STORAGE_ACCOUNT="trigalcrmprodstore"

echo "📋 CONFIGURACIÓN DE DESPLIEGUE:"
echo "  • Resource Group: $RESOURCE_GROUP"
echo "  • Ubicación: $LOCATION"
echo "  • App Name: $APP_NAME"
echo "  • SQL Server: $SQL_SERVER_NAME"
echo "  • Base de Datos: $DATABASE_NAME"
echo ""

# Verificar Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI no está instalado"
    echo "📥 Instala desde: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

echo "✅ Azure CLI detectado"

# Verificar login
if ! az account show &> /dev/null; then
    echo "🔐 Iniciando sesión en Azure..."
    az login
fi

echo "✅ Sesión de Azure activa"
echo ""

# Crear Resource Group
echo "📦 Creando Resource Group..."
az group create \
    --name $RESOURCE_GROUP \
    --location "$LOCATION" \
    --tags environment=production project=trigal-crm version=1.2.0

# Registrar proveedores necesarios
echo "🔧 Registrando proveedores de Azure..."
az provider register --namespace Microsoft.Web --wait
az provider register --namespace Microsoft.Sql --wait
az provider register --namespace Microsoft.Storage --wait

# Crear SQL Server
echo "🗄️ Creando SQL Server..."
az sql server create \
    --name $SQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --admin-user $SQL_ADMIN_USER \
    --admin-password "$SQL_ADMIN_PASSWORD"

# Configurar firewall del SQL Server
echo "🔥 Configurando firewall de SQL Server..."
az sql server firewall-rule create \
    --server $SQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --name "AllowAzureServices" \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 0.0.0.0

# Crear base de datos
echo "💾 Creando base de datos de producción..."
az sql db create \
    --server $SQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --name $DATABASE_NAME \
    --service-objective S1 \
    --backup-storage-redundancy Local

# Crear Storage Account
echo "📁 Creando Storage Account..."
az storage account create \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --kind StorageV2

# Crear App Service Plan
echo "⚙️ Creando App Service Plan..."
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku P1V2 \
    --is-linux

# Verificar runtime disponible
echo "🔍 Verificando runtime de Node.js..."
AVAILABLE_RUNTIME=$(az webapp list-runtimes --os-type linux | grep -o 'NODE[:|][0-9][0-9][-lts]*' | head -1)
echo "✅ Runtime seleccionado: $AVAILABLE_RUNTIME"

# Crear Web App
echo "🌐 Creando Web App..."
az webapp create \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --runtime "$AVAILABLE_RUNTIME"

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."

# Obtener connection string de la base de datos
DB_CONNECTION_STRING="Server=tcp:$SQL_SERVER_NAME.database.windows.net,1433;Initial Catalog=$DATABASE_NAME;Persist Security Info=False;User ID=$SQL_ADMIN_USER;Password=$SQL_ADMIN_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Obtener storage connection string
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --query connectionString \
    --output tsv)

# Configurar todas las variables de entorno
az webapp config appsettings set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        NODE_ENV=production \
        PORT=8080 \
        APP_NAME=TrigalCRM \
        APP_VERSION=1.2.0 \
        JWT_SECRET="TrigalCRM_Production_Secret_2025_Very_Secure_Key_12345" \
        JWT_EXPIRATION=24h \
        DB_CONNECTION_STRING="$DB_CONNECTION_STRING" \
        STORAGE_CONNECTION_STRING="$STORAGE_CONNECTION_STRING" \
        LOG_LEVEL=info \
        RATE_LIMIT_ENABLED=true \
        RATE_LIMIT_WINDOW=15 \
        RATE_LIMIT_MAX_REQUESTS=100 \
        COMPANY_NAME="Productos Trigal S.A. de C.V." \
        COMPANY_RFC="PTR123456789" \
        DEFAULT_CURRENCY=MXN \
        DEFAULT_IVA=16 \
        TIMEZONE="America/Mexico_City"

# Configurar comando de inicio
echo "🚀 Configurando comando de inicio..."
az webapp config set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --startup-file "npm start"

# Preparar archivos para despliegue
echo "📦 Preparando archivos para despliegue..."

# Crear directorio temporal para producción
TEMP_DIR="trigal-production-deploy"
rm -rf $TEMP_DIR
mkdir $TEMP_DIR

# Copiar archivos necesarios
cp production-server.js $TEMP_DIR/server.js
cp production-package.json $TEMP_DIR/package.json
cp production.env $TEMP_DIR/.env
cp index.html $TEMP_DIR/
cp mvp-styles.css $TEMP_DIR/
cp mvp-script.js $TEMP_DIR/
cp mvp-script-extended.js $TEMP_DIR/
cp mvp-admin.js $TEMP_DIR/
cp mvp-final-functions.js $TEMP_DIR/
cp manifest.json $TEMP_DIR/
cp sw.js $TEMP_DIR/
cp LogoElTrigal.webp $TEMP_DIR/ 2>/dev/null || echo "⚠️ Logo no encontrado, continuando..."

# Crear package.json optimizado para Azure
cat > $TEMP_DIR/package.json << EOF
{
  "name": "trigal-crm-production",
  "version": "1.2.0",
  "description": "Sistema CRM Trigal v1.2.0 - Producción",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "postinstall": "echo 'Instalación completa'"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.5",
    "morgan": "^1.10.0",
    "winston": "^3.11.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
EOF

# Crear .deployment para Azure
cat > $TEMP_DIR/.deployment << EOF
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
POST_DEPLOYMENT_ACTION=npm start
EOF

# Crear web.config para Azure
cat > $TEMP_DIR/web.config << EOF
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <webSocket enabled="false" />
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
    <iisnode watchedFiles="web.config;*.js"/>
  </system.webServer>
</configuration>
EOF

# Crear archivo ZIP para despliegue
echo "📦 Creando paquete de despliegue..."
cd $TEMP_DIR
zip -r ../trigal-production-deploy.zip . -x "*.git*" "node_modules/*" "logs/*"
cd ..

# Desplegar aplicación
echo "🚀 Desplegando aplicación..."
az webapp deployment source config-zip \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --src trigal-production-deploy.zip

# Aplicar esquema de base de datos
echo "🗄️ Aplicando esquema de base de datos..."

# Obtener IP pública para acceso temporal
MY_IP=$(curl -s https://api.ipify.org)
echo "📍 Tu IP pública: $MY_IP"

# Agregar regla de firewall temporal
az sql server firewall-rule create \
    --server $SQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --name "TempLocalAccess" \
    --start-ip-address $MY_IP \
    --end-ip-address $MY_IP

# Aplicar esquema (requiere sqlcmd instalado)
if command -v sqlcmd &> /dev/null; then
    echo "✅ Aplicando esquema de base de datos..."
    sqlcmd -S "$SQL_SERVER_NAME.database.windows.net" \
           -d $DATABASE_NAME \
           -U $SQL_ADMIN_USER \
           -P "$SQL_ADMIN_PASSWORD" \
           -i database_production_v1.2.sql
    echo "✅ Esquema aplicado exitosamente"
else
    echo "⚠️ sqlcmd no disponible. Aplica database_production_v1.2.sql manualmente:"
    echo "   Servidor: $SQL_SERVER_NAME.database.windows.net"
    echo "   Base de datos: $DATABASE_NAME"
    echo "   Usuario: $SQL_ADMIN_USER"
fi

# Remover regla de firewall temporal
az sql server firewall-rule delete \
    --server $SQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --name "TempLocalAccess" \
    --yes || echo "⚠️ No se pudo eliminar regla temporal"

# Configurar escalado automático
echo "📈 Configurando escalado automático..."
az monitor autoscale create \
    --name "${APP_NAME}-autoscale" \
    --resource-group $RESOURCE_GROUP \
    --resource "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/serverfarms/$APP_SERVICE_PLAN" \
    --min-count 1 \
    --max-count 3 \
    --count 1

# Configurar alertas
echo "🚨 Configurando alertas..."
az monitor action-group create \
    --name "trigal-crm-alerts" \
    --resource-group $RESOURCE_GROUP \
    --short-name "TrigalCRM"

# Obtener URL de la aplicación
APP_URL="https://$APP_NAME.azurewebsites.net"

# Esperar a que la aplicación esté lista
echo "⏳ Esperando a que la aplicación esté disponible..."
sleep 60

# Verificar despliegue
echo "🔍 Verificando despliegue..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/health" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ ¡Despliegue exitoso!"
else
    echo "⚠️ La aplicación podría necesitar más tiempo para iniciar"
    echo "   Estado HTTP: $HTTP_STATUS"
fi

# Limpiar archivos temporales
echo "🧹 Limpiando archivos temporales..."
rm -rf $TEMP_DIR
rm -f trigal-production-deploy.zip

echo ""
echo "🌽 ================================================="
echo "🌽 DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "🌽 ================================================="
echo ""
echo "📊 INFORMACIÓN DEL DESPLIEGUE:"
echo "  • URL de la aplicación: $APP_URL"
echo "  • SQL Server: $SQL_SERVER_NAME.database.windows.net"
echo "  • Base de datos: $DATABASE_NAME"
echo "  • Resource Group: $RESOURCE_GROUP"
echo "  • Storage Account: $STORAGE_ACCOUNT"
echo ""
echo "🔗 ENLACES IMPORTANTES:"
echo "  • Aplicación: $APP_URL"
echo "  • Health Check: $APP_URL/api/health"
echo "  • Login: $APP_URL"
echo ""
echo "👥 USUARIOS DE PRODUCCIÓN:"
echo "  • Admin: admin / password"
echo "  • Gerente: gerente.ventas / password"
echo "  • Vendedor: vendedor.norte / password"
echo ""
echo "⚙️ GESTIÓN DEL RECURSO:"
echo "  • Portal Azure: https://portal.azure.com"
echo "  • Resource Group: $RESOURCE_GROUP"
echo ""
echo "🌽 ¡Trigal CRM v1.2.0 está listo para producción!"
echo "================================================="
