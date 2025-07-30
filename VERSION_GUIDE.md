# 🌽 CRM Trigal - Guía de Versiones

## 📋 Resumen del Proyecto

**CRM Trigal** es un sistema completo de gestión de relaciones con clientes especializado en productos de maíz y derivados. El sistema incluye gestión de clientes, productos, ventas, pedidos, y cuentas por cobrar.

---

## 🏷️ Versiones Disponibles

### 📦 **v1.0.0 - Versión Base** (Rama: `main` antes del commit `fbbb687`)
**Estado**: Versión original funcional
**Ubicación**: Commit anterior en rama `main`

#### Características:
- ✅ CRM básico funcional
- ✅ Gestión básica de clientes
- ✅ Estructura inicial de productos
- ✅ Formularios básicos
- ✅ Navegación entre módulos

#### Para usar esta versión:
```bash
git checkout HEAD~1  # Ir al commit anterior
# O crear una rama específica:
git checkout -b version-basica HEAD~1
```

---

### 🚀 **v2.0.0-avanzado - Versión Avanzada** (Rama: `main` actual + `desarrollo-avanzado`)
**Estado**: Versión completa con funcionalidades avanzadas
**Ubicación**: Tag `v2.0.0-avanzado`, rama `main` actual

#### 🌟 Nuevas Funcionalidades:
- 🌽 **Catálogo especializado** de productos de maíz y tostadas
- 🛒 **Sistema de pedidos desde clientes** (icono carrito)
- 📝 **Formulario completo** de nuevo producto
- 🔍 **Sugerencias inteligentes** de productos en pedidos
- 🚨 **Sistema de emergencia** para limpieza automática
- 🔧 **Auto-reparación** de funcionalidades
- ⌨️ **Atajos de teclado** para funciones avanzadas

#### 📊 Productos Implementados:
1. **Maíz Cacahuazintle para Pozole** - €45.00
2. **Tostadas de Maíz Natural** - €12.50
3. **Maíz Blanco para Pozole** - €38.00
4. **Tostadas de Maíz Azul** - €15.00
5. **Harina de Maíz** - €95.00

#### 🔧 Funcionalidades Técnicas:
- **Función de emergencia**: `emergenciaProductosMaiz()`
- **Diagnóstico automático**: `probarNuevoProducto()`
- **Reparación de botones**: `forzarBotonNuevoProducto()`
- **Limpieza automática**: Cada 2 segundos
- **Múltiples respaldos**: Sistema robusto

#### ⌨️ Atajos de Teclado:
- `Ctrl+Shift+M`: Emergencia productos de maíz
- `Ctrl+Shift+P`: Arreglar botón Nuevo Producto

#### Para usar esta versión:
```bash
git checkout main           # Versión actual
# O usar la rama de desarrollo:
git checkout desarrollo-avanzado
```

---

## 🔀 Cambiar Entre Versiones

### ➡️ Ir a Versión Básica (v1.0.0):
```bash
git checkout HEAD~1
# Crear rama permanente:
git checkout -b version-basica HEAD~1
```

### ➡️ Ir a Versión Avanzada (v2.0.0):
```bash
git checkout main
# O rama de desarrollo:
git checkout desarrollo-avanzado
```

### ➡️ Ver todas las versiones disponibles:
```bash
git tag                    # Ver tags
git branch -a             # Ver ramas
git log --oneline         # Ver historial
```

---

## 📁 Estructura de Ramas

```
main (v2.0.0-avanzado)
├── HEAD~1 (v1.0.0-basico)
└── desarrollo-avanzado (copia de v2.0.0)
```

---

## 🛠️ Comandos de Ayuda

### Consola del Navegador (Versión Avanzada):
```javascript
ayuda()                    // Ver todos los comandos
arreglarNuevoProducto()    // Arreglar botón productos
emergenciaProductosMaiz()  // Forzar productos de maíz
```

---

## 📝 Recomendaciones

### 🎯 **Para Desarrollo Continuo**:
Usa la rama `desarrollo-avanzado` o `main` para continuar agregando funcionalidades.

### 🔄 **Para Regresar a lo Básico**:
Crea una rama desde `HEAD~1` si necesitas partir desde la versión básica.

### 💾 **Para Respaldos**:
Siempre crea un tag antes de cambios mayores:
```bash
git tag -a v2.1.0 -m "Nueva funcionalidad X"
```

---

## 📞 Soporte

Si encuentras problemas:
1. **Versión Avanzada**: Usa los comandos de diagnóstico automático
2. **Cualquier versión**: Revisa la consola del navegador (F12)
3. **Git**: Usa `git status` y `git log` para orientarte

---

**Última actualización**: Enero 2025
**Desarrollado por**: Enrique Jacome
**Especialización**: Productos de maíz y derivados 🌽 