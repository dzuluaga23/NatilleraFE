# 💰 NatilleraFE

### Plataforma web para la gestión de una natillera

**NatilleraFE** es la aplicación frontend de una plataforma diseñada para digitalizar y centralizar la administración de una **natillera**.

La aplicación proporciona una interfaz web desde la cual los usuarios pueden interactuar con las diferentes funcionalidades del sistema, mientras que la lógica de negocio y la persistencia de información son gestionadas por una API REST desarrollada con **ASP.NET Core**.

El proyecto hace parte de una solución **Full-Stack**, junto con [`NatilleraBE`](https://github.com/dzuluaga23/NatilleraBE).

---

## 🌐 Demo

### 🚀 Aplicación en producción

**https://natillera-fe.vercel.app**

La aplicación se encuentra desplegada utilizando **Vercel**, permitiendo acceder al sistema directamente desde un navegador.

---

## 💡 ¿Qué es Natillera?

Una natillera requiere administrar constantemente información financiera y de sus participantes.

Entre otras cosas, se deben controlar:

* 👥 Socios
* 💰 Aportes
* 💳 Préstamos
* 💵 Pagos
* 🧾 Abonos
* 📈 Intereses
* 🏦 Información bancaria
* 🎯 Pollas
* 🔐 Usuarios y permisos

**NatilleraFE busca convertir este proceso en una experiencia digital**, proporcionando una interfaz centralizada para consultar y gestionar la información de la natillera.

---

# ✨ Características

## 👥 Gestión de socios

Interfaz para trabajar con la información de los integrantes de la natillera.

```text
Socios
 ├── Consultar
 ├── Registrar
 ├── Actualizar
 └── Gestionar información
```

---

## 💳 Gestión financiera

La aplicación está preparada para interactuar con las operaciones financieras proporcionadas por el backend.

Entre ellas:

* Préstamos
* Pagos
* Abonos
* Intereses
* Movimientos bancarios

Esto permite visualizar y administrar diferentes operaciones desde una misma aplicación.

---

## 🔐 Autenticación

El frontend se integra con el sistema de autenticación proporcionado por el backend.

El flujo general es:

```text
Usuario
   │
   ▼
Inicio de sesión
   │
   ▼
API REST
   │
   ▼
JWT
   │
   ▼
Acceso a funcionalidades protegidas
```

De esta manera, las funcionalidades del sistema pueden estar restringidas dependiendo de la autenticación y autorización del usuario.

---

# 🧠 Arquitectura Full-Stack

NatilleraFE funciona como la capa de presentación de una arquitectura cliente-servidor.

```text
                         👤 USUARIO
                              │
                              ▼
                  ┌─────────────────────┐
                  │     NatilleraFE     │
                  │                     │
                  │    React + Vite     │
                  │                     │
                  │   Interfaz Web      │
                  └──────────┬──────────┘
                             │
                        HTTP / JSON
                             │
                             ▼
                  ┌─────────────────────┐
                  │     NatilleraBE     │
                  │                     │
                  │   ASP.NET Core API  │
                  │                     │
                  │ Business Logic      │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │     SQL Server      │
                  │                     │
                  │    Base de datos    │
                  └─────────────────────┘
```

Esta separación permite que la interfaz, la lógica de negocio y la persistencia de datos sean independientes.

---

# 🛠️ Tecnologías

| Tecnología        | Utilización                       |
| ----------------- | --------------------------------- |
| ⚛️ **React**      | Construcción de la interfaz       |
| ⚡ **Vite**        | Desarrollo y compilación          |
| 🟨 **JavaScript** | Lógica de la aplicación           |
| 🎨 **CSS**        | Diseño y estilos                  |
| 🔌 **REST API**   | Comunicación con el backend       |
| 🧹 **ESLint**     | Calidad y consistencia del código |
| ▲ **Vercel**      | Despliegue                        |

El proyecto utiliza la configuración de React sobre Vite y ESLint para el desarrollo.

---

# 📁 Estructura

```text
NatilleraFE/
│
├── public/
│   └── Recursos públicos
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

La estructura principal del repositorio actualmente está organizada alrededor de `src` y `public`, junto con la configuración de Vite, ESLint y npm.

---

# 🚀 Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/dzuluaga23/NatilleraFE.git
```

## 2. Entrar al proyecto

```bash
cd NatilleraFE
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

---

# 🔌 Conexión con el Backend

NatilleraFE necesita comunicarse con **NatilleraBE** para realizar las operaciones del sistema.

Backend:

```text
https://github.com/dzuluaga23/NatilleraBE
```

La comunicación sigue el modelo:

```text
React
  │
  │ HTTP Request
  ▼
ASP.NET Core
  │
  │ Business Logic
  ▼
Entity Framework Core
  │
  ▼
SQL Server
```

Por lo tanto, para ejecutar completamente el sistema en local, es necesario tener disponible tanto el frontend como el backend.

---

# 📦 Scripts

```bash
# Ejecutar entorno de desarrollo
npm run dev

# Generar build de producción
npm run build

# Previsualizar build
npm run preview

# Analizar el código con ESLint
npm run lint
```

---

# 🌍 Despliegue

El proyecto está desplegado en **Vercel**.

### Producción

🚀 **https://natillera-fe.vercel.app**

Esto permite acceder a la aplicación sin necesidad de ejecutar el proyecto localmente.

---

# 🔄 Flujo de una operación

Por ejemplo, cuando un usuario realiza una operación desde la interfaz:

```text
👤 Usuario
   │
   │ Interacción
   ▼
⚛️ React
   │
   │ HTTP Request
   ▼
🔐 API
   │
   ▼
🧠 Lógica de negocio
   │
   ▼
🗄️ SQL Server
   │
   │ Resultado
   ▼
🔌 API
   │
   │ JSON Response
   ▼
⚛️ React
   │
   ▼
👤 Usuario
```

El frontend se encarga principalmente de **presentar la información y gestionar la interacción del usuario**, mientras que las operaciones de negocio permanecen en el backend.

---

# 🎯 Objetivos del proyecto

NatilleraFE fue desarrollado con el objetivo de construir una aplicación web capaz de interactuar con una API REST y ofrecer una experiencia centralizada para la administración de una natillera.

El proyecto permite poner en práctica:

* Desarrollo de interfaces con React.
* Componentización.
* Consumo de APIs REST.
* Manejo de solicitudes HTTP.
* Integración frontend-backend.
* Manejo de autenticación.
* Gestión de información dinámica.
* Organización de proyectos frontend.
* Desarrollo y despliegue de aplicaciones web.
* Integración con un backend desarrollado en ASP.NET Core.

---

# 🧩 Proyecto Full-Stack

NatilleraFE no funciona como un proyecto aislado.

Forma parte de una solución compuesta por:

### 🎨 Frontend

**NatilleraFE**

React + Vite

```text
https://github.com/dzuluaga23/NatilleraFE
```

### ⚙️ Backend

**NatilleraBE**

ASP.NET Core + Entity Framework Core + SQL Server + JWT

```text
https://github.com/dzuluaga23/NatilleraBE
```

### 🏗️ Arquitectura

```text
             NATILLERA
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   NatilleraFE       NatilleraBE
        │                 │
        │ HTTP            │
        └────────────────►│
                          │
                          ▼
                     SQL Server
```

---

# 💻 ¿Qué demuestra este proyecto?

NatilleraFE demuestra experiencia práctica construyendo una aplicación frontend que no se limita a mostrar contenido estático.

El proyecto requiere integrar una interfaz web con una API externa y trabajar con información que proviene de una capa de backend.

En conjunto con NatilleraBE, representa experiencia en:

```text
          FRONTEND
             │
        React + Vite
             │
             ▼
        REST / JSON
             │
             ▼
          BACKEND
             │
      ASP.NET Core
             │
             ▼
        SQL Server
```

Esto convierte al proyecto en una demostración práctica de desarrollo **Full-Stack**.

---

# 🔗 Repositorios relacionados

### 🎨 Frontend

https://github.com/dzuluaga23/NatilleraFE

### ⚙️ Backend

https://github.com/dzuluaga23/NatilleraBE

### 🚀 Aplicación

https://natillera-fe.vercel.app

---

# 👨‍💻 Autor

## David Zuluaga

**Software Developer | Full-Stack Developer**

Desarrollador interesado en la construcción de aplicaciones web, desarrollo backend y creación de soluciones de software.

### GitHub

https://github.com/dzuluaga23

---

## 📄 Licencia

Proyecto desarrollado con fines académicos y de aprendizaje.
