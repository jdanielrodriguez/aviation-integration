# Guía de Contribución

¡Gracias por tu interés en contribuir a **Aviation Integration Service**!  
Sigue estas reglas para asegurar calidad y coherencia en el proyecto.

---

## Flujo de trabajo

1. **Forkea** el repositorio y clona tu copia local.
2. Crea una **branch** para tu mejora o corrección:
   ```git
   git checkout -b feature/nombre-tu-feature
   ```
3. Haz **commits pequeños y descriptivos**.
4. Sigue la convención de nombres para ramas:
   - `feature/` para nuevas funcionalidades.
   - `fix/` para correcciones.
   - `docs/` para documentación.
   - `chore/` para tareas menores o de mantenimiento.

5. **Haz Pull Request a `develop`**.  
   - No envíes cambios directamente a `master`.

6. Espera la revisión y realiza los cambios sugeridos.

---

## Estilo de código

- Usa **TypeScript** y sigue la arquitectura de carpetas del repo.
- Ejecuta `npm run lint` (si existe) antes de hacer commit.
- Usa comillas simples (`'`) y punto y coma (`;`).
- Mantén los métodos y archivos **pequeños y bien comentados**.

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

- **Deploy automático:** Al hacer merge de un Pull Request de `develop` a `master`, se ejecuta el pipeline de despliegue a Cloud Run mediante GitHub Actions usando el secreto `GCP_SA_KEY`.
- **Deploy manual:**  
  1. Consigue una key de servicio en formato JSON con permisos de `Cloud Run Admin`, `Storage Admin` y `Cloud Build`.
  2. Autentica con:  
     ```bash
     gcloud auth activate-service-account --key-file gcp-key.json
     ```
  3. Lanza el deploy:  
     ```bash
     make deploy
     ```

---

¡Gracias por ayudar a mejorar este proyecto!
