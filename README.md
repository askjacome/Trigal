# Trigal CRM - Sistema de Gestión de Clientes

Una maqueta inicial de frontend para un sistema CRM moderno y responsivo, diseñado para equipos de ventas con funcionalidades completas de gestión de clientes, ventas, productos e informes.

## 🚀 Características Principales

### 📊 Dashboard Interactivo
- **KPIs en tiempo real**: Ventas totales, nuevos clientes, pedidos pendientes, productos más vendidos
- **Gráficos interactivos**: Tendencias de ventas y distribución de clientes
- **Vista responsiva**: Adaptación automática para escritorio y móvil
- **Períodos configurables**: Hoy, Semana, Mes

### 👥 Gestión de Clientes
- Lista completa de clientes con búsqueda y filtros
- Información detallada: empresa, contacto, región, estado
- Acciones rápidas: ver, editar, eliminar
- Interfaz optimizada para móvil

### 💰 Gestión de Ventas
- Resumen de ventas con métricas clave
- Lista de pedidos con estados
- Integración de pagos con Stripe y TPV Clip
- Modal de procesamiento de pagos

### 📦 Gestión de Productos
- Catálogo completo con niveles de stock
- Indicadores visuales de inventario
- Información detallada de productos
- Gestión de categorías y precios

### 📈 Sistema de Informes
- **9 tipos de informes**:
  - Informes de Clientes
  - Informes de Productos
  - Historial de Pedidos
  - Ventas por Región Geográfica
  - Ventas por Vendedor
  - Ventas Totales
  - Informes de Inventario
  - Estado de Entrega
  - Estado de Pedido
- Filtros avanzados: rango de fechas, vendedor, región

### 👨‍💼 Gestión de Equipo
- Perfiles de vendedores con métricas
- Indicadores de rendimiento individual
- Estados online/offline
- Gestión de roles y permisos

## 🎨 Diseño y UX

### Paleta de Colores Profesional
- **Primario**: #4f46e5 (Indigo)
- **Secundario**: #10b981 (Emerald)
- **Acento**: #f59e0b (Amber)
- **Éxito**: #10b981 (Green)
- **Advertencia**: #f59e0b (Yellow)
- **Error**: #ef4444 (Red)

### Características de Diseño
- **UI moderna y limpia** con sombras sutiles
- **Tipografía optimizada** para legibilidad
- **Iconografía consistente** con Font Awesome
- **Animaciones suaves** para mejor UX
- **Estados hover** y feedback visual

### Responsive Design
- **Desktop**: Navegación horizontal completa
- **Tablet**: Adaptación de layouts y menús
- **Mobile**: Menú hamburguesa y acciones rápidas
- **Touch-friendly**: Botones optimizados para pantallas táctiles

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **JavaScript ES6+**: Funcionalidad interactiva
- **Chart.js**: Gráficos interactivos
- **Font Awesome**: Iconografía
- **Responsive Design**: Mobile-first approach

## 📱 Funcionalidades Móviles

### Navegación Adaptativa
- Menú hamburguesa para pantallas pequeñas
- Navegación por secciones optimizada
- Acciones rápidas en dashboard móvil

### Tablas Responsivas
- Scroll horizontal en dispositivos móviles
- Información condensada para pantallas pequeñas
- Botones de acción optimizados para touch

### Formularios Touch-Friendly
- Campos de entrada con tamaño mínimo de 44px
- Botones con área de toque ampliada
- Feedback visual mejorado

## 💳 Integración de Pagos

### Modal de Pago
- Resumen detallado del pedido
- Cálculo automático de impuestos
- Opciones de pago:
  - **Stripe**: Integración con pasarela de pagos
  - **TPV Clip**: Escaneo de pagos móviles

### Procesamiento
- Simulación de procesamiento de pagos
- Estados de carga y confirmación
- Manejo de errores y éxito

## 📊 KPIs y Métricas

### Dashboard Principal
- **Ventas Totales**: Configurable por período
- **Nuevos Clientes**: Tasa de crecimiento
- **Pedidos Pendientes**: Alertas de atención
- **Productos Más Vendidos**: Análisis de rendimiento

### Gráficos Interactivos
- **Línea de Tiempo**: Tendencias de ventas mensuales
- **Dona**: Distribución de tipos de clientes
- **Responsive**: Adaptación automática a diferentes pantallas

## 🔍 Búsqueda y Filtros

### Funcionalidades de Búsqueda
- Búsqueda en tiempo real
- Filtrado por múltiples criterios
- Resultados instantáneos

### Filtros Avanzados
- Por estado de cliente
- Por región geográfica
- Por vendedor asignado
- Por rango de fechas

## 📋 Estructura de Archivos

```
Trigal/
├── index.html          # Página principal del CRM
├── styles.css          # Estilos CSS responsivos
├── script.js           # Funcionalidad JavaScript
└── README.md           # Documentación del proyecto
```

## 🚀 Instalación y Uso

1. **Clonar o descargar** los archivos del proyecto
2. **Abrir `index.html`** en un navegador web moderno
3. **Explorar las diferentes secciones** usando la navegación
4. **Probar la responsividad** redimensionando la ventana

### Requisitos del Navegador
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 Funcionalidades Destacadas

### Integración de Pagos
- Modal completo de procesamiento
- Opciones múltiples de pago
- Simulación realista de transacciones

### Sistema de Informes
- 9 tipos diferentes de informes
- Filtros avanzados configurables
- Exportación y visualización

### Gestión de Inventario
- Indicadores visuales de stock
- Alertas de niveles bajos
- Seguimiento de productos

### Responsive Design
- Adaptación automática a cualquier dispositivo
- Optimización para touch en móviles
- Navegación intuitiva en todas las pantallas

## 🔧 Personalización

### Variables CSS
El sistema utiliza variables CSS para fácil personalización:
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... más variables */
}
```

### Configuración de Gráficos
Los gráficos se pueden personalizar modificando las opciones en `script.js`:
```javascript
// Configuración de gráfico de ventas
salesChart = new Chart(ctx, {
    // Opciones personalizables
});
```

## 📈 Próximas Mejoras

- [ ] Integración con APIs reales
- [ ] Sistema de autenticación
- [ ] Base de datos persistente
- [ ] Notificaciones en tiempo real
- [ ] Exportación de informes a PDF
- [ ] Integración con calendario
- [ ] Sistema de chat interno
- [ ] Dashboard personalizable

## 🤝 Contribución

Este es un proyecto de maqueta inicial. Para contribuir:

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para equipos de ventas modernos**
