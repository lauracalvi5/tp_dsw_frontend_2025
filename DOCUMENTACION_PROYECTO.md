# ParkEasy — Documentación del Proyecto Frontend

## Información General del Proyecto

**Nombre del Proyecto:** ParkEasy - Sistema de Gestión de Estacionamientos  
**Tipo:** Aplicación Web Frontend  
**Tecnología Principal:** React 19.0.0-rc.1  
**Framework de Build:** Vite 6.3.5  
**Fecha de Documentación:** Octubre 2025  
**Repositorio:** tp_dsw_frontend_2025  


## Descripción del Proyecto

**ParkEasy** es una aplicación web diseñada para facilitar la gestión y reserva de espacios de estacionamiento en tiempo real. El sistema ofrece dos tipos de experiencias diferenciadas:

### Usuarios Clientes
- Búsqueda y visualización de estacionamientos disponibles en un mapa interactivo.
- Reserva de cocheras con cálculo automático de precios.
- Gestión de vehículos personales.
- Historial de reservas.
- Chat de soporte en tiempo real.

### Usuarios Administradores
- Gestión completa de estacionamientos (crear, editar, eliminar).
- Administración de cocheras ocupadas.
- Liberación manual de espacios.
- Monitoreo de reservas activas.
- Atención de consultas mediante chat.

---

## Arquitectura y Tecnologías

### Stack Tecnológico Principal

**Frameworks y librerías base:**
- React 19.0.0-rc.1  
- React DOM 19.0.0-rc.1  
- React Router DOM 7.8.2  
- Vite 6.3.5  

**UI y Estilos:**
- Bootstrap 5.3.8  
- React Bootstrap 2.10.10  
- Bootstrap Icons 1.13.1  
- React Icons 5.5.0  

**Mapas y Geolocalización:**
- Leaflet 1.9.4  
- React Leaflet 5.0.0-rc.2  

**Comunicación en Tiempo Real:**
- Socket.io-client 4.8.1  


## Estructura del Proyecto

```
tp_dsw_frontend_2025/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── eslint.config.js
├── vite.config.js
├── package.json
├── pnpm-lock.yaml
├── index.html
└── README.md
```

---

## Funcionalidades Principales

### 1. Sistema de Autenticación y Autorización

**Registro, Login y Recuperación de Contraseña:**  
Validaciones con Yup, comunicación con backend, redirección según rol (admin o cliente) y persistencia con localStorage.

**Protección de Rutas:**  
Redirección automática según permisos definidos por JWT.

### 2. Mapa Interactivo con Geolocalización

**Mapa dinámico:**  
Ubicación actual del usuario, marcadores personalizados y filtros por precio, distancia y horarios.  
Uso de APIs Nominatim y Leaflet con React Leaflet.

### 3. Sistema de Reservas

**Reserva de Cocheras:**  
Selección de vehículo, duración, verificación de disponibilidad y confirmación de reserva con actualización en tiempo real.

**Mis Reservas:**  
Historial persistente, cancelación de reservas activas y sincronización con backend.

### 4. Gestión de Vehículos

Listado, creación y eliminación de vehículos asociados al usuario autenticado.

### 5. Panel de Administración

Gestión completa de estacionamientos y cocheras, creación y edición de registros, visualización de disponibilidad y chat de soporte.

### 6. Chat en Tiempo Real

Implementado con Socket.IO Client.  
Comunicación bidireccional.

---

## Módulos y Componentes

**Header Component:**  
Componente global con navegación adaptada al rol del usuario, detección automática de sesión y cierre de sesión sincronizado mediante BroadcastChannel.

---

## Sistema de Autenticación

**Flujo General:**
1. Login con validación backend y almacenamiento de JWT.  
2. Persistencia de sesión en localStorage.  
3. Decodificación de rol desde JWT.  
4. Logout con limpieza de sesión y sincronización entre pestañas mediante BroadcastChannel.

---

## Gestión de Estado

**LocalStorage:**  
Almacena token, usuario, y reservas persistentes.

**Hooks React:**  
`useState`, `useEffect`, `useNavigate`, `useLocation` para control de flujo y sincronización.  
Fetch API y Socket.IO para conexión con backend.

---

## Integración con Backend

**Endpoints principales:**  
- `/usuarios/registro`, `/usuarios/login`, `/usuarios/recuperar`, `/usuarios/resetear`  
- `/estacionamientos`, `/estacionamientos-disponibles`, `/cocheras`, `/vehiculos`, `/tipos-vehiculo`  
- WebSocket para chat (`/message`)

Manejo de errores con estructura estándar `try/catch` y alertas informativas.

---

## Guía de Instalación

**Requisitos:**
- Node.js 16+  
- pnpm o npm  
- Backend activo en `http://localhost:3000`

**Pasos:**
```bash
git clone https://github.com/lauracalvi5/tp_dsw_frontend_2025.git
cd tp_dsw_frontend_2025
pnpm install
pnpm run dev
```

Abrir en navegador: `http://localhost:5173`


## Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "vite build",
  "start": "vite preview",
  "test": "vitest",
  "lint": "eslint 'src/**/*.{js,jsx}'",
  "lint:fix": "eslint --fix 'src/**/*.{js,jsx}'",
  "preview": "vite preview"
}
```



## Roles y Permisos

**Cliente:**  
- Ver mapa, filtrar, reservar cocheras, gestionar vehículos, ver y cancelar reservas, chat.  

**Administrador:**  
- Gestionar estacionamientos y cocheras, liberar manualmente, atender chat, visualizar reservas.

---


## Conclusión

ParkEasy es una solución integral para la gestión de estacionamientos que combina:  
- Interfaz moderna con React y Bootstrap.  
- Mapas interactivos y geolocalización.  
- Seguridad mediante JWT.  
- Comunicación en tiempo real.  
- Diseño responsive optimizado.  

