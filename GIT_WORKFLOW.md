# 📘 Guía Oficial y Protocolo de Git para el Equipo
## Estrategia de Ramas, Reglas de Trabajo, Sincronización y Resolución de Conflictos

---

## 📑 Tabla de Contenidos
1. [Diagnóstico y Filosofía de Trabajo](#1-diagnóstico-y-filosofía-de-trabajo)
2. [Estrategia de Ramas y Nomenclatura](#2-estrategia-de-ramas-y-nomenclatura)
3. [Ciclo de Vida Diario Paso a Paso](#3-ciclo-de-vida-diario-paso-a-paso)
4. [Protocolo de Resolución de Conflictos con Rebase](#4-protocolo-de-resolución-de-conflictos-con-rebase)
5. [Políticas de Protección del Repositorio](#5-políticas-de-protección-del-repositorio)
6. [Hoja de Referencia Rápida (Cheat Sheet)](#6-hoja-de-referencia-rápida-cheat-sheet)
7. [Caso Práctico Completo de Principio a Fin](#7-caso-práctico-completo-de-principio-a-fin)

---

## 1. Diagnóstico y Filosofía de Trabajo

### 1.1. Las Causas Principales de los Conflictos y Desorden
* **Ramas de larga duración (*Long-lived branches*)**: Mantener una rama abierta por semanas sin sincronizar con `main` provoca divergencias masivas en el código.
* **Uso de `git pull` tradicional (Merge por defecto)**: Por defecto, `git pull` realiza un merge commit automático que genera commits del tipo *"Merge branch 'main' of..."*, ensuciando el árbol de Git.
* **Commits masivos y desordenados**: Subir decenas de archivos modificados en un solo commit impide revisiones efectivas y dificulta aislar bugs.
* **Trabajo en archivos compartidos sin comunicación**: Tocar archivos transversales (rutas, configuraciones globales, migraciones) sin avisar al equipo.

### 1.2. Principios de Oro del Repositorio
* 🛡️ **La rama `main` es sagrada**: Siempre debe compilar, tener tests pasando y estar lista para desplegarse a producción. Nadie hace `commit` ni `push` directo a `main`.
* ⚡ **Ramas efímeras**: Ninguna rama debe vivir más de 1 a 3 días. Los desarrollos grandes se dividen en entregas pequeñas (*small batch sizes*).
* 🧼 **Historial limpio y lineal**: Se utiliza `rebase` en local antes de subir cambios para evitar ramas cruzadas y commits redundantes.
* 👥 **Revisión obligatoria**: Ningún cambio entra a `main` sin la aprobación de al menos un revisor en Pull Request.

---

## 2. Estrategia de Ramas y Nomenclatura

### 2.1. Arquitectura de Ramas (*Trunk-Based / GitHub Flow*)

```text
[ main ] -----------------●-----------------------●---------> (Siempre estable)
           \             / (Squash & Merge)      /
            ●---●---●---●                       /
           [ feat/auth-login ]                 /
                               \              /
                                ●---●--------●
                               [ fix/header-nav ]
```

* **`main`**: Rama troncal y única rama de larga duración.
* **Ramas de funcionalidad/arreglo**: Ramas efímeras que nacen de `main` y se eliminan inmediatamente tras integrarse.

### 2.2. Nomenclatura Estándar de Ramas
Formato obligatorio: `<prefijo>/<ticket-o-descripcion-corta>` (todo en minúsculas, palabras separadas por guión medio `-`).

| Prefijo | Cuándo se usa | Ejemplo |
| :--- | :--- | :--- |
| `feat/` | Nuevas características o pantallas | `feat/login-google`, `feat/CART-402-pasarela-pago` |
| `fix/` | Corrección de errores en código existente | `fix/error-calculo-iva`, `fix/AUTH-105-token-expirado` |
| `hotfix/` | Arreglos de emergencia directamente para producción | `hotfix/caida-checkout-stripe` |
| `refactor/` | Mejoras o limpieza de código sin cambiar funcionalidad | `refactor/modularizar-servicios-api` |
| `chore/` | Tareas de dependencias, scripts de build o CI/CD | `chore/actualizar-vite-v6` |
| `docs/` | Cambios únicamente en documentación o README | `docs/actualizar-guia-instalacion` |

---

## 3. Ciclo de Vida Diario Paso a Paso

### ⚙️ 3.0. Configuración Global Recomendada (Hacer una sola vez en tu equipo)
Ejecuta esto en tu terminal una sola vez para que Git nunca cree merge commits accidentales al hacer pull:
```bash
git config --global pull.rebase true
git config --global fetch.prune true
git config --global rebase.autoStash true
```

---

### 🟢 3.1. Iniciar una Nueva Tarea
Antes de comenzar a programar, siempre párate en `main` fresco y actualizado:
```bash
# 1. Cambiar a main
git checkout main

# 2. Descargar los últimos cambios del equipo
git pull origin main

# 3. Crear tu rama con el nombre adecuado
git checkout -b feat/nombre-de-tu-tarea
```

---

### 💻 3.2. Desarrollo y Commits Atómicos
Haz commits frecuentes con un alcance claro. Sigue el formato **Conventional Commits**:
* `feat:` Nueva funcionalidad para el usuario.
* `fix:` Corrección de bug.
* `refactor:` Cambio en el código que no corrige bug ni añade feature.
* `test:` Añadir o modificar tests.
* `chore:` Actualización de dependencias, configs, etc.

```bash
# Agregar archivos específicos modificados
git add src/features/auth/login.tsx src/services/auth.ts

# Crear commit con mensaje descriptivo y en tiempo presente
git commit -m "feat(auth): agregar soporte para inicio de sesion con Google OAuth"
```

---

### 🔄 3.3. Sincronización Diaria con `main` (Evitar Divergencias)
Si tus compañeros integraron cambios a `main` mientras trabajabas en tu rama:

> ⚠️ **REGLA DE ORO:** NUNCA ejecutes `git merge main` dentro de tu rama de desarrollo. Usa siempre `rebase`.

```bash
# 1. Descargar lo nuevo de main sin cambiarte de rama
git fetch origin main

# 2. Re-aplicar tus commits por encima de lo nuevo que entró en main
git rebase origin/main
```
*(Si surge un conflicto, sigue el protocolo de la sección 4).*

---

### 🚀 3.4. Subir la Rama al Repositorio Remoto

**Primera vez que subes la rama:**
```bash
git push -u origin feat/nombre-de-tu-tarea
```

**Si ya la habías subido y acabas de hacer un rebase:**
```bash
# Usa --force-with-lease para sobreescribir de forma segura tu propia rama remota
git push --force-with-lease origin feat/nombre-de-tu-tarea
```
*(⚠️ NUNCA uses `git push --force` a secas).*

---

### 📋 3.5. Apertura y Revisión de Pull Request (PR)
1. Ve a GitHub/GitLab y abre el PR hacia `main`.
2. Completa la plantilla de PR:
   * **¿Qué hace este cambio?**
   * **¿Cómo se prueba?**
   * **Capturas o evidencia (si aplica UI)**.
3. Asigna al menos 1 o 2 compañeros de equipo como **Revisores (*Reviewers*)**.
4. Responde comentarios y sube ajustes a la misma rama si es necesario.

---

### 🔀 3.6. Fusión (*Merge*) y Limpieza
* Se realiza la fusión mediante **Squash and Merge** en la interfaz web de GitHub/GitLab.
* Una vez fusionado el PR, elimina la rama tanto en remoto como en local:
```bash
# Regresar a main y actualizar
git checkout main
git pull origin main

# Eliminar la rama local que ya fue integrada
git branch -d feat/nombre-de-tu-tarea
```

---

## 4. Protocolo de Resolución de Conflictos con Rebase

Los conflictos ocurren cuando dos personas editaron las mismas líneas de un archivo. Con `rebase`, los conflictos se resuelven commit por commit de forma limpia.

### Procedimiento Paso a Paso:

```text
1. git fetch origin main
2. git rebase origin/main
      ⬇️
   [¿Hay Conflicto?]
   ├── SI ➔ 1. git status (ver archivos en conflicto)
   │        2. Abrir archivo y resolver manualmente
   │        3. git add <archivo-resuelto>
   │        4. git rebase --continue (NO hacer commit)
   │
   └── NO ➔ Listo para hacer push
```

#### 1. Identificar archivos conflictivos
```bash
git status
```
Verás archivos con el estado `both modified: src/components/Navbar.tsx`.

#### 2. Inspeccionar y resolver en el editor
Abre el archivo con conflicto. Verás los delimitadores de Git:
```typescript
<<<<<<< HEAD (Lo que está actualmente en main)
export const API_URL = "https://api.v2.empresa.com";
=======
export const API_URL = "https://api.v3.empresa.com";
>>>>>>> 9a4f21d (feat: actualizar version del endpoint api)
```
* Edita el archivo dejando la versión definitiva correcta.
* Elimina todas las marcas de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`).

#### 3. Marcar como resuelto y continuar
```bash
# 1. Agregar el archivo resuelto
git add src/components/Navbar.tsx

# 2. Continuar el proceso de rebase (¡NO ejecutes git commit!)
git rebase --continue
```
*Si tienes múltiples commits con conflictos, repite estos pasos hasta que la terminal confirme que el rebase ha finalizado exitosamente.*

#### 4. Si te equivocas o necesitas abortar:
```bash
# Cancela el rebase y regresa la rama a su estado exacto antes de empezar
git rebase --abort
```

---

## 5. Políticas de Protección del Repositorio

Configura las siguientes reglas en tu plataforma de Git (GitHub / GitLab / Bitbucket):

### Reglas para la rama `main`:
1. ✅ **Prohibir Push Directo**: Nadie puede hacer push directo a `main`.
2. ✅ **Requerir Pull Request con Aprobación**: Mínimo 1 aprobación requerida para fusionar.
3. ✅ **Descartar Aprobaciones al Recibir Nuevos Commits (*Dismiss stale reviews*)**: Si el autor sube código nuevo tras ser aprobado, requiere nueva revisión.
4. ✅ **Requerir Verificaciones de Estado (*Require status checks*)**: Linters, pruebas unitarias y TypeScript compilation deben pasar en verde.
5. ✅ **Requerir que la rama esté al día (*Require branch to be up to date*)**: Evita que se fusionen ramas desactualizadas respecto a `main`.
6. ✅ **Prohibir Force Push y Deletion**: La rama `main` no puede ser borrada ni sobreescrita.

---

## 6. Hoja de Referencia Rápida (Cheat Sheet)

### Comandos más utilizados

| Objetivo | Comando |
| :--- | :--- |
| **Actualizar `main` local** | `git checkout main && git pull origin main` |
| **Crear rama de trabajo** | `git checkout -b <prefijo>/<nombre-tarea>` |
| **Guardar cambios en commit** | `git add . && git commit -m "<tipo>: <mensaje>"` |
| **Pausar trabajo temporalmente** | `git stash` (recuperar con `git stash pop`) |
| **Sincronizar rama con `main`** | `git fetch origin main && git rebase origin/main` |
| **Continuar tras resolver conflicto** | `git add <archivo> && git rebase --continue` |
| **Cancelar un rebase** | `git rebase --abort` |
| **Subir rama primera vez** | `git push -u origin <nombre-rama>` |
| **Subir rama tras rebase** | `git push --force-with-lease origin <nombre-rama>` |
| **Limpiar ramas remotas borradas** | `git fetch --prune` |
| **Borrar rama local ya integrada** | `git branch -d <nombre-rama>` |

---

## 7. Caso Práctico Completo de Principio a Fin

A continuación se muestra una simulación real paso a paso de un desarrollador trabajando en equipo:

### 👤 Escenario:
* **Desarrollador:** Carlos
* **Tarea:** Agregar botón de Logout en la barra de navegación.
* **Situación:** Mientras Carlos programa, su compañera **Ana** fusionó cambios a `main` que modificaron el mismo archivo `Navbar.tsx`.

---

### Paso 1: Carlos inicia su tarea
```bash
# Carlos se asegura de tener main al día
git checkout main
git pull origin main

# Carlos crea su rama de trabajo
git checkout -b feat/boton-logout
```

---

### Paso 2: Carlos realiza su código y genera su commit
Carlos edita `src/components/Navbar.tsx`:
```bash
git add src/components/Navbar.tsx
git commit -m "feat(nav): agregar boton de cerrar sesion con confirmacion"
```

---

### Paso 3: Carlos se sincroniza antes de subir cambios
Mientras Carlos trabajaba, Ana subió un PR que agregó el avatar del usuario en `Navbar.tsx`.
Carlos sincroniza su rama con lo nuevo de `main`:
```bash
git fetch origin main
git rebase origin/main
```

---

### Paso 4: Git notifica un conflicto
La terminal muestra:
```text
Auto-merging src/components/Navbar.tsx
CONFLICT (content): Merge conflict in src/components/Navbar.tsx
error: could not apply a1b2c3d... feat(nav): agregar boton de cerrar sesion con confirmacion
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
```

---

### Paso 5: Carlos abre `src/components/Navbar.tsx` para resolver
Encuentra esto:
```tsx
export function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <div className="font-bold text-lg">Mi Aplicación</div>
      <div className="flex items-center gap-3">
<<<<<<< HEAD (Cambios que subió Ana a main)
        <span className="text-sm">Ana Gómez</span>
        <img src="/avatar-ana.png" alt="Perfil" className="w-8 h-8 rounded-full" />
=======
        <button onClick={handleLogout} className="bg-rose-600 px-3 py-1.5 rounded text-sm font-medium">
          Cerrar Sesión
        </button>
>>>>>>> a1b2c3d (feat(nav): agregar boton de cerrar sesion con confirmacion)
      </div>
    </header>
  );
}
```

Carlos une ambos cambios coherentemente (ambos se necesitan):
```tsx
export function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <div className="font-bold text-lg">Mi Aplicación</div>
      <div className="flex items-center gap-3">
        <span className="text-sm">Usuario Actual</span>
        <img src="/avatar.png" alt="Perfil" className="w-8 h-8 rounded-full" />
        <button onClick={handleLogout} className="bg-rose-600 px-3 py-1.5 rounded text-sm font-medium">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
```

---

### Paso 6: Carlos marca el archivo como resuelto y continúa el rebase
```bash
git add src/components/Navbar.tsx
git rebase --continue
```
*Salida en terminal:*
```text
Applying: feat(nav): agregar boton de cerrar sesion con confirmacion
Successfully rebased and updated refs/heads/feat/boton-logout.
```

---

### Paso 7: Carlos sube su rama y abre el Pull Request
```bash
git push -u origin feat/boton-logout
```
En GitHub, Carlos abre el PR:
* **Título:** `feat(nav): agregar boton de cerrar sesion con confirmacion`
* **Descripción:**
  > Integra el botón de logout en la barra superior. Se probó la compatibilidad con el avatar de usuario y la redirección al login tras cerrar sesión.
* Solicita revisión a Ana.

---

### Paso 8: Fusión y Limpieza
Ana aprueba el PR y realiza **Squash and Merge**.
Carlos finaliza limpiando su entorno local:
```bash
git checkout main
git pull origin main
git branch -d feat/boton-logout
```

✅ **Resultado:** El historial de `main` queda completamente limpio y lineal, sin commits de merge accidentales y con cero código perdido.
