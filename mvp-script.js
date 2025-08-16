// ===== TRIGAL CRM MVP - JAVASCRIPT PRINCIPAL =====

class TrigalCRM {
    constructor() {
        this.API_BASE = '/api';
        this.token = localStorage.getItem('trigal_token');
        this.user = null;
        this.currentSection = 'dashboard';
        this.map = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        if (this.token) {
            const isValid = await this.verifyToken();
            if (isValid) {
                this.showApp();
                this.loadSection('dashboard');
            } else {
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Menu toggle para móvil
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });

        // Navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.loadSection(section);
            });
        });

        // Modal close
        document.getElementById('modalClose')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Cerrar sidebar en móvil al hacer click fuera
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // ===== AUTENTICACIÓN =====

    showLogin() {
        document.body.innerHTML = `
            <div class="login-container" style="
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                padding: var(--space-4);
                position: relative;
                overflow: hidden;
            ">
                <!-- Elementos decorativos de fondo -->
                <div style="
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"2\" fill=\"white\" opacity=\"0.1\"/></svg>') repeat;
                    animation: float 20s ease-in-out infinite;
                "></div>
                
                <div class="login-card" style="
                    background: white;
                    padding: var(--space-8);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-xl);
                    width: 100%;
                    max-width: 450px;
                    position: relative;
                    z-index: 10;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                ">
                    <div class="login-header" style="text-align: center; margin-bottom: var(--space-8);">
                        <div class="logo" style="margin-bottom: var(--space-6);">
                            <div class="logo-icon" style="
                                width: 80px;
                                height: 80px;
                                background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                                border-radius: var(--radius-xl);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 2.5rem;
                                margin: 0 auto var(--space-4);
                                box-shadow: var(--shadow-lg);
                                animation: pulse 2s ease-in-out infinite;
                            ">🌽</div>
                            <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--gray-900); margin: 0; letter-spacing: -0.025em;">Trigal CRM</h1>
                            <p style="color: var(--gray-600); margin: var(--space-2) 0 0; font-size: 1.125rem; font-weight: 500;">Sistema de Ventas Especializado</p>
                            <div style="
                                width: 60px;
                                height: 4px;
                                background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
                                margin: var(--space-4) auto 0;
                                border-radius: 2px;
                            "></div>
                        </div>
                    </div>
                    
                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 600; color: var(--gray-700);">
                                <i class="fas fa-user" style="margin-right: var(--space-2);"></i>
                                Usuario
                            </label>
                            <input type="text" id="loginUsername" class="form-input" required 
                                   placeholder="Ingresa tu usuario" 
                                   style="padding-left: 3rem; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%236b7280\"><path d=\"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\"/></svg>'); background-repeat: no-repeat; background-position: 12px center; background-size: 20px;">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" style="font-weight: 600; color: var(--gray-700);">
                                <i class="fas fa-lock" style="margin-right: var(--space-2);"></i>
                                Contraseña
                            </label>
                            <input type="password" id="loginPassword" class="form-input" required 
                                   placeholder="Ingresa tu contraseña"
                                   style="padding-left: 3rem; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%236b7280\"><path d=\"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z\"/></svg>'); background-repeat: no-repeat; background-position: 12px center; background-size: 20px;">
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-lg w-full" 
                                style="margin-bottom: var(--space-6); background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); font-weight: 600; font-size: 1.125rem; padding: var(--space-4) var(--space-6);">
                            <span id="loginBtnText">
                                <i class="fas fa-sign-in-alt" style="margin-right: var(--space-2);"></i>
                                Iniciar Sesión
                            </span>
                            <div id="loginSpinner" class="spinner" style="display: none;"></div>
                        </button>
                    </form>
                    
                    <div class="login-help" style="
                        background: var(--gray-50);
                        padding: var(--space-5);
                        border-radius: var(--radius-lg);
                        border: 1px solid var(--gray-200);
                    ">
                        <h3 style="font-size: 0.875rem; font-weight: 700; color: var(--gray-800); margin: 0 0 var(--space-3) 0; text-align: center;">
                            <i class="fas fa-info-circle" style="color: var(--primary); margin-right: var(--space-2);"></i>
                            Usuarios de Prueba
                        </h3>
                        <div style="display: grid; gap: var(--space-2);">
                            <div class="test-user" onclick="trigalCRM.quickLogin('admin', 'password')" style="
                                display: flex; justify-content: space-between; align-items: center;
                                padding: var(--space-3);
                                background: white;
                                border-radius: var(--radius-md);
                                border: 1px solid var(--gray-200);
                                cursor: pointer;
                                transition: all var(--transition-fast);
                                font-size: 0.875rem;
                            " onmouseover="this.style.background='var(--primary)'; this.style.color='white'; this.style.transform='translateX(4px)'" 
                               onmouseout="this.style.background='white'; this.style.color='inherit'; this.style.transform='translateX(0)'">
                                <div>
                                    <strong>👑 Administrador</strong>
                                    <div style="color: var(--gray-600); font-size: 0.75rem;">admin / password</div>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                            <div class="test-user" onclick="trigalCRM.quickLogin('gerente.ventas', 'password')" style="
                                display: flex; justify-content: space-between; align-items: center;
                                padding: var(--space-3);
                                background: white;
                                border-radius: var(--radius-md);
                                border: 1px solid var(--gray-200);
                                cursor: pointer;
                                transition: all var(--transition-fast);
                                font-size: 0.875rem;
                            " onmouseover="this.style.background='var(--secondary)'; this.style.color='white'; this.style.transform='translateX(4px)'" 
                               onmouseout="this.style.background='white'; this.style.color='inherit'; this.style.transform='translateX(0)'">
                                <div>
                                    <strong>📊 Gerente Ventas</strong>
                                    <div style="color: var(--gray-600); font-size: 0.75rem;">gerente.ventas / password</div>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                            <div class="test-user" onclick="trigalCRM.quickLogin('vendedor1', 'password')" style="
                                display: flex; justify-content: space-between; align-items: center;
                                padding: var(--space-3);
                                background: white;
                                border-radius: var(--radius-md);
                                border: 1px solid var(--gray-200);
                                cursor: pointer;
                                transition: all var(--transition-fast);
                                font-size: 0.875rem;
                            " onmouseover="this.style.background='var(--warning)'; this.style.color='white'; this.style.transform='translateX(4px)'" 
                               onmouseout="this.style.background='white'; this.style.color='inherit'; this.style.transform='translateX(0)'">
                                <div>
                                    <strong>🎯 Vendedor</strong>
                                    <div style="color: var(--gray-600); font-size: 0.75rem;">vendedor1 / password</div>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: var(--space-6); color: var(--gray-500); font-size: 0.75rem;">
                        <p>🌽 Especializado en productos de maíz • Versión MVP 1.0</p>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .test-user {
                    transition: all 0.2s ease !important;
                }
            </style>
        `;

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.login();
        });
    }

    // Login rápido para usuarios de prueba
    async quickLogin(username, password) {
        document.getElementById('loginUsername').value = username;
        document.getElementById('loginPassword').value = password;
        await this.login();
    }

    async login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const btnText = document.getElementById('loginBtnText');
        const spinner = document.getElementById('loginSpinner');

        btnText.style.display = 'none';
        spinner.style.display = 'block';

        try {
            const response = await fetch(`${this.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.data.token;
                this.user = data.data.user;
                localStorage.setItem('trigal_token', this.token);
                localStorage.setItem('trigal_user', JSON.stringify(this.user));
                
                this.showApp();
                this.loadSection('dashboard');
                this.showToast('¡Bienvenido!', 'success');
            } else {
                this.showToast(data.message || 'Error de autenticación', 'error');
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.showToast('Error de conexión', 'error');
        } finally {
            btnText.style.display = 'block';
            spinner.style.display = 'none';
        }
    }

    async verifyToken() {
        try {
            const response = await this.apiCall('/auth/verify');
            if (response.success) {
                this.user = response.data.user;
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    logout() {
        localStorage.removeItem('trigal_token');
        localStorage.removeItem('trigal_user');
        this.token = null;
        this.user = null;
        this.showLogin();
    }

    showApp() {
        document.body.innerHTML = `
            <div class="app-container">
                <nav class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <div class="logo">
                            <div class="logo-icon">🌽</div>
                            <span>Trigal CRM</span>
                        </div>
                    </div>
                    
                    <div class="nav-menu">
                        <div class="nav-section">
                            <div class="nav-section-title">Principal</div>
                            <a href="#dashboard" class="nav-item active" data-section="dashboard">
                                <i class="fas fa-chart-line"></i>
                                <span>Dashboard</span>
                            </a>
                        </div>
                        
                        <div class="nav-section">
                            <div class="nav-section-title">Ventas</div>
                            <a href="#vendedores" class="nav-item" data-section="vendedores">
                                <i class="fas fa-user-tie"></i>
                                <span>Vendedores</span>
                            </a>
                            <a href="#clientes" class="nav-item" data-section="clientes">
                                <i class="fas fa-users"></i>
                                <span>Clientes</span>
                            </a>
                            <a href="#pedidos" class="nav-item" data-section="pedidos">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Pedidos</span>
                                <span class="nav-badge" id="pedidosBadge">0</span>
                            </a>
                            <a href="#visitas" class="nav-item" data-section="visitas">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Visitas</span>
                            </a>
                        </div>
                        
                        <div class="nav-section">
                            <div class="nav-section-title">Productos</div>
                            <a href="#productos" class="nav-item" data-section="productos">
                                <i class="fas fa-box"></i>
                                <span>Catálogo</span>
                            </a>
                            <a href="#precios" class="nav-item" data-section="precios">
                                <i class="fas fa-tags"></i>
                                <span>Listas de Precios</span>
                            </a>
                            <a href="#promociones" class="nav-item" data-section="promociones">
                                <i class="fas fa-percentage"></i>
                                <span>Promociones</span>
                            </a>
                        </div>
                        
                        <div class="nav-section">
                            <div class="nav-section-title">Análisis</div>
                            <a href="#reportes" class="nav-item" data-section="reportes">
                                <i class="fas fa-chart-bar"></i>
                                <span>Reportes</span>
                            </a>
                            <a href="#finanzas" class="nav-item" data-section="finanzas">
                                <i class="fas fa-dollar-sign"></i>
                                <span>Finanzas</span>
                            </a>
                        </div>
                        
                        ${this.user?.rol === 'admin' ? `
                        <div class="nav-section">
                            <div class="nav-section-title">Sistema</div>
                            <a href="#usuarios" class="nav-item" data-section="usuarios">
                                <i class="fas fa-user-cog"></i>
                                <span>Usuarios</span>
                            </a>
                        </div>
                        ` : ''}
                    </div>
                </nav>
                
                <div class="main-content">
                    <header class="main-header">
                        <div class="header-left">
                            <button class="menu-toggle" id="menuToggle">
                                <i class="fas fa-bars"></i>
                            </button>
                            <div>
                                <h1 class="page-title" id="pageTitle">Dashboard</h1>
                                <p class="page-subtitle" id="pageSubtitle">Resumen de ventas y actividad</p>
                            </div>
                        </div>
                        
                        <div class="header-right">
                            <div class="global-search">
                                <i class="fas fa-search search-icon"></i>
                                <input type="text" class="search-input" placeholder="Buscar...">
                            </div>
                            
                            <button class="notifications-btn">
                                <i class="fas fa-bell"></i>
                                <span class="notification-badge">0</span>
                            </button>
                            
                            <div class="user-profile" onclick="trigalCRM.showUserMenu()">
                                <div class="user-avatar">${this.user?.nombre?.charAt(0) || 'U'}${this.user?.apellido?.charAt(0) || ''}</div>
                                <div class="user-info">
                                    <div class="user-name">${this.user?.nombre || ''} ${this.user?.apellido || ''}</div>
                                    <div class="user-role">${this.getRoleName(this.user?.rol)}</div>
                                </div>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </header>
                    
                    <main class="content-area" id="contentArea">
                        <!-- Contenido dinámico -->
                    </main>
                </div>
            </div>
            
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal" id="modal">
                    <div class="modal-header">
                        <h2 class="modal-title" id="modalTitle"></h2>
                        <button class="modal-close" id="modalClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="modalBody"></div>
                    <div class="modal-footer" id="modalFooter"></div>
                </div>
            </div>
            
            <div id="toastContainer" style="position: fixed; top: 20px; right: 20px; z-index: 9999;"></div>
        `;

        this.setupEventListeners();
        this.updateUserInfo();
    }

    getRoleName(rol) {
        const roles = {
            'admin': 'Administrador',
            'gerente_ventas': 'Gerente de Ventas',
            'vendedor': 'Vendedor',
            'gerente_finanzas': 'Gerente de Finanzas'
        };
        return roles[rol] || 'Usuario';
    }

    updateUserInfo() {
        document.getElementById('userName').textContent = `${this.user?.nombre || ''} ${this.user?.apellido || ''}`;
        document.getElementById('userRole').textContent = this.getRoleName(this.user?.rol);
        
        const avatar = document.querySelector('.user-avatar');
        if (avatar) {
            avatar.textContent = `${this.user?.nombre?.charAt(0) || 'U'}${this.user?.apellido?.charAt(0) || ''}`;
        }
    }

    showUserMenu() {
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            padding: var(--space-2);
            min-width: 200px;
            z-index: 1000;
        `;
        
        menu.innerHTML = `
            <div style="padding: var(--space-3); border-bottom: 1px solid var(--gray-200);">
                <div style="font-weight: 600;">${this.user?.nombre} ${this.user?.apellido}</div>
                <div style="font-size: 0.875rem; color: var(--gray-600);">${this.user?.email}</div>
            </div>
            <a href="#" onclick="trigalCRM.logout()" style="
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-3);
                color: var(--gray-700);
                text-decoration: none;
                border-radius: var(--radius-md);
                transition: background var(--transition-fast);
            " onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'">
                <i class="fas fa-sign-out-alt"></i>
                Cerrar Sesión
            </a>
        `;

        // Remover menús anteriores
        document.querySelectorAll('.user-menu').forEach(m => m.remove());
        
        menu.className = 'user-menu';
        document.querySelector('.user-profile').appendChild(menu);

        // Cerrar al hacer click fuera
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    // ===== NAVEGACIÓN =====

    async loadSection(section) {
        // Actualizar navegación activa
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

        this.currentSection = section;

        // Actualizar título
        const titles = {
            dashboard: { title: 'Dashboard', subtitle: 'Resumen de ventas y actividad' },
            vendedores: { title: 'Vendedores', subtitle: 'Gestión del equipo de ventas' },
            clientes: { title: 'Clientes', subtitle: 'Gestión de clientes y contactos' },
            pedidos: { title: 'Pedidos', subtitle: 'Gestión de pedidos y ventas' },
            visitas: { title: 'Visitas', subtitle: 'Registro de visitas a clientes' },
            productos: { title: 'Productos', subtitle: 'Catálogo de productos' },
            precios: { title: 'Listas de Precios', subtitle: 'Gestión de precios' },
            promociones: { title: 'Promociones', subtitle: 'Ofertas y descuentos' },
            reportes: { title: 'Reportes', subtitle: 'Análisis y estadísticas' },
            finanzas: { title: 'Finanzas', subtitle: 'Control financiero' },
            usuarios: { title: 'Usuarios', subtitle: 'Gestión de usuarios del sistema' }
        };

        const titleInfo = titles[section] || { title: 'CRM', subtitle: 'Sistema de ventas' };
        document.getElementById('pageTitle').textContent = titleInfo.title;
        document.getElementById('pageSubtitle').textContent = titleInfo.subtitle;

        // Cargar contenido
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = '<div class="loading"><div class="spinner"></div> Cargando...</div>';

        try {
            switch (section) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'vendedores':
                    await this.loadVendedores();
                    break;
                case 'clientes':
                    await this.loadClientes();
                    break;
                case 'pedidos':
                    await this.loadPedidos();
                    break;
                case 'visitas':
                    await this.loadVisitas();
                    break;
                case 'productos':
                    await this.loadProductos();
                    break;
                case 'promociones':
                    await this.loadPromociones();
                    break;
                case 'usuarios':
                    await this.loadUsuarios();
                    break;
                default:
                    this.loadPlaceholder(section);
            }
        } catch (error) {
            console.error('Error cargando sección:', error);
            contentArea.innerHTML = `
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--warning); margin-bottom: var(--space-4);"></i>
                        <h3>Error al cargar</h3>
                        <p style="color: var(--gray-600);">No se pudo cargar el contenido. Inténtalo de nuevo.</p>
                        <button class="btn btn-primary" onclick="trigalCRM.loadSection('${section}')">Reintentar</button>
                    </div>
                </div>
            `;
        }

        // Cerrar sidebar en móvil
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('active');
        }
    }

    loadPlaceholder(section) {
        const content = document.getElementById('contentArea');
        content.innerHTML = `
            <div class="card">
                <div class="card-body text-center">
                    <i class="fas fa-tools" style="font-size: 3rem; color: var(--gray-400); margin-bottom: var(--space-4);"></i>
                    <h3>Módulo en Desarrollo</h3>
                    <p style="color: var(--gray-600);">El módulo <strong>${section}</strong> estará disponible próximamente.</p>
                    <p style="color: var(--gray-500); font-size: 0.875rem;">MVP enfocado en el flujo de ventas</p>
                </div>
            </div>
        `;
    }

    // ===== DASHBOARD =====

    async loadDashboard() {
        try {
            const dashboardData = await this.apiCall('/dashboard');
            
            document.getElementById('contentArea').innerHTML = `
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <div class="kpi-title">Ventas del Mes</div>
                            <div class="kpi-icon" style="background: linear-gradient(135deg, var(--success) 0%, #34d399 100%);">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                        </div>
                        <div class="kpi-value">$${dashboardData.data.kpis.ventasMes.toLocaleString('es-MX')}</div>
                        <div class="kpi-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+12.5%</span>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <div class="kpi-title">Pedidos Pendientes</div>
                            <div class="kpi-icon" style="background: linear-gradient(135deg, var(--warning) 0%, #fbbf24 100%);">
                                <i class="fas fa-clock"></i>
                            </div>
                        </div>
                        <div class="kpi-value">${dashboardData.data.kpis.pedidosPendientes}</div>
                        <div class="kpi-change">
                            <span>Requieren atención</span>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <div class="kpi-title">Clientes Activos</div>
                            <div class="kpi-icon" style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="kpi-value">${dashboardData.data.kpis.clientesActivos}</div>
                        <div class="kpi-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+5.2%</span>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <div class="kpi-title">Productos en Stock</div>
                            <div class="kpi-icon" style="background: linear-gradient(135deg, var(--info) 0%, #0891b2 100%);">
                                <i class="fas fa-box"></i>
                            </div>
                        </div>
                        <div class="kpi-value">${dashboardData.data.kpis.productosStock}</div>
                        <div class="kpi-change">
                            <span>Stock saludable</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-chart-bar"></i>
                                Productos Más Vendidos
                            </h3>
                        </div>
                        <div class="card-body">
                            <div id="topProductosChart" style="height: 300px;">
                                ${dashboardData.data.topProductos.map(item => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-3) 0; border-bottom: 1px solid var(--gray-100);">
                                        <span style="font-weight: 500;">${item.producto}</span>
                                        <span style="color: var(--primary); font-weight: 600;">${item.cantidad} kg</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="fas fa-calendar-alt"></i>
                                Actividad Reciente
                            </h3>
                        </div>
                        <div class="card-body">
                            <div style="space-y: var(--space-4);">
                                <div style="display: flex; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--gray-100);">
                                    <div style="width: 8px; height: 8px; background: var(--success); border-radius: 50%; margin-top: 8px;"></div>
                                    <div>
                                        <div style="font-weight: 500;">Nuevo pedido creado</div>
                                        <div style="font-size: 0.875rem; color: var(--gray-600);">Cliente: Tortillería La Esperanza</div>
                                        <div style="font-size: 0.75rem; color: var(--gray-500);">Hace 2 horas</div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--gray-100);">
                                    <div style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; margin-top: 8px;"></div>
                                    <div>
                                        <div style="font-weight: 500;">Cliente visitado</div>
                                        <div style="font-size: 0.875rem; color: var(--gray-600);">Molinos del Valle</div>
                                        <div style="font-size: 0.75rem; color: var(--gray-500);">Hace 4 horas</div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: var(--space-3); padding: var(--space-3) 0;">
                                    <div style="width: 8px; height: 8px; background: var(--warning); border-radius: 50%; margin-top: 8px;"></div>
                                    <div>
                                        <div style="font-weight: 500;">Stock bajo detectado</div>
                                        <div style="font-size: 0.875rem; color: var(--gray-600);">Harina de Maíz Nixtamalizada</div>
                                        <div style="font-size: 0.75rem; color: var(--gray-500);">Hace 6 horas</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${this.user?.rol === 'gerente_ventas' || this.user?.rol === 'admin' ? `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-map-marked-alt"></i>
                            Mapa de Clientes y Vendedores
                        </h3>
                    </div>
                    <div class="card-body">
                        <div id="dashboardMap" style="height: 400px; border-radius: var(--radius-lg);"></div>
                    </div>
                </div>
                ` : ''}
            `;

            // Actualizar badge de pedidos
            document.getElementById('pedidosBadge').textContent = dashboardData.data.kpis.pedidosPendientes;

            // Inicializar mapa si es gerente
            if (this.user?.rol === 'gerente_ventas' || this.user?.rol === 'admin') {
                setTimeout(() => this.initDashboardMap(), 100);
            }

        } catch (error) {
            console.error('Error cargando dashboard:', error);
            throw error;
        }
    }

    async initDashboardMap() {
        try {
            const mapContainer = document.getElementById('dashboardMap');
            if (!mapContainer || this.map) return;

            this.map = L.map('dashboardMap').setView([19.4326, -99.1332], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            // Obtener clientes para mostrar en el mapa
            const clientes = await this.apiCall('/clientes');
            
            clientes.data.forEach(cliente => {
                if (cliente.latitud && cliente.longitud) {
                    const marker = L.marker([cliente.latitud, cliente.longitud]).addTo(this.map);
                    marker.bindPopup(`
                        <div style="font-weight: 600; margin-bottom: 4px;">${cliente.nombre}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.contacto}</div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.ciudad}, ${cliente.estado}</div>
                        <div style="font-size: 0.875rem; color: var(--primary);">Vendedor: ${cliente.vendedor?.nombre || 'N/A'}</div>
                    `);
                }
            });

            // Ajustar vista para mostrar todos los marcadores
            if (clientes.data.length > 0) {
                const group = new L.featureGroup(this.map._layers);
                this.map.fitBounds(group.getBounds().pad(0.1));
            }

        } catch (error) {
            console.error('Error inicializando mapa:', error);
        }
    }

    // ===== CLIENTES =====

    async loadClientes() {
        try {
            const clientes = await this.apiCall('/clientes');
            
            document.getElementById('contentArea').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
                    <div>
                        <h2 style="margin: 0; margin-bottom: var(--space-1);">Gestión de Clientes</h2>
                        <p style="color: var(--gray-600); margin: 0;">Total: ${clientes.data.length} clientes</p>
                    </div>
                    <button class="btn btn-primary" onclick="trigalCRM.showClienteForm()">
                        <i class="fas fa-plus"></i>
                        Nuevo Cliente
                    </button>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 class="card-title">
                                <i class="fas fa-users"></i>
                                Lista de Clientes
                            </h3>
                            <div style="display: flex; gap: var(--space-3);">
                                <input type="text" id="clientesSearch" class="form-input" placeholder="Buscar clientes..." style="width: 250px;">
                                <button class="btn btn-secondary" onclick="trigalCRM.showClientesMap()">
                                    <i class="fas fa-map"></i>
                                    Ver Mapa
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="padding: 0;">
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Contacto</th>
                                        <th>Ubicación</th>
                                        <th>Vendedor</th>
                                        <th>Tipo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="clientesTableBody">
                                    ${clientes.data.map(cliente => `
                                        <tr>
                                            <td>
                                                <div style="font-weight: 600;">${cliente.nombre}</div>
                                                <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.email}</div>
                                            </td>
                                            <td>
                                                <div>${cliente.contacto}</div>
                                                <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.telefono}</div>
                                            </td>
                                            <td>
                                                <div>${cliente.ciudad}, ${cliente.estado}</div>
                                                <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.codigo_postal}</div>
                                            </td>
                                            <td>
                                                <div style="font-weight: 500;">${cliente.vendedor?.nombre || 'Sin asignar'} ${cliente.vendedor?.apellido || ''}</div>
                                            </td>
                                            <td>
                                                <span class="badge ${cliente.tipo === 'mayorista' ? 'badge-success' : cliente.tipo === 'distribuidor' ? 'badge-primary' : 'badge-secondary'}">
                                                    ${cliente.tipo || 'Regular'}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="badge ${cliente.activo ? 'badge-success' : 'badge-error'}">
                                                    ${cliente.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style="display: flex; gap: var(--space-2);">
                                                    <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showClienteDetail(${cliente.id})" title="Ver detalle">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn btn-sm btn-primary" onclick="trigalCRM.createPedidoFromCliente(${cliente.id})" title="Crear pedido">
                                                        <i class="fas fa-shopping-cart"></i>
                                                    </button>
                                                    <button class="btn btn-sm btn-success" onclick="trigalCRM.registrarVisita(${cliente.id})" title="Registrar visita">
                                                        <i class="fas fa-map-marker-alt"></i>
                                                    </button>
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

            // Añadir CSS para badges
            if (!document.getElementById('badgeStyles')) {
                const badgeCSS = document.createElement('style');
                badgeCSS.id = 'badgeStyles';
                badgeCSS.textContent = `
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        padding: 0.25rem 0.5rem;
                        font-size: 0.75rem;
                        font-weight: 600;
                        border-radius: 9999px;
                        text-transform: uppercase;
                        letter-spacing: 0.025em;
                    }
                    .badge-success { background: var(--success); color: white; }
                    .badge-primary { background: var(--primary); color: white; }
                    .badge-secondary { background: var(--gray-500); color: white; }
                    .badge-warning { background: var(--warning); color: white; }
                    .badge-error { background: var(--error); color: white; }
                `;
                document.head.appendChild(badgeCSS);
            }

            // Búsqueda en tiempo real
            document.getElementById('clientesSearch').addEventListener('input', (e) => {
                this.filterClientes(e.target.value, clientes.data);
            });

        } catch (error) {
            console.error('Error cargando clientes:', error);
            throw error;
        }
    }

    filterClientes(searchTerm, clientesData) {
        const tbody = document.getElementById('clientesTableBody');
        const filteredClientes = clientesData.filter(cliente => 
            cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
        );

        tbody.innerHTML = filteredClientes.map(cliente => `
            <tr>
                <td>
                    <div style="font-weight: 600;">${cliente.nombre}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.email}</div>
                </td>
                <td>
                    <div>${cliente.contacto}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.telefono}</div>
                </td>
                <td>
                    <div>${cliente.ciudad}, ${cliente.estado}</div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">${cliente.codigo_postal}</div>
                </td>
                <td>
                    <div style="font-weight: 500;">${cliente.vendedor?.nombre || 'Sin asignar'} ${cliente.vendedor?.apellido || ''}</div>
                </td>
                <td>
                    <span class="badge ${cliente.tipo === 'mayorista' ? 'badge-success' : cliente.tipo === 'distribuidor' ? 'badge-primary' : 'badge-secondary'}">
                        ${cliente.tipo || 'Regular'}
                    </span>
                </td>
                <td>
                    <span class="badge ${cliente.activo ? 'badge-success' : 'badge-error'}">
                        ${cliente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: var(--space-2);">
                        <button class="btn btn-sm btn-secondary" onclick="trigalCRM.showClienteDetail(${cliente.id})" title="Ver detalle">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="trigalCRM.createPedidoFromCliente(${cliente.id})" title="Crear pedido">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn btn-sm btn-success" onclick="trigalCRM.registrarVisita(${cliente.id})" title="Registrar visita">
                            <i class="fas fa-map-marker-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Continúa en la siguiente parte...
    
    // ===== UTILIDADES =====

    async apiCall(endpoint, options = {}) {
        const url = `${this.API_BASE}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            ...options
        };

        const response = await fetch(url, config);
        
        if (response.status === 401) {
            this.logout();
            throw new Error('Sesión expirada');
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en la petición');
        }

        return data;
    }

    showModal(title, body, footer = '') {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = body;
        document.getElementById('modalFooter').innerHTML = footer;
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : type === 'warning' ? 'var(--warning)' : 'var(--primary)'};
            color: white;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
            margin-bottom: var(--space-2);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: var(--space-3);
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.getElementById('toastContainer').appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// CSS para animaciones de toast
const toastCSS = document.createElement('style');
toastCSS.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(toastCSS);

// Inicializar aplicación
const trigalCRM = new TrigalCRM();
