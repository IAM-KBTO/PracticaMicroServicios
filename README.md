# 📚 Sistema de Librería - Arquitectura de Microservicios

Este proyecto implementa un backend escalable separado en dos microservicios síncronos comunicados vía HTTP (REST).

## 🚀 Arquitectura
* **Catálogo API (Puerto 3001):** Gestiona el inventario y la persistencia del stock.
* **Órdenes API (Puerto 3002):** Procesa la lógica de negocio, validación de inventario y facturación.

## 🛠️ Tecnologías
* Node.js + Express
* Axios (Comunicación Inter-servicios)

## 📦 Instalación y Ejecución
1. Abrir terminal en `/servicio-catalogo` -> `npm install` -> `node index.js`
2. Abrir terminal en `/servicio-ordenes` -> `npm install` -> `node index.js`

## 🔗 Endpoints Principales
| Método | Endpoint | Microservicio | Descripción |
|---|---|---|---|
| GET | `/api/libros/:id` | Catálogo | Retorna info del libro y stock actual |
| POST | `/api/ordenes` | Órdenes | Genera una compra validando stock cruzado |