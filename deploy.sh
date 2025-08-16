#!/bin/bash

# Script de despliegue para CRM Trigal en DigitalOcean
# Ejecutar como: ./deploy.sh IP_DEL_DROPLET

echo "🌽 Iniciando despliegue de CRM Trigal..."

# Verificar que se proporcionó la IP
if [ "$#" -ne 1 ]; then
    echo "❌ Uso: ./deploy.sh <IP_DEL_DROPLET>"
    exit 1
fi

SERVER_IP=$1
APP_DIR="/var/www/trigal-crm"
REPO_URL="https://github.com/tu-usuario/trigal-crm.git" # Cambiar por tu repo

echo "🚀 Conectando a servidor $SERVER_IP..."

# Crear script de instalación remoto
cat << 'EOF' > /tmp/install_trigal.sh
#!/bin/bash
set -e

echo "📦 Instalando dependencias..."
cd /var/www/trigal-crm

# Instalar dependencias de Node.js
npm install --production

# Copiar archivo de configuración
cp env.example .env

# Configurar permisos
chown -R www-data:www-data /var/www/trigal-crm
chmod +x /var/www/trigal-crm/server.js

# Crear directorios de logs
mkdir -p /var/log/trigal-crm
chown -R www-data:www-data /var/log/trigal-crm

echo "🗄️ Configurando base de datos..."
# Ejecutar migraciones cuando estén listas
# npm run migrate

echo "🚀 Iniciando aplicación con PM2..."
pm2 stop trigal-crm || true
pm2 delete trigal-crm || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "🔄 Reiniciando Nginx..."
systemctl restart nginx

echo "✅ Despliegue completado!"
echo "🌐 La aplicación está disponible en: http://$SERVER_IP"
EOF

# Copiar archivos al servidor
echo "📁 Copiando archivos..."
scp -r . root@$SERVER_IP:$APP_DIR/

# Ejecutar script de instalación
echo "⚙️ Ejecutando instalación remota..."
scp /tmp/install_trigal.sh root@$SERVER_IP:/tmp/
ssh root@$SERVER_IP "chmod +x /tmp/install_trigal.sh && /tmp/install_trigal.sh"

# Limpiar archivos temporales
rm /tmp/install_trigal.sh

echo ""
echo "🎉 ¡Despliegue exitoso!"
echo "🌐 Aplicación disponible en: http://$SERVER_IP"
echo "📊 Monitorear con: ssh root@$SERVER_IP 'pm2 monit'"
echo "📝 Ver logs con: ssh root@$SERVER_IP 'pm2 logs trigal-crm'"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar dominio y SSL"
echo "2. Configurar base de datos"
echo "3. Crear usuario administrador"
