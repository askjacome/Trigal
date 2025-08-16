const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware básico
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ruta de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'CRM Trigal funcionando en Azure',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Ruta básica de la API
app.get('/api/info', (req, res) => {
    res.json({
        name: 'CRM Trigal',
        version: '2.0.0',
        description: 'Sistema CRM especializado en productos de maíz',
        platform: 'Microsoft Azure',
        database: 'Azure SQL Server'
    });
});

// Servir el frontend
app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    }
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`🌽 CRM Trigal ejecutándose en Azure - Puerto ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'production'}`);
    console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
});

module.exports = app;
