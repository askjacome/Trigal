# 🚀 Guía de Despliegue - CRM Trigal en DigitalOcean

## 📋 Paso a Paso para Enrique

### 1️⃣ **Crear el Droplet en DigitalOcean**

Desde tu panel de DigitalOcean:

1. **Create → Droplets**
2. **Configuración:**
   ```
   📊 Sistema: Ubuntu 22.04 LTS x64
   💾 Plan: Basic - $12/mes (2GB RAM, 1 vCPU, 50GB SSD)
   🌎 Región: New York 3 (más cercana a México)
   🔐 SSH: Conectar tu cuenta de GitHub
   📦 Opciones adicionales:
       ✅ Monitoring
       ✅ IPv6
   ```

3. **En "User data" pegar este script:**
```bash
#!/bin/bash
apt update && apt upgrade -y
apt install -y curl wget git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
npm install -g pm2
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
mkdir -p /var/www/trigal-crm
chown -R www-data:www-data /var/www/trigal-crm

# Configurar Nginx
cat > /etc/nginx/sites-available/trigal-crm << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/trigal-crm /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl restart nginx
echo "✅ Servidor configurado para CRM Trigal"
```

### 2️⃣ **Configurar Base de Datos MySQL**

**Opción A: MySQL en el mismo Droplet (Más económica)**

Conectarse al servidor:
```bash
ssh root@TU_IP_DROPLET
```

Instalar y configurar MySQL:
```bash
# Instalar MySQL
apt install -y mysql-server

# Configuración segura
mysql_secure_installation
# Responder: Y a todo, crear contraseña root fuerte

# Crear base de datos
mysql -u root -p
```

En MySQL ejecutar:
```sql
CREATE DATABASE trigal_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'trigal_user'@'localhost' IDENTIFIED BY 'TrigalCRM2025!';
GRANT ALL PRIVILEGES ON trigal_crm.* TO 'trigal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Opción B: MySQL Managed Database (Recomendada para producción)**
1. En DigitalOcean: **Create → Databases**
2. **MySQL 8, Basic Plan ($15/mes)**
3. **Misma región que el Droplet**

### 3️⃣ **Desplegar la Aplicación**

Desde tu Mac, en el directorio del proyecto:

```bash
# 1. Subir código a GitHub (si no lo has hecho)
git add .
git commit -m "Preparar para despliegue en DigitalOcean"
git push origin main

# 2. Ejecutar despliegue automatizado
./deploy.sh TU_IP_DROPLET
```

**Si prefieres hacerlo manual:**

```bash
# Conectar al servidor
ssh root@TU_IP_DROPLET

# Clonar el repositorio
cd /var/www/trigal-crm
git clone https://github.com/tu-usuario/trigal-crm.git .

# Instalar dependencias
npm install --production

# Configurar variables de entorno
cp env.example .env
nano .env  # Editar con los datos reales
```

### 4️⃣ **Configurar Variables de Entorno**

En el servidor, editar `/var/www/trigal-crm/.env`:

```bash
# Configuración del servidor
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://tu-dominio.com

# Base de datos MySQL
DB_HOST=localhost  # o la IP de tu managed database
DB_PORT=3306
DB_NAME=trigal_crm
DB_USER=trigal_user
DB_PASSWORD=TrigalCRM2025!

# JWT Secret (generar uno único)
JWT_SECRET=una_clave_muy_segura_y_larga_aqui_2025
JWT_EXPIRES_IN=24h
```

### 5️⃣ **Iniciar la Aplicación**

```bash
# Configurar permisos
chown -R www-data:www-data /var/www/trigal-crm
mkdir -p /var/log/trigal-crm

# Iniciar con PM2
cd /var/www/trigal-crm
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # Seguir las instrucciones que aparezcan

# Verificar que funciona
pm2 status
pm2 logs trigal-crm
```

### 6️⃣ **Configurar Dominio (Opcional)**

Si tienes un dominio:

```bash
# Actualizar configuración de Nginx
nano /etc/nginx/sites-available/trigal-crm
# Cambiar server_name _ por server_name tu-dominio.com;

# Configurar SSL con Let's Encrypt
certbot --nginx -d tu-dominio.com

# Reiniciar Nginx
systemctl restart nginx
```

### 7️⃣ **Crear Usuario Administrador**

Desde el navegador, ir a `http://TU_IP_DROPLET/api/auth/register` con POST:

```json
{
  "username": "admin",
  "email": "enrique@tu-email.com",
  "password": "tu_password_seguro",
  "nombre": "Enrique",
  "apellido": "Jacome",
  "rol": "admin"
}
```

### 📊 **Verificación Final**

1. **Verificar aplicación:** `http://TU_IP_DROPLET`
2. **Verificar API:** `http://TU_IP_DROPLET/api/auth/verify`
3. **Monitorear:** `pm2 monit`
4. **Ver logs:** `pm2 logs trigal-crm`

### 🔧 **Comandos Útiles**

```bash
# Reiniciar aplicación
pm2 restart trigal-crm

# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs trigal-crm --lines 50

# Actualizar código
cd /var/www/trigal-crm
git pull origin main
npm install --production
pm2 restart trigal-crm

# Backup de base de datos
mysqldump -u trigal_user -p trigal_crm > backup_$(date +%Y%m%d).sql
```

### ⚠️ **Solución de Problemas**

**Si no funciona el despliegue:**
1. Verificar logs: `pm2 logs trigal-crm`
2. Verificar Nginx: `nginx -t && systemctl status nginx`
3. Verificar MySQL: `mysql -u trigal_user -p trigal_crm`
4. Verificar puertos: `netstat -tlnp | grep :3000`

**Contacto:**
- Panel DigitalOcean: https://cloud.digitalocean.com/
- Documentación: https://docs.digitalocean.com/
