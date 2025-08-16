// ===== EXTENSIÓN DE FUNCIONALIDADES TRIGAL CRM MVP =====
// Este archivo extiende las funcionalidades del script principal

// Agregar métodos adicionales a la clase TrigalCRM
Object.assign(TrigalCRM.prototype, {

    // ===== FORMULARIO DE CLIENTE =====
    
    async showClienteForm(clienteId = null) {
        let vendedores = [];
        
        // Solo admin y gerente pueden ver todos los vendedores
        if (this.user?.rol === 'admin' || this.user?.rol === 'gerente_ventas') {
            const vendedoresData = await this.apiCall('/usuarios');
            vendedores = vendedoresData.data.filter(u => u.rol === 'vendedor' && u.activo);
        }

        const isEdit = clienteId !== null;
        let cliente = null;

        if (isEdit) {
            const clientesData = await this.apiCall('/clientes');
            cliente = clientesData.data.find(c => c.id === clienteId);
        }

        this.showModal(
            isEdit ? 'Editar Cliente' : 'Nuevo Cliente',
            `
            <form id="clienteForm">
                <div class="grid grid-cols-2" style="gap: var(--space-4);">
                    <div class="form-group">
                        <label class="form-label">Nombre del Cliente *</label>
                        <input type="text" id="clienteNombre" class="form-input" required 
                               value="${cliente?.nombre || ''}" placeholder="Ej: Tortillería La Esperanza">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Persona de Contacto *</label>
                        <input type="text" id="clienteContacto" class="form-input" required 
                               value="${cliente?.contacto || ''}" placeholder="Ej: Juan Pérez">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="clienteEmail" class="form-input" 
                               value="${cliente?.email || ''}" placeholder="contacto@empresa.com">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Teléfono *</label>
                        <input type="tel" id="clienteTelefono" class="form-input" required 
                               value="${cliente?.telefono || ''}" placeholder="+52 55 1234 5678">
                    </div>
                    
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label class="form-label">Dirección *</label>
                        <input type="text" id="clienteDireccion" class="form-input" required 
                               value="${cliente?.direccion || ''}" placeholder="Calle, número, colonia">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Ciudad *</label>
                        <input type="text" id="clienteCiudad" class="form-input" required 
                               value="${cliente?.ciudad || ''}" placeholder="Ciudad de México">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Estado *</label>
                        <select id="clienteEstado" class="form-select" required>
                            <option value="">Seleccionar estado</option>
                            <option value="CDMX" ${cliente?.estado === 'CDMX' ? 'selected' : ''}>Ciudad de México</option>
                            <option value="Jalisco" ${cliente?.estado === 'Jalisco' ? 'selected' : ''}>Jalisco</option>
                            <option value="Nuevo León" ${cliente?.estado === 'Nuevo León' ? 'selected' : ''}>Nuevo León</option>
                            <option value="Puebla" ${cliente?.estado === 'Puebla' ? 'selected' : ''}>Puebla</option>
                            <option value="Veracruz" ${cliente?.estado === 'Veracruz' ? 'selected' : ''}>Veracruz</option>
                            <option value="Guanajuato" ${cliente?.estado === 'Guanajuato' ? 'selected' : ''}>Guanajuato</option>
                            <option value="Estado de México" ${cliente?.estado === 'Estado de México' ? 'selected' : ''}>Estado de México</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Código Postal</label>
                        <input type="text" id="clienteCP" class="form-input" 
                               value="${cliente?.codigo_postal || ''}" placeholder="06000" maxlength="5">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tipo de Cliente</label>
                        <select id="clienteTipo" class="form-select">
                            <option value="regular" ${cliente?.tipo === 'regular' ? 'selected' : ''}>Regular</option>
                            <option value="mayorista" ${cliente?.tipo === 'mayorista' ? 'selected' : ''}>Mayorista</option>
                            <option value="distribuidor" ${cliente?.tipo === 'distribuidor' ? 'selected' : ''}>Distribuidor</option>
                        </select>
                    </div>
                    
                    ${vendedores.length > 0 ? `
                    <div class="form-group">
                        <label class="form-label">Vendedor Asignado</label>
                        <select id="clienteVendedor" class="form-select">
                            <option value="">Sin asignar</option>
                            ${vendedores.map(v => `
                                <option value="${v.id}" ${cliente?.vendedor_id === v.id ? 'selected' : ''}>
                                    ${v.nombre} ${v.apellido}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    ` : ''}
                    
                    <div class="form-group">
                        <label class="form-label">Límite de Crédito</label>
                        <input type="number" id="clienteCredito" class="form-input" min="0" step="0.01"
                               value="${cliente?.limite_credito || ''}" placeholder="50000.00">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Días de Crédito</label>
                        <input type="number" id="clienteDiasCredito" class="form-input" min="0" max="90"
                               value="${cliente?.dias_credito || ''}" placeholder="30">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-map-marker-alt"></i>
                        Ubicación en Mapa
                    </label>
                    <div style="margin-bottom: var(--space-3);">
                        <button type="button" class="btn btn-secondary" onclick="trigalCRM.getCurrentLocation()">
                            <i class="fas fa-crosshairs"></i>
                            Usar Ubicación Actual
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="trigalCRM.searchAddress()">
                            <i class="fas fa-search"></i>
                            Buscar Dirección
                        </button>
                    </div>
                    <div id="clienteMap" style="height: 300px; border-radius: var(--radius-lg); border: 1px solid var(--gray-300);"></div>
                    <div style="display: flex; gap: var(--space-3); margin-top: var(--space-2);">
                        <div class="form-group" style="flex: 1; margin: 0;">
                            <input type="number" id="clienteLatitud" class="form-input" step="any"
                                   value="${cliente?.latitud || ''}" placeholder="Latitud">
                        </div>
                        <div class="form-group" style="flex: 1; margin: 0;">
                            <input type="number" id="clienteLongitud" class="form-input" step="any"
                                   value="${cliente?.longitud || ''}" placeholder="Longitud">
                        </div>
                    </div>
                </div>
            </form>
            `,
            `
            <button type="button" class="btn btn-secondary" onclick="trigalCRM.closeModal()">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="trigalCRM.saveCliente(${clienteId})">
                <i class="fas fa-save"></i>
                ${isEdit ? 'Actualizar' : 'Guardar'} Cliente
            </button>
            `
        );

        // Inicializar mapa después de que el modal se muestre
        setTimeout(() => this.initClienteMap(cliente), 100);
    },

    async initClienteMap(cliente = null) {
        const mapContainer = document.getElementById('clienteMap');
        if (!mapContainer) return;

        const lat = cliente?.latitud || 19.4326;
        const lng = cliente?.longitud || -99.1332;

        this.clienteMap = L.map('clienteMap').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.clienteMap);

        this.clienteMarker = L.marker([lat, lng], { draggable: true }).addTo(this.clienteMap);

        this.clienteMarker.on('dragend', (e) => {
            const position = e.target.getLatLng();
            document.getElementById('clienteLatitud').value = position.lat.toFixed(6);
            document.getElementById('clienteLongitud').value = position.lng.toFixed(6);
        });

        this.clienteMap.on('click', (e) => {
            const position = e.latlng;
            this.clienteMarker.setLatLng(position);
            document.getElementById('clienteLatitud').value = position.lat.toFixed(6);
            document.getElementById('clienteLongitud').value = position.lng.toFixed(6);
        });

        // Actualizar inputs
        document.getElementById('clienteLatitud').value = lat;
        document.getElementById('clienteLongitud').value = lng;

        // Listener para cambios en inputs
        ['clienteLatitud', 'clienteLongitud'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                const lat = parseFloat(document.getElementById('clienteLatitud').value);
                const lng = parseFloat(document.getElementById('clienteLongitud').value);
                if (!isNaN(lat) && !isNaN(lng)) {
                    this.clienteMarker.setLatLng([lat, lng]);
                    this.clienteMap.setView([lat, lng]);
                }
            });
        });
    },

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showToast('Geolocalización no disponible', 'error');
            return;
        }

        this.showToast('Obteniendo ubicación...', 'info');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                this.clienteMarker.setLatLng([lat, lng]);
                this.clienteMap.setView([lat, lng], 16);
                
                document.getElementById('clienteLatitud').value = lat.toFixed(6);
                document.getElementById('clienteLongitud').value = lng.toFixed(6);
                
                this.showToast('Ubicación obtenida', 'success');
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                this.showToast('Error obteniendo ubicación', 'error');
            }
        );
    },

    async searchAddress() {
        const direccion = document.getElementById('clienteDireccion').value;
        const ciudad = document.getElementById('clienteCiudad').value;
        const estado = document.getElementById('clienteEstado').value;

        if (!direccion || !ciudad) {
            this.showToast('Ingresa dirección y ciudad para buscar', 'warning');
            return;
        }

        const fullAddress = `${direccion}, ${ciudad}, ${estado}, México`;
        
        try {
            this.showToast('Buscando dirección...', 'info');
            
            // Usando Nominatim de OpenStreetMap para geocodificación
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);

                this.clienteMarker.setLatLng([lat, lng]);
                this.clienteMap.setView([lat, lng], 16);
                
                document.getElementById('clienteLatitud').value = lat.toFixed(6);
                document.getElementById('clienteLongitud').value = lng.toFixed(6);
                
                this.showToast('Dirección encontrada', 'success');
            } else {
                this.showToast('Dirección no encontrada', 'warning');
            }
        } catch (error) {
            console.error('Error buscando dirección:', error);
            this.showToast('Error buscando dirección', 'error');
        }
    },

    async saveCliente(clienteId = null) {
        const formData = {
            nombre: document.getElementById('clienteNombre').value.trim(),
            contacto: document.getElementById('clienteContacto').value.trim(),
            email: document.getElementById('clienteEmail').value.trim(),
            telefono: document.getElementById('clienteTelefono').value.trim(),
            direccion: document.getElementById('clienteDireccion').value.trim(),
            ciudad: document.getElementById('clienteCiudad').value.trim(),
            estado: document.getElementById('clienteEstado').value,
            codigo_postal: document.getElementById('clienteCP').value.trim(),
            tipo: document.getElementById('clienteTipo').value,
            limite_credito: parseFloat(document.getElementById('clienteCredito').value) || 0,
            dias_credito: parseInt(document.getElementById('clienteDiasCredito').value) || 0,
            latitud: parseFloat(document.getElementById('clienteLatitud').value) || null,
            longitud: parseFloat(document.getElementById('clienteLongitud').value) || null
        };

        // Validaciones
        if (!formData.nombre || !formData.contacto || !formData.telefono || !formData.direccion || !formData.ciudad || !formData.estado) {
            this.showToast('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Vendedor asignado (solo si el usuario puede asignarlo)
        const vendedorSelect = document.getElementById('clienteVendedor');
        if (vendedorSelect) {
            formData.vendedor_id = parseInt(vendedorSelect.value) || this.user.id;
        }

        try {
            const endpoint = clienteId ? `/clientes/${clienteId}` : '/clientes';
            const method = clienteId ? 'PUT' : 'POST';

            await this.apiCall(endpoint, {
                method,
                body: JSON.stringify(formData)
            });

            this.showToast(
                clienteId ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente',
                'success'
            );
            
            this.closeModal();
            this.loadClientes(); // Recargar lista
            
        } catch (error) {
            console.error('Error guardando cliente:', error);
            this.showToast('Error al guardar cliente: ' + error.message, 'error');
        }
    },

    // ===== PEDIDOS =====

    async loadPedidos() {
        try {
            const pedidos = await this.apiCall('/pedidos');
            
            document.getElementById('contentArea').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
                    <div>
                        <h2 style="margin: 0; margin-bottom: var(--space-1);">Gestión de Pedidos</h2>
                        <p style="color: var(--gray-600); margin: 0;">Total: ${pedidos.data.length} pedidos</p>
                    </div>
                    <button class="btn btn-primary" onclick="trigalCRM.showPedidoForm()">
                        <i class="fas fa-plus"></i>
                        Nuevo Pedido
                    </button>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 class="card-title">
                                <i class="fas fa-shopping-cart"></i>
                                Lista de Pedidos
                            </h3>
                            <div style="display: flex; gap: var(--space-3);">
                                <select id="pedidosFilter" class="form-select" style="width: 150px;">
                                    <option value="">Todos los estados</option>
                                    <option value="pendiente">Pendientes</option>
                                    <option value="procesando">Procesando</option>
                                    <option value="enviado">Enviados</option>
                                    <option value="entregado">Entregados</option>
                                    <option value="cancelado">Cancelados</option>
                                </select>
                                <input type="text" id="pedidosSearch" class="form-input" placeholder="Buscar pedidos..." style="width: 250px;">
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Cliente</th>
                                        <th>Vendedor</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="pedidosTableBody">
                                    ${pedidos.data.map(pedido => `
                                        <tr>
                                            <td>
                                                <div style="font-weight: 600;">${pedido.numero}</div>
                                            </td>
                                            <td>
                                                <div style="font-weight: 500;">${pedido.cliente?.nombre || 'Cliente no encontrado'}</div>
                                                <div style="font-size: 0.875rem; color: var(--gray-600);">${pedido.cliente?.contacto || ''}</div>
                                            </td>
                                            <td>
                                                <div>${pedido.vendedor?.nombre || 'N/A'} ${pedido.vendedor?.apellido || ''}</div>
                                            </td>
                                            <td>
                                                <div>${new Date(pedido.fecha).toLocaleDateString('es-MX')}</div>
                                                <div style="font-size: 0.875rem; color: var(--gray-600);">${new Date(pedido.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td>
                                                <div style="font-weight: 600; color: var(--primary);">$${pedido.total.toLocaleString('es-MX')}</div>
                                                <div style="font-size: 0.875rem; color: var(--gray-600);">${pedido.items?.length || 0} items</div>
                                            </td>
                                            <td>
                                                <span class="badge ${this.getPedidoStatusClass(pedido.estado)}">
                                                    ${this.getPedidoStatusText(pedido.estado)}
                                                </span>
                                            </td>
                                            <td>
                                                <div style="display: flex; gap: var(--space-2);">
                                                    <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showPedidoDetail(${pedido.id})" title="Ver detalle">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn btn-sm btn-primary" onclick="trigalCRM.generatePDF(${pedido.id})" title="Generar PDF">
                                                        <i class="fas fa-file-pdf"></i>
                                                    </button>
                                                    <button class="btn btn-sm btn-success" onclick="trigalCRM.sendPedidoEmail(${pedido.id})" title="Enviar por email">
                                                        <i class="fas fa-envelope"></i>
                                                    </button>
                                                    ${pedido.estado === 'pendiente' ? `
                                                        <button class="btn btn-sm btn-warning" onclick="trigalCRM.updatePedidoStatus(${pedido.id}, 'procesando')" title="Procesar">
                                                            <i class="fas fa-play"></i>
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            // Filtros y búsqueda
            document.getElementById('pedidosFilter').addEventListener('change', (e) => {
                this.filterPedidos(pedidos.data);
            });

            document.getElementById('pedidosSearch').addEventListener('input', (e) => {
                this.filterPedidos(pedidos.data);
            });

        } catch (error) {
            console.error('Error cargando pedidos:', error);
            throw error;
        }
    },

    getPedidoStatusClass(estado) {
        const classes = {
            'pendiente': 'badge-warning',
            'procesando': 'badge-primary',
            'enviado': 'badge-info',
            'entregado': 'badge-success',
            'cancelado': 'badge-error'
        };
        return classes[estado] || 'badge-secondary';
    },

    getPedidoStatusText(estado) {
        const texts = {
            'pendiente': 'Pendiente',
            'procesando': 'Procesando',
            'enviado': 'Enviado',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado'
        };
        return texts[estado] || estado;
    },

    filterPedidos(pedidosData) {
        const statusFilter = document.getElementById('pedidosFilter').value;
        const searchTerm = document.getElementById('pedidosSearch').value.toLowerCase();
        
        const filteredPedidos = pedidosData.filter(pedido => {
            const matchesStatus = !statusFilter || pedido.estado === statusFilter;
            const matchesSearch = !searchTerm || 
                pedido.numero.toLowerCase().includes(searchTerm) ||
                pedido.cliente?.nombre.toLowerCase().includes(searchTerm) ||
                pedido.vendedor?.nombre.toLowerCase().includes(searchTerm);
            
            return matchesStatus && matchesSearch;
        });

        const tbody = document.getElementById('pedidosTableBody');
        tbody.innerHTML = filteredPedidos.map(pedido => `
            <tr>
                <td>
                    <div style="font-weight: 600;">${pedido.numero}</div>
                </td>
                <td>
                    <div style="font-weight: 500;">${pedido.cliente?.nombre || 'Cliente no encontrado'}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${pedido.cliente?.contacto || ''}</div>
                </td>
                <td>
                    <div>${pedido.vendedor?.nombre || 'N/A'} ${pedido.vendedor?.apellido || ''}</div>
                </td>
                <td>
                    <div>${new Date(pedido.fecha).toLocaleDateString('es-MX')}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${new Date(pedido.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td>
                    <div style="font-weight: 600; color: var(--primary);">$${pedido.total.toLocaleString('es-MX')}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${pedido.items?.length || 0} items</div>
                </td>
                <td>
                    <span class="badge ${this.getPedidoStatusClass(pedido.estado)}">
                        ${this.getPedidoStatusText(pedido.estado)}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: var(--space-2);">
                        <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showPedidoDetail(${pedido.id})" title="Ver detalle">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="trigalCRM.generatePDF(${pedido.id})" title="Generar PDF">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="trigalCRM.sendPedidoEmail(${pedido.id})" title="Enviar por email">
                            <i class="fas fa-envelope"></i>
                        </button>
                        ${pedido.estado === 'pendiente' ? `
                            <button class="btn btn-sm btn-warning" onclick="trigalCRM.updatePedidoStatus(${pedido.id}, 'procesando')" title="Procesar">
                                <i class="fas fa-play"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // ===== GENERAR PDF =====

    async generatePDF(pedidoId) {
        try {
            // Obtener datos del pedido
            const pedidosData = await this.apiCall('/pedidos');
            const pedido = pedidosData.data.find(p => p.id === pedidoId);
            
            if (!pedido) {
                this.showToast('Pedido no encontrado', 'error');
                return;
            }

            // Obtener productos para los detalles
            const productosData = await this.apiCall('/productos');
            
            // Crear nuevo documento PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Configurar fuente
            doc.setFont('helvetica');

            // Header de la empresa
            doc.setFontSize(20);
            doc.setTextColor(37, 99, 235); // Color primario
            doc.text('🌽 TRIGAL', 20, 25);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Sistema de Ventas Especializado', 20, 35);
            doc.text('Tel: +52 55 1234 5678 | Email: ventas@trigal.com', 20, 45);

            // Línea divisoria
            doc.setDrawColor(229, 231, 235);
            doc.line(20, 50, 190, 50);

            // Título del documento
            doc.setFontSize(16);
            doc.setTextColor(31, 41, 55);
            doc.text('NOTA DE PEDIDO', 20, 65);

            // Información del pedido
            doc.setFontSize(10);
            doc.setTextColor(75, 85, 99);
            
            doc.text(`Número: ${pedido.numero}`, 20, 80);
            doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleDateString('es-MX')}`, 20, 90);
            doc.text(`Estado: ${this.getPedidoStatusText(pedido.estado)}`, 20, 100);

            // Información del cliente
            doc.setFontSize(12);
            doc.setTextColor(31, 41, 55);
            doc.text('CLIENTE:', 20, 120);
            
            doc.setFontSize(10);
            doc.setTextColor(75, 85, 99);
            doc.text(`${pedido.cliente?.nombre || 'N/A'}`, 20, 130);
            doc.text(`Contacto: ${pedido.cliente?.contacto || 'N/A'}`, 20, 140);
            doc.text(`Teléfono: ${pedido.cliente?.telefono || 'N/A'}`, 20, 150);

            // Información del vendedor
            doc.setFontSize(12);
            doc.setTextColor(31, 41, 55);
            doc.text('VENDEDOR:', 120, 120);
            
            doc.setFontSize(10);
            doc.setTextColor(75, 85, 99);
            doc.text(`${pedido.vendedor?.nombre || 'N/A'} ${pedido.vendedor?.apellido || ''}`, 120, 130);

            // Tabla de productos
            let yPos = 170;
            
            // Header de la tabla
            doc.setFillColor(249, 250, 251);
            doc.rect(20, yPos, 170, 10, 'F');
            
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81);
            doc.text('PRODUCTO', 25, yPos + 7);
            doc.text('CANTIDAD', 100, yPos + 7);
            doc.text('PRECIO UNIT.', 130, yPos + 7);
            doc.text('SUBTOTAL', 160, yPos + 7);

            yPos += 15;

            // Items del pedido
            doc.setTextColor(75, 85, 99);
            pedido.items?.forEach(item => {
                const producto = productosData.data.find(p => p.id === item.producto_id);
                
                doc.text(producto?.nombre || 'Producto no encontrado', 25, yPos);
                doc.text(`${item.cantidad}`, 105, yPos);
                doc.text(`$${item.precio_unitario.toLocaleString('es-MX')}`, 135, yPos);
                doc.text(`$${item.subtotal.toLocaleString('es-MX')}`, 165, yPos);
                
                yPos += 10;
            });

            // Línea divisoria
            doc.setDrawColor(229, 231, 235);
            doc.line(120, yPos + 5, 190, yPos + 5);

            // Totales
            yPos += 15;
            doc.setFontSize(10);
            doc.setTextColor(55, 65, 81);
            
            doc.text(`Subtotal: $${pedido.subtotal.toLocaleString('es-MX')}`, 130, yPos);
            yPos += 10;
            doc.text(`IVA (16%): $${pedido.iva.toLocaleString('es-MX')}`, 130, yPos);
            yPos += 10;
            
            doc.setFontSize(12);
            doc.setTextColor(31, 41, 55);
            doc.text(`TOTAL: $${pedido.total.toLocaleString('es-MX')}`, 130, yPos);

            // Footer
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text('Gracias por su preferencia', 20, pageHeight - 30);
            doc.text(`Generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`, 20, pageHeight - 20);

            // Guardar PDF
            doc.save(`Pedido_${pedido.numero}.pdf`);
            
            this.showToast('PDF generado exitosamente', 'success');

        } catch (error) {
            console.error('Error generando PDF:', error);
            this.showToast('Error al generar PDF', 'error');
        }
    },

    // ===== ENVÍO DE EMAIL =====

    async sendPedidoEmail(pedidoId) {
        try {
            // Obtener datos del pedido
            const pedidosData = await this.apiCall('/pedidos');
            const pedido = pedidosData.data.find(p => p.id === pedidoId);
            
            if (!pedido || !pedido.cliente?.email) {
                this.showToast('Cliente sin email registrado', 'error');
                return;
            }

            this.showToast('Preparando email...', 'info');

            // Generar contenido del email
            const emailContent = `
                <h2>🌽 Trigal - Nota de Pedido</h2>
                <p>Estimado/a ${pedido.cliente?.contacto},</p>
                <p>Le enviamos los detalles de su pedido:</p>
                
                <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                    <tr style="background-color: #f3f4f6;">
                        <td style="border: 1px solid #e5e7eb; padding: 8px;"><strong>Número de Pedido:</strong></td>
                        <td style="border: 1px solid #e5e7eb; padding: 8px;">${pedido.numero}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e5e7eb; padding: 8px;"><strong>Fecha:</strong></td>
                        <td style="border: 1px solid #e5e7eb; padding: 8px;">${new Date(pedido.fecha).toLocaleDateString('es-MX')}</td>
                    </tr>
                    <tr style="background-color: #f3f4f6;">
                        <td style="border: 1px solid #e5e7eb; padding: 8px;"><strong>Total:</strong></td>
                        <td style="border: 1px solid #e5e7eb; padding: 8px;"><strong>$${pedido.total.toLocaleString('es-MX')}</strong></td>
                    </tr>
                </table>
                
                <p>Su vendedor asignado: ${pedido.vendedor?.nombre} ${pedido.vendedor?.apellido}</p>
                <p>Para cualquier consulta, no dude en contactarnos.</p>
                <p>Saludos cordiales,<br>Equipo Trigal</p>
            `;

            // Simular envío (en producción usarías EmailJS o backend)
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showToast(`Email enviado a ${pedido.cliente.email}`, 'success');

        } catch (error) {
            console.error('Error enviando email:', error);
            this.showToast('Error al enviar email', 'error');
        }
    },

    // ===== PRODUCTOS =====

    async loadProductos() {
        try {
            const productos = await this.apiCall('/productos');
            
            document.getElementById('contentArea').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
                    <div>
                        <h2 style="margin: 0; margin-bottom: var(--space-1);">Catálogo de Productos</h2>
                        <p style="color: var(--gray-600); margin: 0;">Total: ${productos.data.length} productos</p>
                    </div>
                    ${this.user?.rol === 'admin' || this.user?.rol === 'gerente_ventas' ? `
                        <button class="btn btn-primary" onclick="trigalCRM.showProductoForm()">
                            <i class="fas fa-plus"></i>
                            Nuevo Producto
                        </button>
                    ` : ''}
                </div>

                <div class="grid grid-cols-3">
                    ${productos.data.map(producto => `
                        <div class="card hover-lift">
                            <div class="card-body">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-4);">
                                    <div>
                                        <div style="font-size: 0.875rem; color: var(--gray-500); font-weight: 600;">${producto.codigo}</div>
                                        <h3 style="margin: 0; font-size: 1.125rem; color: var(--gray-900);">${producto.nombre}</h3>
                                    </div>
                                    <span class="badge ${producto.activo ? 'badge-success' : 'badge-error'}">
                                        ${producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                
                                <p style="color: var(--gray-600); margin-bottom: var(--space-4); font-size: 0.875rem;">
                                    ${producto.descripcion}
                                </p>
                                
                                <div style="margin-bottom: var(--space-4);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                                        <span style="color: var(--gray-600);">Precio base:</span>
                                        <span style="font-weight: 600;">$${producto.precio_base.toLocaleString('es-MX')}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                                        <span style="color: var(--gray-600);">IVA (${producto.iva}%):</span>
                                        <span>$${(producto.precio_base * producto.iva / 100).toLocaleString('es-MX')}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--gray-200); padding-top: var(--space-2);">
                                        <span style="color: var(--gray-900); font-weight: 600;">Precio venta:</span>
                                        <span style="color: var(--primary); font-weight: 700; font-size: 1.125rem;">$${producto.precio_venta.toLocaleString('es-MX')}</span>
                                    </div>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                                    <div>
                                        <div style="color: var(--gray-600); font-size: 0.875rem;">Stock actual:</div>
                                        <div style="font-weight: 600; color: ${producto.stock <= producto.stock_minimo ? 'var(--error)' : 'var(--success)'};">
                                            ${producto.stock} ${producto.unidad}
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="color: var(--gray-600); font-size: 0.875rem;">Mínimo:</div>
                                        <div style="font-weight: 600;">${producto.stock_minimo} ${producto.unidad}</div>
                                    </div>
                                </div>
                                
                                <div style="display: flex; gap: var(--space-2);">
                                    <button class="btn btn-sm btn-primary" onclick="trigalCRM.addToQuickOrder(${producto.id})" style="flex: 1;">
                                        <i class="fas fa-cart-plus"></i>
                                        Agregar
                                    </button>
                                    ${this.user?.rol === 'admin' || this.user?.rol === 'gerente_ventas' ? `
                                        <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showProductoForm(${producto.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    ` : ''}
                                </div>
                                
                                ${producto.stock <= producto.stock_minimo ? `
                                    <div style="background: var(--error); color: white; padding: var(--space-2); border-radius: var(--radius-md); margin-top: var(--space-3); text-align: center; font-size: 0.875rem;">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        Stock bajo
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (error) {
            console.error('Error cargando productos:', error);
            throw error;
        }
    },

    // ===== VENDEDORES =====

    async loadVendedores() {
        try {
            const usuarios = await this.apiCall('/usuarios');
            const vendedores = usuarios.data.filter(u => u.rol === 'vendedor');
            
            document.getElementById('contentArea').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
                    <div>
                        <h2 style="margin: 0; margin-bottom: var(--space-1);">Equipo de Vendedores</h2>
                        <p style="color: var(--gray-600); margin: 0;">Total: ${vendedores.length} vendedores</p>
                    </div>
                    ${this.user?.rol === 'admin' ? `
                        <button class="btn btn-primary" onclick="trigalCRM.showVendedorForm()">
                            <i class="fas fa-plus"></i>
                            Nuevo Vendedor
                        </button>
                    ` : ''}
                </div>

                <div class="grid grid-cols-3">
                    ${vendedores.map(vendedor => `
                        <div class="card">
                            <div class="card-body text-center">
                                <div class="user-avatar" style="width: 80px; height: 80px; margin: 0 auto var(--space-4); font-size: 2rem;">
                                    ${vendedor.nombre.charAt(0)}${vendedor.apellido.charAt(0)}
                                </div>
                                
                                <h3 style="margin: 0; margin-bottom: var(--space-1);">${vendedor.nombre} ${vendedor.apellido}</h3>
                                <p style="color: var(--gray-600); margin-bottom: var(--space-3);">${vendedor.email}</p>
                                
                                <div style="margin-bottom: var(--space-4);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                                        <span style="color: var(--gray-600);">Teléfono:</span>
                                        <span>${vendedor.telefono || 'No registrado'}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                                        <span style="color: var(--gray-600);">Zona:</span>
                                        <span>${vendedor.zona || 'Sin asignar'}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between;">
                                        <span style="color: var(--gray-600);">Estado:</span>
                                        <span class="badge ${vendedor.activo ? 'badge-success' : 'badge-error'}">
                                            ${vendedor.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div style="display: flex; gap: var(--space-2);">
                                    <button class="btn btn-sm btn-primary" onclick="trigalCRM.showVendedorStats(${vendedor.id})" style="flex: 1;">
                                        <i class="fas fa-chart-line"></i>
                                        Estadísticas
                                    </button>
                                    ${this.user?.rol === 'admin' ? `
                                        <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showVendedorForm(${vendedor.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (error) {
            console.error('Error cargando vendedores:', error);
            throw error;
        }
    }
});

// CSS adicional para badges info
if (!document.getElementById('badgeInfoStyles')) {
    const badgeInfoCSS = document.createElement('style');
    badgeInfoCSS.id = 'badgeInfoStyles';
    badgeInfoCSS.textContent = `
        .badge-info { background: var(--info); color: white; }
    `;
    document.head.appendChild(badgeInfoCSS);
}
