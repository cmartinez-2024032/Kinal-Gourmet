# 🍽️ Kinal Gourmet House

Sistema de gestión de restaurantes con autenticación JWT, roles diferenciados y API REST completa.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación del Proyecto](#-instalación-del-proyecto)
- [Configuración del Servicio de Autenticación](#-configuración-del-servicio-de-autenticación)
- [Configuración de la API Principal](#-configuración-de-la-api-principal)
- [Configuración del Frontend](#-configuración-del-frontend)
- [Prueba de Endpoints con Postman](#-prueba-de-endpoints-con-postman)
- [Roles y Permisos](#-roles-y-permisos)
- [Funciones por Rol](#-funciones-por-rol)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado y en ejecución:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [pgAdmin](https://www.pgadmin.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js + pnpm](https://pnpm.io/)
- [Postman](https://www.postman.com/)

---

## 📦 Instalación del Proyecto

```bash
# 1. Crear la carpeta del proyecto en disco local C:
mkdir C:\Kinal-Gourmet-House

# 2. Entrar a la carpeta
cd C:\Kinal-Gourmet-House

# 3. Clonar el repositorio
git clone https://github.com/jrealiquez-2021549/Kinal-Gourmet-House.git

# 4. Ingresar al proyecto clonado
cd Kinal-Gourmet-House

# 5. Abrir en Visual Studio Code
code .
```

> 💡 **Tip:** Dentro de VS Code, abre **2 terminales separadas**: una para autenticación y otra para la API principal.

---

## 🔐 Configuración del Servicio de Autenticación

> Usar la **Terminal 1**

```bash
# 1. Ir a la carpeta de autenticación
cd AuthRestaurante

# 2. Instalar dependencias
pnpm install nodemon
pnpm add -D cross-env

# 3. Levantar el contenedor de PostgreSQL
docker run -d --name restaurante-postgres \
  -e POSTGRES_DB=KGourmetAuth \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=admin \
  -p 5436:5432 postgres:16

# 4. Verificar en Docker Desktop que el contenedor esté activo

# 5. Levantar los servicios con Docker Compose
docker compose up -d

# 6. Correr el servidor de autenticación
pnpm run dev
```

### Probar la Autenticación en Postman

**Carpeta: `FuncionesUsuario - Registrar`**

| Paso | Acción |
|------|--------|
| 1 | Regístrate con tu correo, nombre y contraseña |
| 2 | Verifica tu cuenta con el token recibido por correo (solo el fragmento después de `verify/`) |
| 3 | Inicia sesión y copia tu token |
| 4 | Para cambiar contraseña: en Authorization → Bearer Token, pega tu token e ingresa la contraseña actual y la nueva |

**Carpeta: `FuncionesAdmin - Login`**

| Paso | Acción |
|------|--------|
| 1 | Inicia sesión con las credenciales del Admin General (creado automáticamente) |
| 2 | Crea un Admin de Restaurante usando el token del Admin General como Bearer Token |
| 3 | Inicia sesión con las credenciales del Admin de Restaurante y copia su token |

**Carpeta: `CambiarContrasena - Cualquier rol`**

Agrega tu token en Authorization → Bearer Token, luego ingresa tu contraseña actual y la nueva.

---

## 🚀 Configuración de la API Principal

> Usar la **Terminal 2**

```bash
# 1. Ir a la carpeta correcta
cd C:\Kinal-Gourmet-House\Kinal-Gourmet-House\Kinal-Gourmet-House

# 2. Instalar dependencias
pnpm install nodemon
pnpm add axios

# 3. Correr la API
pnpm run dev
```

---

## 🖥️ Configuración del Frontend

> Abrir una **tercera terminal** o una nueva dentro de VS Code

```bash
# 1. Ir a la carpeta del frontend
cd Frontend-restaurante

# 2. Instalar dependencias
pnpm install

# 3. Iniciar el servidor de desarrollo
pnpm run dev
```

---

## 📬 Prueba de Endpoints con Postman

Importa la colección desde la carpeta `ArchivoJSONpostMan`:

1. Abre Postman
2. Haz clic en **Import**
3. Selecciona el archivo `Kinal-Gourmet-House.postman_collection`

> ⚠️ **Importante:** Cada petición protegida requiere un Bearer Token según el rol correspondiente.

---

## 👥 Roles y Permisos

| Rol | Acceso |
|-----|--------|
| `ADMIN_GENERAL` | Solo endpoints de Admin General |
| `ADMIN_RESTAURANTE` | Solo endpoints de su rol |
| `CLIENTE` | Solo endpoints de cliente |

> 🔑 El token se obtiene **únicamente al iniciar sesión** y debe enviarse como **Bearer Token** en la sección de Authorization de cada petición.

---

## 📖 Funciones por Rol

### 🔴 Admin General

**Función principal:** Crear restaurantes.

```
POST → Crear Restaurante
Authorization: Bearer <token_admin_general>
```

---

### 🟡 Admin de Restaurante

| Función | Método | Descripción |
|---------|--------|-------------|
| Agregar Mesa | `POST` | Registra una nueva mesa |
| Agregar Platillo | `POST` | Añade un platillo al menú |
| Crear Cupón | `POST` | Genera un cupón de descuento |
| Crear Factura | `POST` | Emite una factura |

> Todas las peticiones requieren: `Authorization: Bearer <token_admin_restaurante>`

---

### 🟢 Cliente

| Función | Método | Descripción |
|---------|--------|-------------|
| Hacer Reseña | `POST` | Escribe una reseña |
| Listar Platillos | `GET` | Consulta el menú disponible |
| Crear Pedido / Orden | `POST` | Realiza un pedido |

> Todas las peticiones requieren: `Authorization: Bearer <token_cliente>`

---

<p align="center">
  Desarrollado con ❤️ para <strong>Kinal Gourmet House</strong>
</p>
