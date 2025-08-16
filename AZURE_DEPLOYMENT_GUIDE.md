# 🌟 Guía Completa: CRM Trigal en Microsoft Azure

## 🎯 **Resumen de la Nueva Estrategia**

✅ **Microsoft Azure** - Plataforma empresarial robusta  
✅ **Azure SQL Database** - SQL Server gestionado y escalable  
✅ **Azure App Service** - Hosting automático con escalabilidad  
✅ **Azure Storage** - Almacenamiento de archivos seguro  
✅ **Application Insights** - Monitoreo avanzado  
✅ **Azure Key Vault** - Gestión segura de secretos  

---

## 💰 **Estimación de Costos Mensuales**

### **Plan Básico:**
- **Azure SQL Database (Basic)**: $5 USD/mes
- **App Service (B1)**: $13 USD/mes
- **Storage Account**: $2 USD/mes
- **Application Insights**: Incluido
- **Total**: ~$20 USD/mes

### **Plan Profesional:**
- **Azure SQL Database (S1)**: $20 USD/mes
- **App Service (S1)**: $56 USD/mes
- **Storage Account**: $5 USD/mes
- **Total**: ~$81 USD/mes

---

## 🚀 **PASO A PASO - Implementación Completa**

### **Prerrequisitos:**

1. **Cuenta de Microsoft Azure** (crear en https://azure.microsoft.com)
2. **Azure CLI** instalado en tu Mac
3. **Git** configurado con tu repositorio

### **Paso 1: Instalar Azure CLI** (5 minutos)

```bash
# En macOS con Homebrew
brew install azure-cli

# O descarga desde: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
```

### **Paso 2: Login en Azure** (2 minutos)

```bash
# Iniciar sesión
az login

# Verificar suscripción
az account show
```

### **Paso 3: Ejecutar Despliegue Automatizado** (15 minutos)

```bash
# Desde el directorio del proyecto
./deploy-azure.sh
```

Este script automáticamente:
- ✅ Crea Resource Group
- ✅ Configura Azure SQL Server
- ✅ Crea base de datos
- ✅ Configura App Service
- ✅ Establece variables de entorno
- ✅ Configura Storage Account
- ✅ Instala Application Insights

### **Paso 4: Crear las Tablas de Base de Datos** (5 minutos)

**Opción A: Desde Azure Portal**
1. Ve a https://portal.azure.com
2. Busca "SQL databases" → "trigal_crm"
3. Clic en "Query editor"
4. Login con: `trigal_admin` / `TrigalCRM2025!@#$`
5. Pega y ejecuta el contenido de `database_schema_sqlserver.sql`

**Opción B: Desde Azure Data Studio**
1. Descargar Azure Data Studio
2. Conectar a: `trigal-crm-server.database.windows.net`
3. Ejecutar script SQL

**Opción C: Desde tu Mac**
```bash
# Instalar sqlcmd (si no lo tienes)
brew install mssql-tools

# Ejecutar script
sqlcmd -S trigal-crm-server.database.windows.net -d trigal_crm -U trigal_admin -P "TrigalCRM2025!@#$" -i database_schema_sqlserver.sql
```

### **Paso 5: Subir el Código** (5 minutos)

```bash
# Preparar archivos para Azure
cp package-azure.json package.json
cp server-azure.js server.js
cp azure.env .env

# Subir a GitHub
git add .
git commit -m "Configuración para Microsoft Azure"
git push origin main

# Configurar despliegue continuo desde GitHub
az webapp deployment source config \
    --name trigal-crm \
    --resource-group trigal-crm-rg \
    --repo-url "https://github.com/TU_USUARIO/trigal-crm.git" \
    --branch main \
    --manual-integration
```

### **Paso 6: Verificar Funcionamiento** (2 minutos)

```bash
# Verificar que la app esté funcionando
curl https://trigal-crm.azurewebsites.net/health

# Verificar API
curl https://trigal-crm.azurewebsites.net/info
```

---

## 🔧 **Configuración Avanzada**

### **SSL/TLS Personalizado:**
```bash
# Configurar dominio personalizado
az webapp config hostname add \
    --webapp-name trigal-crm \
    --resource-group trigal-crm-rg \
    --hostname tu-dominio.com

# Configurar SSL
az webapp config ssl bind \
    --certificate-thumbprint TU_THUMBPRINT \
    --ssl-type SNI \
    --name trigal-crm \
    --resource-group trigal-crm-rg
```

### **Escalabilidad Automática:**
```bash
# Configurar auto-scaling
az monitor autoscale create \
    --resource-group trigal-crm-rg \
    --resource trigal-crm \
    --resource-type Microsoft.Web/serverfarms \
    --name autoscale-trigal \
    --min-count 1 \
    --max-count 5 \
    --count 1
```

### **Backup Automático:**
```bash
# Configurar backup de App Service
az webapp config backup create \
    --resource-group trigal-crm-rg \
    --webapp-name trigal-crm \
    --backup-name daily-backup \
    --storage-account-url "TU_STORAGE_URL"
```

---

## 📊 **Monitoreo y Logs**

### **Ver logs en tiempo real:**
```bash
# Logs de la aplicación
az webapp log tail --name trigal-crm --resource-group trigal-crm-rg

# Logs específicos
az webapp log show --name trigal-crm --resource-group trigal-crm-rg
```

### **Application Insights:**
- **Portal**: https://portal.azure.com → Application Insights
- **Métricas**: Rendimiento, errores, usuarios
- **Alertas**: Configurar notificaciones automáticas

### **Monitoreo de SQL:**
- **Query Performance Insight**
- **Automatic tuning**
- **Alertas de rendimiento**

---

## 🔐 **Seguridad Avanzada**

### **Azure Key Vault:**
```bash
# Crear Key Vault
az keyvault create \
    --name trigal-crm-keyvault \
    --resource-group trigal-crm-rg \
    --location "East US"

# Almacenar secretos
az keyvault secret set \
    --vault-name trigal-crm-keyvault \
    --name "SQLPassword" \
    --value "TrigalCRM2025!@#$"
```

### **Azure Active Directory:**
```bash
# Configurar autenticación con Azure AD
az webapp auth update \
    --name trigal-crm \
    --resource-group trigal-crm-rg \
    --enabled true \
    --action LoginWithAzureActiveDirectory
```

---

## 🌐 **URLs y Accesos**

### **Aplicación:**
- **URL Principal**: https://trigal-crm.azurewebsites.net
- **API Base**: https://trigal-crm.azurewebsites.net/api
- **Health Check**: https://trigal-crm.azurewebsites.net/health

### **Base de Datos:**
- **Servidor**: trigal-crm-server.database.windows.net
- **Base de datos**: trigal_crm
- **Usuario**: trigal_admin
- **Puerto**: 1433

### **Portales de Administración:**
- **Azure Portal**: https://portal.azure.com
- **Azure DevOps**: https://dev.azure.com (para CI/CD avanzado)

---

## 🔄 **Comandos de Mantenimiento**

### **Actualizar aplicación:**
```bash
# Desde GitHub (automático con webhook)
git push origin main

# Reiniciar aplicación
az webapp restart --name trigal-crm --resource-group trigal-crm-rg
```

### **Backup de base de datos:**
```bash
# Backup automático ya configurado
# Backup manual:
az sql db export \
    --resource-group trigal-crm-rg \
    --server trigal-crm-server \
    --name trigal_crm \
    --storage-key-type StorageAccessKey \
    --storage-key "TU_STORAGE_KEY" \
    --storage-uri "https://storage.blob.core.windows.net/backups/backup.bacpac"
```

### **Escalar recursos:**
```bash
# Escalar App Service
az appservice plan update \
    --name trigal-crm-plan \
    --resource-group trigal-crm-rg \
    --sku S1

# Escalar base de datos
az sql db update \
    --resource-group trigal-crm-rg \
    --server trigal-crm-server \
    --name trigal_crm \
    --service-objective S1
```

---

## 🎯 **Ventajas sobre DigitalOcean**

✅ **Escalabilidad automática** - Se ajusta según demanda  
✅ **Backup automático** - Sin configuración manual  
✅ **Monitoreo integrado** - Application Insights incluido  
✅ **Seguridad empresarial** - Azure Active Directory  
✅ **SQL Server nativo** - Mejor rendimiento y funcionalidades  
✅ **Soporte 24/7** - Microsoft Support  
✅ **Compliance** - Certificaciones empresariales  
✅ **Integración Office 365** - Si la empresa usa Microsoft  

---

## 🚀 **Siguientes Pasos**

1. **✅ Ejecutar `./deploy-azure.sh`**
2. **✅ Crear tablas con el script SQL**
3. **✅ Subir código a GitHub**
4. **✅ Configurar dominio personalizado**
5. **✅ Entrenar al equipo de ventas**

---

## 📞 **Soporte y Resolución de Problemas**

### **Logs y Diagnóstico:**
```bash
# Ver estado de recursos
az resource list --resource-group trigal-crm-rg --output table

# Diagnóstico de App Service
az webapp show --name trigal-crm --resource-group trigal-crm-rg

# Test de conectividad a SQL
az sql db show --resource-group trigal-crm-rg --server trigal-crm-server --name trigal_crm
```

### **Contacto Microsoft:**
- **Documentación**: https://docs.microsoft.com/azure
- **Soporte**: Portal de Azure → Support
- **Comunidad**: https://docs.microsoft.com/answers

---

**¡Tu CRM empresarial estará funcionando en Azure en menos de 30 minutos!** 🚀
