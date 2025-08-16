# 🌽 INSTRUCCIONES COMPLETAS - CRM Trigal en DigitalOcean

## 🎯 Resumen de lo que hemos preparado

✅ **Backend completo** con Node.js + Express + MySQL  
✅ **Sistema de autenticación** con JWT  
✅ **Base de datos** diseñada para productos de maíz  
✅ **Scripts de despliegue** automatizados  
✅ **Configuración de servidor** con Nginx y PM2  

---

## 🚀 PASOS INMEDIATOS

### 1️⃣ **Crear el Droplet** (5 minutos)
En tu panel de DigitalOcean:

1. **Create → Droplets**
2. **Ubuntu 22.04 LTS** 
3. **$12/mes** (2GB RAM, 1 vCPU, 50GB SSD)
4. **Región**: New York 3
5. **SSH Keys**: Tu cuenta GitHub
6. **User data**: Copiar script completo del archivo `DEPLOY_GUIDE.md`
7. **Create Droplet**

### 2️⃣ **Configurar Base de Datos** (10 minutos)

**Opción Económica** (misma máquina):
```bash
# Conectar al servidor
ssh root@TU_IP_DROPLET

# Instalar MySQL
apt install -y mysql-server
mysql_secure_installation

# Crear base de datos
mysql -u root -p
```

En MySQL:
```sql
CREATE DATABASE trigal_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'trigal_user'@'localhost' IDENTIFIED BY 'TrigalCRM2025!';
GRANT ALL PRIVILEGES ON trigal_crm.* TO 'trigal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3️⃣ **Subir Código** (5 minutos)

En tu Mac:
```bash
# Ir al directorio del proyecto
cd /Users/enriquevargasjacome/CRM_2025/Trigal

# Subir a GitHub
git add .
git commit -m "Backend completo para DigitalOcean"
git push origin main
```

### 4️⃣ **Desplegar** (10 minutos)

**Opción A - Automática** (recomendada):
```bash
./deploy.sh TU_IP_DROPLET
```

**Opción B - Manual**:
```bash
# Conectar al servidor
ssh root@TU_IP_DROPLET

# Clonar código
cd /var/www/trigal-crm
git clone https://github.com/enriquevargasjacome/CRM_2025.git .

# O si el repo tiene otro nombre:
git clone TU_REPO_URL .

# Instalar
npm install --production

# Configurar variables
cp env.example .env
nano .env
```

Editar `.env`:
```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_NAME=trigal_crm
DB_USER=trigal_user
DB_PASSWORD=TrigalCRM2025!
JWT_SECRET=clave_muy_segura_aqui_2025
```

### 5️⃣ **Crear Tablas de Base de Datos** (5 minutos)

```bash
# En el servidor, ejecutar el script SQL
mysql -u trigal_user -p trigal_crm < database_schema.sql
```

### 6️⃣ **Iniciar Aplicación** (5 minutos)

```bash
# Configurar permisos
chown -R www-data:www-data /var/www/trigal-crm
mkdir -p /var/log/trigal-crm

# Iniciar con PM2
cd /var/www/trigal-crm
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Verificar
pm2 status
pm2 logs trigal-crm
```

---

## 🎯 ACCESO A TU CRM

### URLs disponibles:
- **Frontend**: `http://TU_IP_DROPLET`
- **API**: `http://TU_IP_DROPLET/api`
- **Login**: `http://TU_IP_DROPLET/api/auth/login`

### Usuario por defecto:
```
Username: admin
Password: admin123
```

---

## 📱 PRUEBAS RÁPIDAS

### 1. Verificar que funciona:
```bash
curl http://TU_IP_DROPLET/api/auth/verify
```

### 2. Hacer login:
```bash
curl -X POST http://TU_IP_DROPLET/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. Ver productos:
```bash
curl http://TU_IP_DROPLET/api/productos \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## 🔧 COMANDOS ÚTILES

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs trigal-crm

# Reiniciar app
pm2 restart trigal-crm

# Actualizar código
cd /var/www/trigal-crm
git pull origin main
npm install --production
pm2 restart trigal-crm

# Backup de BD
mysqldump -u trigal_user -p trigal_crm > backup_$(date +%Y%m%d).sql

# Ver procesos
htop

# Ver espacio en disco
df -h

# Ver memoria
free -h
```

---

## 🎨 CONFIGURAR DOMINIO (Opcional)

Si tienes un dominio:

```bash
# Actualizar Nginx
nano /etc/nginx/sites-available/trigal-crm
# Cambiar: server_name tu-dominio.com;

# SSL gratis
certbot --nginx -d tu-dominio.com

# Reiniciar
systemctl restart nginx
```

---

## 📞 SOPORTE

### Si algo no funciona:

1. **Ver logs**: `pm2 logs trigal-crm`
2. **Verificar Nginx**: `nginx -t && systemctl status nginx`
3. **Verificar MySQL**: `mysql -u trigal_user -p trigal_crm`
4. **Verificar puertos**: `netstat -tlnp | grep :3000`

### Panel DigitalOcean:
https://cloud.digitalocean.com/

### Monitoreo:
- **Servidor**: `ssh root@TU_IP && htop`
- **Aplicación**: `pm2 monit`
- **Base de datos**: `mysql -u trigal_user -p`

---

## 🎉 PRÓXIMOS PASOS

Una vez funcionando:

1. **✅ Cambiar contraseñas** por defecto
2. **✅ Crear usuarios** para tu equipo de ventas
3. **✅ Cargar productos** reales
4. **✅ Configurar dominio** propio
5. **✅ Entrenar** al equipo en el sistema

---

**¡Todo listo para que tengas tu CRM funcionando en 30 minutos!** 🚀

¿Necesitas ayuda con algún paso específico?
