// ===== FUNCIONES DE ADMINISTRACIÓN TRIGAL CRM MVP =====
// Pantallas de administración de usuarios, productos y perfiles

// Agregar funciones de administración a la clase TrigalCRM
Object.assign(TrigalCRM.prototype, {

    // ===== ADMINISTRACIÓN DE USUARIOS =====

    async loadUsuarios() {
        try {
            const usuarios = await this.apiCall('/usuarios');
            
            document.getElementById('contentArea').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
                    <div>
                        <h2 style="margin: 0; margin-bottom: var(--space-1);">Administración de Usuarios</h2>
                        <p style="color: var(--gray-600); margin: 0;">Total: ${usuarios.data.length} usuarios</p>
                    </div>
                    <button class="btn btn-primary" onclick="trigalCRM.showUsuarioForm()">
                        <i class="fas fa-user-plus"></i>
                        Nuevo Usuario
                    </button>
                </div>

                <!-- Estadísticas de usuarios -->
                <div class="grid grid-cols-4" style="margin-bottom: var(--space-6);">
                    <div class="card">
                        <div class="card-body text-center">
                            <div style="font-size: 2rem; color: var(--primary); margin-bottom: var(--space-2);">
                                <i class="fas fa-crown"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--gray-900);">
                                ${usuarios.data.filter(u => u.rol === 'admin').length}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Administradores</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-body text-center">
                            <div style="font-size: 2rem; color: var(--secondary); margin-bottom: var(--space-2);">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--gray-900);">
                                ${usuarios.data.filter(u => u.rol === 'gerente_ventas').length}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Gerentes</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-body text-center">
                            <div style="font-size: 2rem; color: var(--warning); margin-bottom: var(--space-2);">
                                <i class="fas fa-user-tie"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--gray-900);">
                                ${usuarios.data.filter(u => u.rol === 'vendedor').length}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Vendedores</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-body text-center">
                            <div style="font-size: 2rem; color: var(--success); margin-bottom: var(--space-2);">
                                <i class="fas fa-user-check"></i>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--gray-900);">
                                ${usuarios.data.filter(u => u.activo).length}
                            </div>
                            <div style="color: var(--gray-600); font-size: 0.875rem;">Activos</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 class="card-title">
                                <i class="fas fa-users-cog"></i>
                                Lista de Usuarios
                            </h3>
                            <div style="display: flex; gap: var(--space-3);">
                                <select id="usuariosFilter" class="form-select" style="width: 150px;">
                                    <option value="">Todos los roles</option>
                                    <option value="admin">Administradores</option>
                                    <option value="gerente_ventas">Gerentes</option>
                                    <option value="vendedor">Vendedores</option>
                                    <option value="gerente_finanzas">Finanzas</option>
                                </select>
                                <input type="text" id="usuariosSearch" class="form-input" placeholder="Buscar usuarios..." style="width: 250px;">
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Información</th>
                                        <th>Rol</th>
                                        <th>Zona/Contacto</th>
                                        <th>Estado</th>
                                        <th>Último Acceso</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="usuariosTableBody">
                                    ${usuarios.data.map(usuario => `
                                        <tr>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: var(--space-3);">
                                                    <div class="user-avatar" style="width: 40px; height: 40px; font-size: 1rem;">
                                                        ${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style="font-weight: 600;">${usuario.nombre} ${usuario.apellido}</div>
                                                        <div style="font-size: 0.875rem; color: var(--gray-600);">@${usuario.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>${usuario.email}</div>
                                                <div style="font-size: 0.875rem; color: var(--gray-600);">${usuario.telefono || 'Sin teléfono'}</div>
                                            </td>
                                            <td>
                                                <span class="badge ${this.getRoleBadgeClass(usuario.rol)}">
                                                    ${this.getRoleIcon(usuario.rol)} ${this.getRoleName(usuario.rol)}
                                                </span>
                                            </td>
                                            <td>
                                                <div>${usuario.zona || 'Sin asignar'}</div>
                                            </td>
                                            <td>
                                                <span class="badge ${usuario.activo ? 'badge-success' : 'badge-error'}">
                                                    <i class="fas fa-${usuario.activo ? 'check-circle' : 'times-circle'}"></i>
                                                    ${usuario.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style="font-size: 0.875rem;">
                                                    ${usuario.ultimo_acceso ? new Date(usuario.ultimo_acceso).toLocaleDateString('es-MX') : 'Nunca'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style="display: flex; gap: var(--space-2);">
                                                    <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showUsuarioDetail(${usuario.id})" title="Ver perfil">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn btn-sm btn-primary" onclick="trigalCRM.showUsuarioForm(${usuario.id})" title="Editar">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button class="btn btn-sm ${usuario.activo ? 'btn-warning' : 'btn-success'}" 
                                                            onclick="trigalCRM.toggleUsuarioStatus(${usuario.id})" 
                                                            title="${usuario.activo ? 'Desactivar' : 'Activar'}">
                                                        <i class="fas fa-${usuario.activo ? 'pause' : 'play'}"></i>
                                                    </button>
                                                    ${usuario.id !== this.user.id ? `
                                                        <button class="btn btn-sm btn-error" onclick="trigalCRM.resetUsuarioPassword(${usuario.id})" title="Resetear contraseña">
                                                            <i class="fas fa-key"></i>
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
            document.getElementById('usuariosFilter').addEventListener('change', () => {
                this.filterUsuarios(usuarios.data);
            });

            document.getElementById('usuariosSearch').addEventListener('input', () => {
                this.filterUsuarios(usuarios.data);
            });

        } catch (error) {
            console.error('Error cargando usuarios:', error);
            throw error;
        }
    },

    getRoleBadgeClass(rol) {
        const classes = {
            'admin': 'badge-primary',
            'gerente_ventas': 'badge-secondary',
            'vendedor': 'badge-warning',
            'gerente_finanzas': 'badge-info'
        };
        return classes[rol] || 'badge-secondary';
    },

    getRoleIcon(rol) {
        const icons = {
            'admin': '<i class="fas fa-crown"></i>',
            'gerente_ventas': '<i class="fas fa-chart-line"></i>',
            'vendedor': '<i class="fas fa-user-tie"></i>',
            'gerente_finanzas': '<i class="fas fa-calculator"></i>'
        };
        return icons[rol] || '<i class="fas fa-user"></i>';
    },

    filterUsuarios(usuariosData) {
        const roleFilter = document.getElementById('usuariosFilter').value;
        const searchTerm = document.getElementById('usuariosSearch').value.toLowerCase();
        
        const filteredUsuarios = usuariosData.filter(usuario => {
            const matchesRole = !roleFilter || usuario.rol === roleFilter;
            const matchesSearch = !searchTerm || 
                usuario.nombre.toLowerCase().includes(searchTerm) ||
                usuario.apellido.toLowerCase().includes(searchTerm) ||
                usuario.username.toLowerCase().includes(searchTerm) ||
                usuario.email.toLowerCase().includes(searchTerm);
            
            return matchesRole && matchesSearch;
        });

        const tbody = document.getElementById('usuariosTableBody');
        tbody.innerHTML = filteredUsuarios.map(usuario => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <div class="user-avatar" style="width: 40px; height: 40px; font-size: 1rem;">
                            ${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}
                        </div>
                        <div>
                            <div style="font-weight: 600;">${usuario.nombre} ${usuario.apellido}</div>
                            <div style="font-size: 0.875rem; color: var(--gray-600);">@${usuario.username}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div>${usuario.email}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${usuario.telefono || 'Sin teléfono'}</div>
                </td>
                <td>
                    <span class="badge ${this.getRoleBadgeClass(usuario.rol)}">
                        ${this.getRoleIcon(usuario.rol)} ${this.getRoleName(usuario.rol)}
                    </span>
                </td>
                <td>
                    <div>${usuario.zona || 'Sin asignar'}</div>
                </td>
                <td>
                    <span class="badge ${usuario.activo ? 'badge-success' : 'badge-error'}">
                        <i class="fas fa-${usuario.activo ? 'check-circle' : 'times-circle'}"></i>
                        ${usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div style="font-size: 0.875rem;">
                        ${usuario.ultimo_acceso ? new Date(usuario.ultimo_acceso).toLocaleDateString('es-MX') : 'Nunca'}
                    </div>
                </td>
                <td>
                    <div style="display: flex; gap: var(--space-2);">
                        <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showUsuarioDetail(${usuario.id})" title="Ver perfil">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="trigalCRM.showUsuarioForm(${usuario.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm ${usuario.activo ? 'btn-warning' : 'btn-success'}" 
                                onclick="trigalCRM.toggleUsuarioStatus(${usuario.id})" 
                                title="${usuario.activo ? 'Desactivar' : 'Activar'}">
                            <i class="fas fa-${usuario.activo ? 'pause' : 'play'}"></i>
                        </button>
                        ${usuario.id !== this.user.id ? `
                            <button class="btn btn-sm btn-error" onclick="trigalCRM.resetUsuarioPassword(${usuario.id})" title="Resetear contraseña">
                                <i class="fas fa-key"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },

    // ===== FORMULARIO DE USUARIO =====

    async showUsuarioForm(usuarioId = null) {
        const isEdit = usuarioId !== null;
        let usuario = null;

        if (isEdit) {
            const usuariosData = await this.apiCall('/usuarios');
            usuario = usuariosData.data.find(u => u.id === usuarioId);
        }

        this.showModal(
            isEdit ? 'Editar Usuario' : 'Nuevo Usuario',
            `
            <form id="usuarioForm">
                <div class="grid grid-cols-2" style="gap: var(--space-4);">
                    <div class="form-group">
                        <label class="form-label">Nombre *</label>
                        <input type="text" id="usuarioNombre" class="form-input" required 
                               value="${usuario?.nombre || ''}" placeholder="Ej: Juan">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Apellido *</label>
                        <input type="text" id="usuarioApellido" class="form-input" required 
                               value="${usuario?.apellido || ''}" placeholder="Ej: Pérez">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Usuario *</label>
                        <input type="text" id="usuarioUsername" class="form-input" required 
                               value="${usuario?.username || ''}" placeholder="Ej: juan.perez" ${isEdit ? 'readonly' : ''}>
                        ${isEdit ? '<div class="form-help" style="color: var(--gray-500); font-size: 0.75rem; margin-top: var(--space-1);">El nombre de usuario no se puede cambiar</div>' : ''}
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" id="usuarioEmail" class="form-input" required 
                               value="${usuario?.email || ''}" placeholder="juan@empresa.com">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input type="tel" id="usuarioTelefono" class="form-input" 
                               value="${usuario?.telefono || ''}" placeholder="+52 55 1234 5678">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Rol *</label>
                        <select id="usuarioRol" class="form-select" required>
                            <option value="">Seleccionar rol</option>
                            <option value="admin" ${usuario?.rol === 'admin' ? 'selected' : ''}>👑 Administrador</option>
                            <option value="gerente_ventas" ${usuario?.rol === 'gerente_ventas' ? 'selected' : ''}>📊 Gerente de Ventas</option>
                            <option value="vendedor" ${usuario?.rol === 'vendedor' ? 'selected' : ''}>🎯 Vendedor</option>
                            <option value="gerente_finanzas" ${usuario?.rol === 'gerente_finanzas' ? 'selected' : ''}>💰 Gerente de Finanzas</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Zona de Trabajo</label>
                        <select id="usuarioZona" class="form-select">
                            <option value="">Sin asignar</option>
                            <option value="Norte" ${usuario?.zona === 'Norte' ? 'selected' : ''}>Norte</option>
                            <option value="Sur" ${usuario?.zona === 'Sur' ? 'selected' : ''}>Sur</option>
                            <option value="Este" ${usuario?.zona === 'Este' ? 'selected' : ''}>Este</option>
                            <option value="Oeste" ${usuario?.zona === 'Oeste' ? 'selected' : ''}>Oeste</option>
                            <option value="Centro" ${usuario?.zona === 'Centro' ? 'selected' : ''}>Centro</option>
                        </select>
                    </div>
                    
                    ${!isEdit ? `
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label class="form-label">Contraseña *</label>
                        <input type="password" id="usuarioPassword" class="form-input" required 
                               placeholder="Mínimo 6 caracteres" minlength="6">
                        <div class="form-help" style="color: var(--gray-500); font-size: 0.75rem; margin-top: var(--space-1);">
                            La contraseña debe tener al menos 6 caracteres
                        </div>
                    </div>
                    
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label class="form-label">Confirmar Contraseña *</label>
                        <input type="password" id="usuarioPasswordConfirm" class="form-input" required 
                               placeholder="Repite la contraseña" minlength="6">
                    </div>
                    ` : ''}
                </div>
                
                <div class="form-group" style="margin-top: var(--space-4);">
                    <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                        <input type="checkbox" id="usuarioActivo" ${usuario?.activo !== false ? 'checked' : ''}>
                        <span class="form-label" style="margin: 0;">Usuario activo</span>
                    </label>
                    <div class="form-help" style="color: var(--gray-500); font-size: 0.75rem; margin-top: var(--space-1);">
                        Los usuarios inactivos no pueden iniciar sesión
                    </div>
                </div>
            </form>
            `,
            `
            <button type="button" class="btn btn-secondary" onclick="trigalCRM.closeModal()">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="trigalCRM.saveUsuario(${usuarioId})">
                <i class="fas fa-save"></i>
                ${isEdit ? 'Actualizar' : 'Crear'} Usuario
            </button>
            `
        );
    },

    async saveUsuario(usuarioId = null) {
        const formData = {
            nombre: document.getElementById('usuarioNombre').value.trim(),
            apellido: document.getElementById('usuarioApellido').value.trim(),
            username: document.getElementById('usuarioUsername').value.trim(),
            email: document.getElementById('usuarioEmail').value.trim(),
            telefono: document.getElementById('usuarioTelefono').value.trim(),
            rol: document.getElementById('usuarioRol').value,
            zona: document.getElementById('usuarioZona').value
        };

        // Validaciones
        if (!formData.nombre || !formData.apellido || !formData.username || !formData.email || !formData.rol) {
            this.showToast('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showToast('Ingresa un email válido', 'error');
            return;
        }

        // Para usuarios nuevos, validar contraseñas
        if (!usuarioId) {
            const password = document.getElementById('usuarioPassword').value;
            const passwordConfirm = document.getElementById('usuarioPasswordConfirm').value;

            if (!password || password.length < 6) {
                this.showToast('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }

            if (password !== passwordConfirm) {
                this.showToast('Las contraseñas no coinciden', 'error');
                return;
            }

            formData.password = password;
        }

        try {
            const endpoint = usuarioId ? `/usuarios/${usuarioId}` : '/usuarios';
            const method = usuarioId ? 'PUT' : 'POST';

            await this.apiCall(endpoint, {
                method,
                body: JSON.stringify(formData)
            });

            this.showToast(
                usuarioId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente',
                'success'
            );
            
            this.closeModal();
            this.loadUsuarios(); // Recargar lista
            
        } catch (error) {
            console.error('Error guardando usuario:', error);
            this.showToast('Error al guardar usuario: ' + error.message, 'error');
        }
    },

    // ===== GESTIÓN DE PRODUCTOS (ADMIN) =====

    async showProductoForm(productoId = null) {
        const isEdit = productoId !== null;
        let producto = null;

        if (isEdit) {
            const productosData = await this.apiCall('/productos');
            producto = productosData.data.find(p => p.id === productoId);
        }

        this.showModal(
            isEdit ? 'Editar Producto' : 'Nuevo Producto',
            `
            <form id="productoForm">
                <div class="grid grid-cols-2" style="gap: var(--space-4);">
                    <div class="form-group">
                        <label class="form-label">Código *</label>
                        <input type="text" id="productoCodigo" class="form-input" required 
                               value="${producto?.codigo || ''}" placeholder="Ej: MAIZ001" ${isEdit ? 'readonly' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Categoría *</label>
                        <select id="productoCategoria" class="form-select" required>
                            <option value="">Seleccionar categoría</option>
                            <option value="Granos" ${producto?.categoria === 'Granos' ? 'selected' : ''}>🌽 Granos</option>
                            <option value="Harinas" ${producto?.categoria === 'Harinas' ? 'selected' : ''}>🥄 Harinas</option>
                            <option value="Derivados" ${producto?.categoria === 'Derivados' ? 'selected' : ''}>🍿 Derivados</option>
                            <option value="Procesados" ${producto?.categoria === 'Procesados' ? 'selected' : ''}>🥫 Procesados</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label class="form-label">Nombre del Producto *</label>
                        <input type="text" id="productoNombre" class="form-input" required 
                               value="${producto?.nombre || ''}" placeholder="Ej: Maíz Cacahuazintle Blanco">
                    </div>
                    
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label class="form-label">Descripción</label>
                        <textarea id="productoDescripcion" class="form-textarea" rows="3"
                                  placeholder="Descripción detallada del producto">${producto?.descripcion || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Unidad de Medida *</label>
                        <select id="productoUnidad" class="form-select" required>
                            <option value="">Seleccionar unidad</option>
                            <option value="kg" ${producto?.unidad === 'kg' ? 'selected' : ''}>Kilogramo (kg)</option>
                            <option value="ton" ${producto?.unidad === 'ton' ? 'selected' : ''}>Tonelada (ton)</option>
                            <option value="saco" ${producto?.unidad === 'saco' ? 'selected' : ''}>Saco</option>
                            <option value="caja" ${producto?.unidad === 'caja' ? 'selected' : ''}>Caja</option>
                            <option value="pza" ${producto?.unidad === 'pza' ? 'selected' : ''}>Pieza</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Precio Base *</label>
                        <div style="position: relative;">
                            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-500);">$</span>
                            <input type="number" id="productoPrecioBase" class="form-input" required min="0" step="0.01"
                                   value="${producto?.precio_base || ''}" placeholder="0.00" 
                                   style="padding-left: 2rem;" onchange="trigalCRM.calculatePrecioVenta()">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">IVA (%) *</label>
                        <select id="productoIva" class="form-select" required onchange="trigalCRM.calculatePrecioVenta()">
                            <option value="">Seleccionar IVA</option>
                            <option value="0" ${producto?.iva === 0 ? 'selected' : ''}>0% (Exento)</option>
                            <option value="8" ${producto?.iva === 8 ? 'selected' : ''}>8%</option>
                            <option value="16" ${producto?.iva === 16 ? 'selected' : ''}>16% (General)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Precio de Venta</label>
                        <div style="position: relative;">
                            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-500);">$</span>
                            <input type="number" id="productoPrecioVenta" class="form-input" readonly
                                   value="${producto?.precio_venta || ''}" 
                                   style="padding-left: 2rem; background: var(--gray-50); color: var(--primary); font-weight: 600;">
                        </div>
                        <div class="form-help" style="color: var(--gray-500); font-size: 0.75rem; margin-top: var(--space-1);">
                            Se calcula automáticamente: Precio Base + IVA
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Stock Inicial</label>
                        <input type="number" id="productoStock" class="form-input" min="0"
                               value="${producto?.stock || ''}" placeholder="0">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Stock Mínimo</label>
                        <input type="number" id="productoStockMinimo" class="form-input" min="0"
                               value="${producto?.stock_minimo || ''}" placeholder="0">
                    </div>
                </div>
                
                <div class="form-group" style="margin-top: var(--space-4);">
                    <label style="display: flex; align-items: center; gap: var(--space-2); cursor: pointer;">
                        <input type="checkbox" id="productoActivo" ${producto?.activo !== false ? 'checked' : ''}>
                        <span class="form-label" style="margin: 0;">Producto activo</span>
                    </label>
                </div>
            </form>
            `,
            `
            <button type="button" class="btn btn-secondary" onclick="trigalCRM.closeModal()">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="trigalCRM.saveProducto(${productoId})">
                <i class="fas fa-save"></i>
                ${isEdit ? 'Actualizar' : 'Crear'} Producto
            </button>
            `
        );

        // Calcular precio de venta inicial
        if (producto) {
            this.calculatePrecioVenta();
        }
    },

    calculatePrecioVenta() {
        const precioBase = parseFloat(document.getElementById('productoPrecioBase').value) || 0;
        const iva = parseFloat(document.getElementById('productoIva').value) || 0;
        
        const precioVenta = precioBase * (1 + iva / 100);
        document.getElementById('productoPrecioVenta').value = precioVenta.toFixed(2);
    },

    async saveProducto(productoId = null) {
        const formData = {
            codigo: document.getElementById('productoCodigo').value.trim().toUpperCase(),
            nombre: document.getElementById('productoNombre').value.trim(),
            descripcion: document.getElementById('productoDescripcion').value.trim(),
            categoria: document.getElementById('productoCategoria').value,
            unidad: document.getElementById('productoUnidad').value,
            precio_base: parseFloat(document.getElementById('productoPrecioBase').value) || 0,
            iva: parseFloat(document.getElementById('productoIva').value) || 0,
            stock: parseInt(document.getElementById('productoStock').value) || 0,
            stock_minimo: parseInt(document.getElementById('productoStockMinimo').value) || 0,
            activo: document.getElementById('productoActivo').checked
        };

        // Validaciones
        if (!formData.codigo || !formData.nombre || !formData.categoria || !formData.unidad || formData.precio_base <= 0) {
            this.showToast('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        try {
            const endpoint = productoId ? `/productos/${productoId}` : '/productos';
            const method = productoId ? 'PUT' : 'POST';

            await this.apiCall(endpoint, {
                method,
                body: JSON.stringify(formData)
            });

            this.showToast(
                productoId ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente',
                'success'
            );
            
            this.closeModal();
            this.loadProductos(); // Recargar lista
            
        } catch (error) {
            console.error('Error guardando producto:', error);
            this.showToast('Error al guardar producto: ' + error.message, 'error');
        }
    }
});

// CSS adicional para badges de roles
if (!document.getElementById('rolesBadgeStyles')) {
    const rolesBadgeCSS = document.createElement('style');
    rolesBadgeCSS.id = 'rolesBadgeStyles';
    rolesBadgeCSS.textContent = `
        .badge-info { background: var(--info); color: white; }
        .form-help { font-size: 0.75rem; color: var(--gray-500); margin-top: var(--space-1); }
    `;
    document.head.appendChild(rolesBadgeCSS);
}
