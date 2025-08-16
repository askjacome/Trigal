// ===== FUNCIONES FINALES TRIGAL CRM MVP =====
// Funciones complementarias y de finalización

// Agregar funciones finales a la clase TrigalCRM
Object.assign(TrigalCRM.prototype, {

    // ===== FUNCIONES DE PEDIDOS =====

    async showPedidoForm(clienteId = null) {
        try {
            // Obtener datos necesarios
            const [clientesData, productosData] = await Promise.all([
                this.apiCall('/clientes'),
                this.apiCall('/productos')
            ]);

            const cliente = clienteId ? clientesData.data.find(c => c.id === clienteId) : null;

            this.showModal(
                'Nuevo Pedido',
                `
                <form id="pedidoForm">
                    <div class="grid grid-cols-2" style="gap: var(--space-4); margin-bottom: var(--space-6);">
                        <div class="form-group">
                            <label class="form-label">Cliente *</label>
                            <select id="pedidoCliente" class="form-select" required ${clienteId ? 'disabled' : ''}>
                                <option value="">Seleccionar cliente</option>
                                ${clientesData.data.map(c => `
                                    <option value="${c.id}" ${c.id === clienteId ? 'selected' : ''}>
                                        ${c.nombre} - ${c.contacto}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Observaciones</label>
                            <input type="text" id="pedidoObservaciones" class="form-input" 
                                   placeholder="Notas especiales del pedido">
                        </div>
                    </div>

                    <h4 style="margin-bottom: var(--space-4); color: var(--gray-800); border-bottom: 2px solid var(--gray-200); padding-bottom: var(--space-2);">
                        <i class="fas fa-shopping-cart"></i>
                        Productos del Pedido
                    </h4>

                    <div style="margin-bottom: var(--space-4);">
                        <div style="display: flex; gap: var(--space-3); align-items: end;">
                            <div class="form-group" style="flex: 2;">
                                <label class="form-label">Producto</label>
                                <select id="nuevoProducto" class="form-select">
                                    <option value="">Seleccionar producto</option>
                                    ${productosData.data.filter(p => p.activo).map(p => `
                                        <option value="${p.id}" data-precio="${p.precio_venta}" data-stock="${p.stock}">
                                            ${p.nombre} - $${p.precio_venta.toLocaleString('es-MX')} (Stock: ${p.stock} ${p.unidad})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Cantidad</label>
                                <input type="number" id="nuevaCantidad" class="form-input" min="1" placeholder="1" style="width: 100px;">
                            </div>
                            <button type="button" class="btn btn-primary" onclick="trigalCRM.addItemPedido()" style="height: fit-content;">
                                <i class="fas fa-plus"></i>
                                Agregar
                            </button>
                        </div>
                    </div>

                    <div class="table-container" style="margin-bottom: var(--space-4);">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Subtotal</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="pedidoItems">
                                <tr id="noItemsRow">
                                    <td colspan="5" style="text-align: center; color: var(--gray-500); padding: var(--space-6);">
                                        <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: var(--space-2); display: block;"></i>
                                        No hay productos en el pedido
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="background: var(--gray-50); padding: var(--space-4); border-radius: var(--radius-lg); border: 1px solid var(--gray-200);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                            <span>Subtotal:</span>
                            <span id="pedidoSubtotal" style="font-weight: 600;">$0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                            <span>IVA (16%):</span>
                            <span id="pedidoIva" style="font-weight: 600;">$0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-top: 2px solid var(--gray-300); padding-top: var(--space-2);">
                            <span style="font-size: 1.125rem; font-weight: 700;">Total:</span>
                            <span id="pedidoTotal" style="font-size: 1.125rem; font-weight: 700; color: var(--primary);">$0.00</span>
                        </div>
                    </div>
                </form>
                `,
                `
                <button type="button" class="btn btn-secondary" onclick="trigalCRM.closeModal()">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="trigalCRM.savePedido()" id="savePedidoBtn" disabled>
                    <i class="fas fa-save"></i>
                    Crear Pedido
                </button>
                `
            );

            // Inicializar array de items
            this.pedidoItems = [];

        } catch (error) {
            console.error('Error mostrando formulario de pedido:', error);
            this.showToast('Error al cargar formulario', 'error');
        }
    },

    addItemPedido() {
        const productoSelect = document.getElementById('nuevoProducto');
        const cantidadInput = document.getElementById('nuevaCantidad');

        const productoId = parseInt(productoSelect.value);
        const cantidad = parseInt(cantidadInput.value);

        if (!productoId || !cantidad || cantidad <= 0) {
            this.showToast('Selecciona un producto y cantidad válida', 'warning');
            return;
        }

        const option = productoSelect.selectedOptions[0];
        const precio = parseFloat(option.dataset.precio);
        const stock = parseInt(option.dataset.stock);
        const nombreProducto = option.textContent.split(' - ')[0];

        if (cantidad > stock) {
            this.showToast(`Stock insuficiente. Disponible: ${stock}`, 'error');
            return;
        }

        // Verificar si el producto ya está en el pedido
        const itemExistente = this.pedidoItems.find(item => item.producto_id === productoId);
        if (itemExistente) {
            this.showToast('El producto ya está en el pedido', 'warning');
            return;
        }

        const subtotal = cantidad * precio;

        // Agregar item
        this.pedidoItems.push({
            producto_id: productoId,
            nombre: nombreProducto,
            cantidad: cantidad,
            precio_unitario: precio,
            subtotal: subtotal
        });

        // Actualizar tabla
        this.updatePedidoTable();

        // Limpiar campos
        productoSelect.value = '';
        cantidadInput.value = '';
    },

    removeItemPedido(index) {
        this.pedidoItems.splice(index, 1);
        this.updatePedidoTable();
    },

    updatePedidoTable() {
        const tbody = document.getElementById('pedidoItems');
        const noItemsRow = document.getElementById('noItemsRow');

        if (this.pedidoItems.length === 0) {
            noItemsRow.style.display = 'table-row';
            document.getElementById('savePedidoBtn').disabled = true;
        } else {
            noItemsRow.style.display = 'none';
            document.getElementById('savePedidoBtn').disabled = false;
        }

        // Limpiar filas existentes (excepto la de "no items")
        Array.from(tbody.children).forEach(row => {
            if (row.id !== 'noItemsRow') {
                row.remove();
            }
        });

        // Agregar filas de items
        this.pedidoItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio_unitario.toLocaleString('es-MX')}</td>
                <td style="font-weight: 600;">$${item.subtotal.toLocaleString('es-MX')}</td>
                <td>
                    <button class="btn btn-sm btn-error" onclick="trigalCRM.removeItemPedido(${index})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.insertBefore(row, noItemsRow);
        });

        // Calcular totales
        this.calculatePedidoTotals();
    },

    calculatePedidoTotals() {
        const subtotal = this.pedidoItems.reduce((sum, item) => sum + item.subtotal, 0);
        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        document.getElementById('pedidoSubtotal').textContent = `$${subtotal.toLocaleString('es-MX')}`;
        document.getElementById('pedidoIva').textContent = `$${iva.toLocaleString('es-MX')}`;
        document.getElementById('pedidoTotal').textContent = `$${total.toLocaleString('es-MX')}`;
    },

    async savePedido() {
        const clienteId = parseInt(document.getElementById('pedidoCliente').value);
        const observaciones = document.getElementById('pedidoObservaciones').value.trim();

        if (!clienteId) {
            this.showToast('Selecciona un cliente', 'error');
            return;
        }

        if (this.pedidoItems.length === 0) {
            this.showToast('Agrega al menos un producto', 'error');
            return;
        }

        const subtotal = this.pedidoItems.reduce((sum, item) => sum + item.subtotal, 0);
        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        const pedidoData = {
            cliente_id: clienteId,
            observaciones: observaciones,
            subtotal: subtotal,
            iva: iva,
            total: total,
            items: this.pedidoItems
        };

        try {
            await this.apiCall('/pedidos', {
                method: 'POST',
                body: JSON.stringify(pedidoData)
            });

            this.showToast('Pedido creado exitosamente', 'success');
            this.closeModal();
            this.loadPedidos(); // Recargar lista si estamos en pedidos
            
        } catch (error) {
            console.error('Error guardando pedido:', error);
            this.showToast('Error al guardar pedido: ' + error.message, 'error');
        }
    },

    createPedidoFromCliente(clienteId) {
        this.showPedidoForm(clienteId);
    },

    // ===== FUNCIONES DE PROMOCIONES =====

    async loadPromociones() {
        try {
            const promociones = await this.apiCall('/promociones');
            
            document.getElementById('contentArea').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
                    <div>
                        <h2 style="margin: 0; margin-bottom: var(--space-1);">Promociones y Descuentos</h2>
                        <p style="color: var(--gray-600); margin: 0;">Total: ${promociones.data.length} promociones activas</p>
                    </div>
                    ${this.user?.rol === 'admin' || this.user?.rol === 'gerente_ventas' ? `
                        <button class="btn btn-primary" onclick="trigalCRM.showPromocionForm()">
                            <i class="fas fa-plus"></i>
                            Nueva Promoción
                        </button>
                    ` : ''}
                </div>

                <div class="grid grid-cols-3">
                    ${promociones.data.map(promocion => {
                        const fechaInicio = new Date(promocion.fecha_inicio);
                        const fechaFin = new Date(promocion.fecha_fin);
                        const ahora = new Date();
                        const vigente = ahora >= fechaInicio && ahora <= fechaFin;
                        const diasRestantes = Math.ceil((fechaFin - ahora) / (1000 * 60 * 60 * 24));

                        return `
                            <div class="card ${vigente ? 'hover-lift' : ''}" style="${!vigente ? 'opacity: 0.7;' : ''}">
                                <div class="card-body">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-4);">
                                        <div>
                                            <h3 style="margin: 0; font-size: 1.125rem; color: var(--gray-900);">${promocion.nombre}</h3>
                                        </div>
                                        <span class="badge ${vigente ? 'badge-success' : 'badge-error'}">
                                            ${vigente ? 'Vigente' : 'Expirada'}
                                        </span>
                                    </div>
                                    
                                    <p style="color: var(--gray-600); margin-bottom: var(--space-4); font-size: 0.875rem;">
                                        ${promocion.descripcion}
                                    </p>
                                    
                                    <div style="text-align: center; margin-bottom: var(--space-4);">
                                        <div style="font-size: 3rem; font-weight: 700; color: var(--primary);">
                                            ${promocion.valor}${promocion.tipo === 'porcentaje' ? '%' : '$'}
                                        </div>
                                        <div style="color: var(--gray-600); font-size: 0.875rem;">
                                            ${promocion.tipo === 'porcentaje' ? 'Descuento' : 'Descuento fijo'}
                                        </div>
                                    </div>
                                    
                                    <div style="margin-bottom: var(--space-4);">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                                            <span style="color: var(--gray-600);">Válida desde:</span>
                                            <span style="font-weight: 500;">${fechaInicio.toLocaleDateString('es-MX')}</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                                            <span style="color: var(--gray-600);">Válida hasta:</span>
                                            <span style="font-weight: 500;">${fechaFin.toLocaleDateString('es-MX')}</span>
                                        </div>
                                        ${vigente && diasRestantes > 0 ? `
                                            <div style="display: flex; justify-content: space-between;">
                                                <span style="color: var(--gray-600);">Días restantes:</span>
                                                <span style="color: ${diasRestantes <= 7 ? 'var(--error)' : 'var(--success)'}; font-weight: 600;">
                                                    ${diasRestantes} días
                                                </span>
                                            </div>
                                        ` : ''}
                                    </div>
                                    
                                    <div style="display: flex; gap: var(--space-2);">
                                        <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showPromocionDetail(${promocion.id})" style="flex: 1;">
                                            <i class="fas fa-eye"></i>
                                            Ver Detalle
                                        </button>
                                        ${this.user?.rol === 'admin' || this.user?.rol === 'gerente_ventas' ? `
                                            <button class="btn btn-sm btn-primary" onclick="trigalCRM.showPromocionForm(${promocion.id})">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                        ` : ''}
                                    </div>
                                    
                                    ${!vigente ? `
                                        <div style="background: var(--error); color: white; padding: var(--space-2); border-radius: var(--radius-md); margin-top: var(--space-3); text-align: center; font-size: 0.875rem;">
                                            <i class="fas fa-clock"></i>
                                            Promoción expirada
                                        </div>
                                    ` : diasRestantes <= 7 ? `
                                        <div style="background: var(--warning); color: white; padding: var(--space-2); border-radius: var(--radius-md); margin-top: var(--space-3); text-align: center; font-size: 0.875rem;">
                                            <i class="fas fa-exclamation-triangle"></i>
                                            Expira pronto
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

        } catch (error) {
            console.error('Error cargando promociones:', error);
            throw error;
        }
    },

    // ===== FUNCIONES DE VISITAS =====

    async loadVisitas() {
        try {
            const visitas = await this.apiCall('/visitas');
            
            document.getElementById('contentArea').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
                    <div>
                        <h2 style="margin: 0; margin-bottom: var(--space-1);">Registro de Visitas</h2>
                        <p style="color: var(--gray-600); margin: 0;">Control de visitas a clientes</p>
                    </div>
                    <button class="btn btn-primary" onclick="trigalCRM.showRegistrarVisitaForm()">
                        <i class="fas fa-map-marker-alt"></i>
                        Registrar Visita
                    </button>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-route"></i>
                            Historial de Visitas
                        </h3>
                    </div>
                    <div class="card-body">
                        <div style="text-align: center; color: var(--gray-500); padding: var(--space-8);">
                            <i class="fas fa-map-signs" style="font-size: 3rem; margin-bottom: var(--space-4); display: block;"></i>
                            <h3>Funcionalidad en Desarrollo</h3>
                            <p>El registro completo de visitas estará disponible próximamente.</p>
                            <p style="font-size: 0.875rem;">Por ahora puedes registrar visitas desde la sección de clientes.</p>
                        </div>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error cargando visitas:', error);
            throw error;
        }
    },

    async registrarVisita(clienteId) {
        if (!navigator.geolocation) {
            this.showToast('Geolocalización no disponible', 'error');
            return;
        }

        this.showToast('Registrando visita...', 'info');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const visitaData = {
                        cliente_id: clienteId,
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                        observaciones: '',
                        estado: 'completada'
                    };

                    await this.apiCall('/visitas', {
                        method: 'POST',
                        body: JSON.stringify(visitaData)
                    });

                    this.showToast('Visita registrada exitosamente', 'success');
                } catch (error) {
                    console.error('Error registrando visita:', error);
                    this.showToast('Error al registrar visita', 'error');
                }
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                this.showToast('Error obteniendo ubicación', 'error');
            }
        );
    },

    // ===== FUNCIONES AUXILIARES =====

    showClienteDetail(clienteId) {
        this.showToast('Función de detalle en desarrollo', 'info');
    },

    showClientesMap() {
        this.showToast('Mapa de clientes en desarrollo', 'info');
    },

    showPedidoDetail(pedidoId) {
        this.showToast('Detalle de pedido en desarrollo', 'info');
    },

    async updatePedidoStatus(pedidoId, nuevoEstado) {
        try {
            // En un entorno real, harías una llamada API
            this.showToast(`Pedido actualizado a: ${nuevoEstado}`, 'success');
            this.loadPedidos(); // Recargar lista
        } catch (error) {
            this.showToast('Error actualizando pedido', 'error');
        }
    },

    addToQuickOrder(productoId) {
        this.showToast('Producto agregado a orden rápida', 'success');
    },

    showVendedorStats(vendedorId) {
        this.showToast('Estadísticas de vendedor en desarrollo', 'info');
    },

    showVendedorForm(vendedorId = null) {
        // Reutilizar el formulario de usuario con rol vendedor
        this.showUsuarioForm(vendedorId);
    },

    showUsuarioDetail(usuarioId) {
        this.showToast('Perfil de usuario en desarrollo', 'info');
    },

    async toggleUsuarioStatus(usuarioId) {
        try {
            // En un entorno real, harías una llamada API
            this.showToast('Estado de usuario actualizado', 'success');
            this.loadUsuarios(); // Recargar lista
        } catch (error) {
            this.showToast('Error actualizando usuario', 'error');
        }
    },

    async resetUsuarioPassword(usuarioId) {
        if (confirm('¿Estás seguro de resetear la contraseña de este usuario?')) {
            try {
                // En un entorno real, harías una llamada API
                this.showToast('Contraseña reseteada. Nueva contraseña: password123', 'success');
            } catch (error) {
                this.showToast('Error reseteando contraseña', 'error');
            }
        }
    },

    showPromocionForm(promocionId = null) {
        this.showToast('Formulario de promoción en desarrollo', 'info');
    },

    showPromocionDetail(promocionId) {
        this.showToast('Detalle de promoción en desarrollo', 'info');
    },

    showRegistrarVisitaForm() {
        this.showToast('Formulario de visita en desarrollo', 'info');
    }
});

console.log('🌽 Funciones finales del CRM Trigal cargadas correctamente');
