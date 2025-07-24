#  Vault API – Almacenamiento Seguro de Documentos

Esta API forma parte de un sistema que permite a los usuarios almacenar, cifrar y compartir documentos de forma segura. La idea es simple: subir tus archivos, acceder a ellos cuando los necesites y compartirlos con otros, sabiendo que están cifrados y protegidos.

El objetivo no es solo subir PDFs. Queremos que cada documento esté vinculado a un usuario, que puedas controlar quién puede verlo o descargarlo, y que la seguridad no sea un “plus”, sino el estándar.

## ¿Qué puedes hacer con esta API?

- **Subir documentos** que serán almacenados en S3 (AWS) y registrados en la base de datos.
- **Ver tus documentos** y descargar solo los que te pertenecen o te han sido compartidos.
- **Eliminar documentos** propios.
- **Compartir documentos** con otros usuarios asignando permisos personalizados (como solo lectura o descarga).
- **Panel de admin** (en progreso): estadísticas, espacio usado, control de acceso y más.

Todo esto mientras mantenemos un enfoque en **seguridad**, **roles**, **cifrado de rutas** y un backend limpio con buenas prácticas.

---

## 🧩 Tecnologías

- **Node.js + Express** – Lógica de negocio clara y modular.
- **Prisma ORM + PostgreSQL** – Base de datos robusta y tipada.
- **AWS S3** – Almacenamiento real en la nube.
- **Jest** – Tests unitarios y de integración.
- **Zod** – Validación de entrada.
- **Crypto** – Cifrado AES para rutas y claves.
- **Middleware de roles y permisos** – Porque no todos deben acceder a todo.

---

## 📦 Endpoints principales

| Método | Ruta                          | Descripción                              |
|--------|-------------------------------|------------------------------------------|
| `POST` | `/api/documents`             | Subir un archivo                         |
| `GET`  | `/api/documents`             | Listar mis archivos                      |
| `GET`  | `/api/documents/:id/download`| Descargar archivo propio o compartido    |
| `DELETE`| `/api/documents/:id`        | Eliminar documento propio                |
| `POST` | `/api/documents/:id/share`   | Compartir documento con permisos         |
| `GET`  | `/api/documents/shared-with-me` | Ver archivos compartidos conmigo     |

Próximamente:
- `/api/admin/dashboard/summary`
- `/api/admin/users`
- `/api/admin/documents`
- `/api/admin/permissions`

---

## 🛠️ Cómo levantar el proyecto

```bash
git clone https://github.com/tuusuario/vault-api.git
cd vault-api
npm install
cp .env.example .env
# Configura tus credenciales de AWS, DB y clave de cifrado en .env
npx prisma migrate dev --name init
npm run dev
