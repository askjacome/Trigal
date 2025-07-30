
// EJECUCIÓN INMEDIATA - Copiar y pegar en la consola del navegador

// 1. Limpieza total inmediata
(function() {
    console.log('🚨 LIMPIEZA TOTAL INMEDIATA EJECUTÁNDOSE...');
    
    // Sobrescribir mostrarSugerenciasProductos AHORA
    window.mostrarSugerenciasProductos = function(searchTerm) {
        console.log('🌽 NUEVO: Mostrando solo productos de maíz');
        const suggestions = document.getElementById('productoSuggestions');
        if (suggestions) {
            suggestions.innerHTML = `
                <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('MAIZ-001')">
                    <div>
                        <strong>Maíz Cacahuazintle para Pozole</strong>
                        <div style="font-size: 0.875rem; color: #666;">
                            Maíz y Derivados | €45.00 | Stock: 120
                        </div>
                    </div>
                </div>
                <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('TOST-001')">
                    <div>
                        <strong>Tostadas de Maíz Natural</strong>
                        <div style="font-size: 0.875rem; color: #666;">
                            Tostadas | €12.50 | Stock: 65
                        </div>
                    </div>
                </div>
                <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('MAIZ-002')">
                    <div>
                        <strong>Maíz Blanco para Pozole</strong>
                        <div style="font-size: 0.875rem; color: #666;">
                            Maíz y Derivados | €38.00 | Stock: 95
                        </div>
                    </div>
                </div>
            `;
            suggestions.style.display = 'block';
        }
    };
    
    // Eliminar cualquier tabla con productos de cómputo
    const tablas = document.querySelectorAll('table, tbody, tr');
    tablas.forEach(tabla => {
        if (tabla.textContent && tabla.textContent.includes('Laptop Ultraligera X200')) {
            console.log('🗑️ Eliminando tabla con Laptop Ultraligera X200');
            tabla.remove();
        }
    });
    
    // Función para seleccionar productos de maíz
    window.seleccionarProductoMaiz = function(productoId) {
        const productos = {
            'MAIZ-001': { nombre: 'Maíz Cacahuazintle para Pozole', precio: 45.00 },
            'TOST-001': { nombre: 'Tostadas de Maíz Natural', precio: 12.50 },
            'MAIZ-002': { nombre: 'Maíz Blanco para Pozole', precio: 38.00 }
        };
        const producto = productos[productoId];
        if (producto) {
            document.getElementById('productoPedido').value = producto.nombre;
            document.getElementById('productoSuggestions').style.display = 'none';
        }
    };
    
    // Ejecutar limpieza cada segundo
    setInterval(() => {
        mostrarSugerenciasProductos('');
        
        // Limpiar cualquier elemento con Laptop
        const elementosConLaptop = document.querySelectorAll('*');
        elementosConLaptop.forEach(el => {
            if (el.textContent && el.textContent.includes('Laptop Ultraligera X200') && 
                (el.tagName === 'TR' || el.tagName === 'TD' || el.classList.contains('producto'))) {
                el.remove();
            }
        });
    }, 1000);
    
    console.log('✅ LIMPIEZA TOTAL COMPLETADA');
    console.log('🌽 Solo productos de maíz y tostadas deberían aparecer');
})();

