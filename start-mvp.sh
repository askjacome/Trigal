#!/bin/bash

# Script de inicio para Trigal CRM MVP
# Fecha: 18 de agosto de 2025

echo "🌽 ================================="
echo "🌽 TRIGAL CRM MVP - INICIANDO"
echo "🌽 ================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "📥 Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    echo "📥 Instala npm desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js versión: $(node --version)"
echo "✅ npm versión: $(npm --version)"
echo ""

# Verificar si package.json existe, si no, usar el MVP
if [ ! -f "package.json" ]; then
    echo "📦 Copiando package.json del MVP..."
    cp mvp-package.json package.json
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

echo ""
echo "✅ Dependencias instaladas correctamente"
echo ""

# Verificar archivos principales
FILES=("mvp-server.js" "mvp-index.html" "mvp-styles.css" "mvp-script.js")

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Archivo faltante: $file"
        exit 1
    fi
done

echo "✅ Todos los archivos principales están presentes"
echo ""

# Mostrar información del sistema
echo "📊 INFORMACIÓN DEL SISTEMA:"
echo "  • OS: $(uname -s)"
echo "  • Arquitectura: $(uname -m)"
echo "  • Fecha: $(date '+%d/%m/%Y %H:%M:%S')"
echo "  • Directorio: $(pwd)"
echo ""

# Mostrar usuarios de prueba
echo "👥 USUARIOS DE PRUEBA:"
echo "  • Admin:     admin / password"
echo "  • Gerente:   gerente.ventas / password"  
echo "  • Vendedor:  vendedor1 / password"
echo ""

# Configurar variables de entorno si no existen
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo de configuración..."
    cat > .env << EOF
# Trigal CRM MVP - Configuración
NODE_ENV=development
PORT=3000
JWT_SECRET=trigal_crm_secret_2025_mvp
EOF
    echo "✅ Archivo .env creado"
fi

echo "🚀 INICIANDO SERVIDOR..."
echo "📱 Accede desde:"
echo "  • Computadora: http://localhost:3000"
echo "  • Móvil (misma red): http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "⏹️  Para detener: Ctrl + C"
echo "🔄 Para reiniciar: npm start"
echo ""
echo "🌽 ¡Trigal CRM MVP listo para vender maíz!"
echo "================================="
echo ""

# Iniciar el servidor
npm start
