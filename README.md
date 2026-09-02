# Roommate Splitter - Frontend

Dashboard interactivo y responsivo para dividir gastos entre compañeros de departamento. Aplicación full-stack con autenticación de usuarios, CRUD de gastos y análisis visual en tiempo real.

---

## Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Cómo Correr](#-cómo-correr)
- [Autor](#-autor)

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | Vue 3 (Composition API) | 3.5+ |
| **Build Tool** | Vite | 8.2+ |
| **Estilos** | Tailwind CSS v4 | 4.0+ |
| **Componentes UI** | Daisy UI | Latest |
| **Gráficos** | Chart.js + vue-chartjs | Latest |
| **HTTP Client** | Axios | 1.19+ |
| **Runtime** | Node.js | 20+ |
| **Backend** | Spring Boot 4.1 (Java 21) | - |
| **Base de Datos** | PostgreSQL | 14+ |

---

## Características

### Autenticación
- Login con email y nombre
- Signup
- Sesión persistente con localStorage
- No requiere contraseña (beta)

### Gestión de Gastos
- ✅ Crear gasto (descripción, monto, quién pagó, fecha)
- ✅ Editar gasto en línea
- ✅ Eliminar gasto con confirmación
- ✅ Listar gastos con filtrado por usuario

### Dashboard
- **Estadísticas en tiempo real:**
    - Total gastado
    - Mi aporte
    - Mi balance personal
- **Gráfico de distribución** (Doughnut chart)
- **Resumen de deudas** entre roommates
- Actualización automática al crear/editar/eliminar

### Interfaz
- **Responsive design** (móvil, tablet, desktop)
- **Navbar horizontal** con navegación entre secciones
- **Menú desplegable** (Ayuda, Configuración, Cerrar Sesión)
- **Foto de fondo** en login
- **Componentes reutilizables** y modulares
- **Dark-friendly**: colores contrastados

### Secciones
1. **Dashboard** - Resumen visual de gastos y balances
2. **Mis Gastos** - Tabla completa de gastos (CRUD)
3. **Balances** - Deudas entre compañeros
4. **Reportes** - Próxima feature

---

## Requisitos

- **Node.js** 20+
- **npm** o **yarn**
- **Backend corriendo** en `http://localhost:8080`
- **PostgreSQL** configurada (en el backend)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/agus25varela/roommate-splitter-frontend.git
cd roommate-splitter-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

---

## Cómo Correr

### Desarrollo Local

```bash
npm run dev
```

La aplicación abre en `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

Genera los archivos optimizados en `dist/`

---

## Próximas Features

- [ ] Exportar gastos a CSV
- [ ] Dark mode
- [ ] Autenticación JWT
- [ ] Multi-idioma (ES/EN)
- [ ] Notificaciones de deudas
- [ ] Historial de cambios
- [ ] Reportes PDF
- [ ] Integración con Stripe para pagos

---

## Autor

**Agustina Varela**
- GitHub: [@agus25varela](https://github.com/agus25varela)