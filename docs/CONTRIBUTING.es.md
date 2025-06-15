# Guía de Contribución

¡Gracias por tu interés en contribuir a **Aviation Integration Service**!  
Sigue estas reglas para asegurar calidad y coherencia en el proyecto.

---

## Flujo de trabajo

1. **Forkea** el repositorio y clona tu copia local.
2. Crea una **branch** para tu mejora o corrección:
   ```bash
   git checkout -b feature/nombre-tu-feature
   ```
3. Haz **commits pequeños y descriptivos** usando [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):
   - Ejemplo:
     - `feat: agrega endpoint de vuelos`
     - `fix: corrige validación en airlines`
     - `docs: actualiza el README`
     - `chore: actualiza dependencias`
     - Usa `!` para cambios mayores: `refactor!: elimina compatibilidad anterior`
4. Sigue la convención de nombres para ramas:
   - `feature/` para nuevas funcionalidades.
   - `fix/` para correcciones.
   - `docs/` para documentación.
   - `chore/` para tareas menores o de mantenimiento.
   - `release/vX.Y.Z` para preparar un nuevo release.
5. **Haz Pull Request a `develop`**.
   - No envíes cambios directamente a `master`.
6. Espera la revisión y realiza los cambios sugeridos.
7. Para **liberar una nueva versión de producción:**
   - Crea una rama `release/vX.Y.Z` desde `develop` (elige la nueva versión según los cambios).
   - Haz Pull Request de `release/vX.Y.Z` a `master`.  
     (No olvides documentar cambios en el PR.)
   - Al hacer merge, se generará automáticamente un tag `vX.Y.Z` y se desplegará el release en producción.
   - Si nombras la rama solo `release/`, el sistema incrementará el último patch automáticamente (ejemplo: de `v1.2.3` a `v1.2.4`).
8. Nunca subas tu archivo `.env` real ni credenciales.

---

**Nota:**  
La protección de ramas impide pushear directo a `master` y requiere PRs para cualquier cambio en producción. El deploy solo se ejecuta al subir un nuevo tag que empieza con `v`.

---

## Estilo de código

- Usa **TypeScript** y sigue la arquitectura de carpetas del repo.
- Ejecuta `npm run lint` (si existe) antes de hacer commit.
- Usa comillas simples (`'`) y punto y coma (`;`).
- Mantén los métodos y archivos **pequeños y bien comentados**.

---

## 🧪 Pruebas Automáticas

Antes de enviar un PR, asegúrate de:

- Ejecutar **todas las pruebas** con:

  ```bash
  make test
  ```

- Verificar que no queden handles abiertos o conexiones sin cerrar.
- Si agregaste nuevos endpoints o validaciones, incluye pruebas:
  - Unitarias (`/test/unit`)
  - De integración (`/test/integration`)

> ⚠️ Los PRs sin pruebas nuevas (cuando se agregan funcionalidades) serán rechazados.

---

## 🧼 Código limpio y mantenible

- Evita lógica compleja en controladores, delega a servicios.
- Prefiere funciones puras y desacopladas, fáciles de testear.
- Agrega comentarios solo si el código no se explica por sí mismo.
- No dejes `console.log`; usa `logger.debug/info/error`.

---

## Políticas de ramas y protección

- **No se permite pushear directamente** a `master` ni a ramas protegidas (`master`, `develop`, `releases`).
- **Todos los cambios** en `master` requieren Pull Request y aprobación de al menos 1 revisor.
- **Los tests automáticos** deben pasar para poder hacer merge.
- **No se permiten** force-push (`--force`) ni eliminar ramas protegidas.
- **Para actualizar tu rama:** haz **rebase** o **merge** desde `develop` antes de abrir el PR hacia `master`.
- **Ramas de release:** usa el patrón `release/vX.Y.Z` y haz PR contra `master` para despliegue.
- Solo los **tags** con formato `vX.Y.Z` activan el workflow de producción.

---

## Revisión de Pull Requests

- Los PRs serán revisados por al menos un colaborador.
- **No se aceptan cambios sin justificación** clara o sin pruebas automáticas (si aplica).
- Si tu cambio rompe los tests, se rechazará hasta corregirlo.

---

## Seguridad

- No subas archivos `.env` ni secretos.
- Usa las variables de entorno según la plantilla `.env.example`.

---

## Proceso de despliegue

- **Deploy automático (recomendado):**

  - El despliegue a producción se realiza **solo al crear un tag tipo `vX.Y.Z`** en GitHub.
  - El flujo recomendado es:
    1. Trabaja en branches feature y mergea a `develop`.
    2. Cuando esté listo el release, crea una rama `release/vX.Y.Z` desde `develop`.
    3. Haz Pull Request de `release/vX.Y.Z` a `master`.
    4. Una vez aprobado y mergeado el PR a `master`, **crea el tag** (`vX.Y.Z`) apuntando a `master`.
    5. Al pushear el tag, **GitHub Actions despliega automáticamente** a Cloud Run usando el secreto `GCP_SA_KEY`.

- **Deploy manual (opcional):**

  1. Consigue una key de servicio (JSON) con permisos de `Cloud Run Admin`, `Storage Admin` y `Cloud Build`.
  2. Autentica localmente:
     ```bash
     gcloud auth activate-service-account --key-file gcp-key.json
     ```
  3. Lanza el deploy manual:
     ```bash
     make deploy
     ```

- **Importante:**  
  No hagas deploy directo a producción fuera de este flujo.  
  El pipeline solo se ejecuta para tags que sigan el patrón `v*` (por ejemplo: `v1.0.0`).

---

¡Gracias por ayudar a mejorar este proyecto!
