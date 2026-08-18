# 📘 Guía Oficial y Protocolo de Git para el Equipo
## Estrategia de Ramas (develop/main), Reglas de Trabajo, Sincronización y Resolución de Conflictos

---

## 📑 Tabla de Contenidos
1. [Diagnóstico y Filosofía de Trabajo](#1-diagnóstico-y-filosofía-de-trabajo)
2. [Estrategia de Ramas (develop y main) y Nomenclatura](#2-estrategia-de-ramas-develop-y-main-y-nomenclatura)
3. [Ciclo de Vida Diario Paso a Paso](#3-ciclo-de-vida-diario-paso-a-paso)
4. [Paso a Producción: De develop a main y Hotfixes](#4-paso-a-producción-de-develop-a-main-y-hotfixes)
5. [Protocolo de Resolución de Conflictos con Rebase](#5-protocolo-de-resolución-de-conflictos-con-rebase)
6. [Políticas de Protección del Repositorio](#6-políticas-de-protección-del-repositorio)
7. [Hoja de Referencia Rápida (Cheat Sheet)](#7-hoja-de-referencia-rápida-cheat-sheet)
8. [Caso Práctico Completo de Principio a Fin](#8-caso-práctico-completo-de-principio-a-fin)

---

## 1. Diagnóstico y Filosofía de Trabajo

### 1.1. Las Causas Principales de los Conflictos y Desorden
* **Ramas de larga duración (*Long-lived branches*)**: Mantener una rama abierta por semanas sin sincronizar con `develop` provoca divergencias masivas en el código.
* **Uso de `git pull` tradicional (Merge por defecto)**: Por defecto, `git pull` realiza un merge commit automático que genera commits del tipo *"Merge branch 'develop' of..."*, ensuciando el árbol de Git.
* **Commits masivos y desordenados**: Subir decenas de archivos modificados en un solo commit impide revisiones efectivas y dificulta aislar bugs.
* **Falta de separación entre Desarrollo y Producción**: Mezclar código experimental o en pruebas directamente en la rama productiva.

### 1.2. Principios de Oro del Repositorio
* 🧪 **`develop` es el centro de integración**: Todas las ramas de tareas (`feat/`, `fix/`, `refactor/`) se crean a partir de `develop` y se integran mediante Pull Requests hacia `develop`.
* 🛡️ **`main` es Producción 100% Estable**: Solo contiene versiones probadas y validadas listas para el usuario final. Nadie programa directamente sobre `main`.
* ⚡ **Ramas efímeras**: Ninguna rama debe vivir más de 1 a 3 días. Los desarrollos grandes se dividen en entregas pequeñas (*small batch sizes*).
* 🧼 **Historial limpio y lineal**: Se utiliza `rebase` en local contra `develop` antes de subir cambios para evitar ramas cruzadas y commits redundantes.
* 👥 **Revisión obligatoria**: Ningún cambio entra a `develop` o `main` sin la aprobación de al menos un revisor en Pull Request.

---

## 2. Estrategia de Ramas (develop y main) y Nomenclatura

### 2.1. Arquitectura de Ramas (*GitFlow Adaptado / Two-Trunk*)

```text
[ main (Producción) ] ----------------------------------------● (Release probada v1.1.0)
                                                             / (PR de Release)
[ develop (Pruebas) ] --------●-----------------●-----------●---------------------------->
                               \               / (Squash PR)
                                ●---●---●-----●
                              [ feat/auth-login ]
```

* **`main`**: Código productivo desplegado. Solo recibe código desde `develop` (Releases validadas) o desde `hotfix/*` (urgencias).
* **`develop`**: Rama base del equipo. Todo el trabajo diario se integra aquí para testing y control de calidad (QA).
* **Ramas de trabajo temporales**: Creadas a partir de `develop` y eliminadas inmediatamente tras fusionarse en `develop`.

### 2.2. Nomenclatura Estándar de Ramas
Formato obligatorio: `<prefijo>/<ticket-o-descripcion-corta>` (todo en minúsculas, palabras separadas por guión medio `-`).

| Prefijo | Base de creación | Destino del PR | Cuándo se usa | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| `feat/` | `develop` | `develop` | Nuevas características o pantallas | `feat/login-google`, `feat/CART-402-pasarela-pago` |
| `fix/` | `develop` | `develop` | Corrección de errores en desarrollo | `fix/error-calculo-iva`, `fix/AUTH-105-token-expirado` |
| `refactor/` | `develop` | `develop` | Mejoras de código sin cambiar funcionalidad | `refactor/modularizar-servicios-api` |
| `chore/` | `develop` | `develop` | Dependencias, configs, linter o CI/CD | `chore/actualizar-vite-v6` |
| `hotfix/` | `main` | `main` y `develop` | Emergencias críticas en producción | `hotfix/caida-checkout-stripe` |
| `release/` | `develop` | `main` y `develop` | Preparación de versión para producción | `release/v1.2.0` |

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
Antes de comenzar a programar, siempre párate en `develop` fresco y actualizado:
```bash
# 1. Cambiar a develop
git checkout develop

# 2. Descargar los últimos cambios del equipo
git pull origin develop

# 3. Crear tu rama con el nombre adecuado a partir de develop
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

### 🔄 3.3. Sincronización Diaria con `develop` (Evitar Divergencias)
Si tus compañeros integraron cambios a `develop` mientras trabajabas en tu rama:

> ⚠️ **REGLA DE ORO:** NUNCA ejecutes `git merge develop` dentro de tu rama de desarrollo. Usa siempre `rebase`.

```bash
# 1. Descargar lo nuevo de develop sin cambiarte de rama
git fetch origin develop

# 2. Re-aplicar tus commits por encima de lo nuevo que entró en develop
git rebase origin/develop
```
*(Si surge un conflicto, sigue el protocolo de la sección 5).*

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

### 📋 3.5. Apertura y Revisión de Pull Request (Hacia `develop`)
1. Ve a GitHub/GitLab y abre el PR teniendo como **base: `develop`** (y no `main`).
2. Completa la plantilla de PR:
   * **¿Qué hace este cambio?**
   * **¿Cómo se prueba?**
   * **Capturas o evidencia (si aplica UI)**.
3. Asigna al menos 1 compañero de equipo como **Revisor (*Reviewer*)**.
4. Realiza los ajustes necesarios tras la revisión en la misma rama y haz `push`.

---

### 🔀 3.6. Fusión (*Merge*) y Limpieza
* Se realiza la fusión mediante **Squash and Merge** hacia `develop`.
* Una vez fusionado el PR, elimina la rama tanto en remoto como en local:
```bash
# Regresar a develop y actualizar
git checkout develop
git pull origin develop

# Eliminar la rama local que ya fue integrada
git branch -d feat/nombre-de-tu-tarea
```

---

## 4. Paso a Producción: De develop a main y Hotfixes

### 4.1. Despliegue de Release a Producción (`develop` ➔ `main`)
Una vez que el conjunto de cambios en `develop` ha sido probado y verificado en ambiente de staging o pruebas:
1. Se abre un Pull Request de **`develop` hacia `main`** (Título: `release: versión 1.x.x`).
2. Se revisa que todos los tests pasen en verde.
3. Se realiza el merge hacia `main`.
4. Se crea un Tag de versión en `main`:
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.2.0 -m "Release v1.2.0: Login Google y Modulo de Pagos"
   git push origin v1.2.0
   ```

### 4.2. Hotfixes de Emergencia (Directo a Producción)
Si ocurre un bug crítico en producción que no puede esperar al ciclo normal de `develop`:
```bash
# 1. Crear rama hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/caida-login-produccion

# 2. Corregir y hacer commit
git commit -m "fix(prod): corregir endpoint caido de autenticacion"

# 3. Subir y abrir PR hacia main
git push -u origin hotfix/caida-login-produccion

# 4. TRAS EL MERGE EN MAIN: Sincronizar también develop para no perder el fix
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

---

## 5. Protocolo de Resolución de Conflictos con Rebase

Los conflictos ocurren cuando dos personas editaron las mismas líneas de un archivo. Con `rebase`, los conflictos se resuelven commit por commit de forma limpia contra `develop`.

### Procedimiento Paso a Paso:

```text
1. git fetch origin develop
2. git rebase origin/develop
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
<<<<<<< HEAD (Lo que está actualmente en develop)
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

#### 4. Si te equivocas o necesitas abortar:
```bash
# Cancela el rebase y regresa la rama a su estado exacto antes de empezar
git rebase --abort
```

---

## 6. Políticas de Protección del Repositorio

Configura las siguientes reglas en tu plataforma de Git (GitHub / GitLab / Bitbucket):

### Reglas para las ramas `main` y `develop`:
1. ✅ **Prohibir Push Directo tanto en `main` como en `develop`**: Todo cambio ingresa mediante Pull Request.
2. ✅ **Requerir Pull Request con Aprobación**: Mínimo 1 aprobación requerida para fusionar a `develop` y a `main`.
3. ✅ **Descartar Aprobaciones al Recibir Nuevos Commits (*Dismiss stale reviews*)**: Si el autor sube código nuevo tras ser aprobado, requiere nueva revisión.
4. ✅ **Requerir Verificaciones de Estado (*Require status checks*)**: Linters, pruebas unitarias y compilación de TypeScript deben pasar en verde.
5. ✅ **Requerir que la rama esté al día (*Require branch to be up to date*)**: Evita fusionar ramas desactualizadas respecto a `develop`.
6. ✅ **Prohibir Force Push y Deletion**: Ni `main` ni `develop` pueden ser borradas ni sobreescritas.

---

## 7. Hoja de Referencia Rápida (Cheat Sheet)

### Comandos más utilizados

| Objetivo | Comando |
| :--- | :--- |
| **Actualizar `develop` local** | `git checkout develop && git pull origin develop` |
| **Crear rama de trabajo** | `git checkout -b <prefijo>/<nombre-tarea>` (desde `develop`) |
| **Guardar cambios en commit** | `git add . && git commit -m "<tipo>: <mensaje>"` |
| **Pausar trabajo temporalmente** | `git stash` (recuperar con `git stash pop`) |
| **Sincronizar rama con `develop`** | `git fetch origin develop && git rebase origin/develop` |
| **Continuar tras resolver conflicto** | `git add <archivo> && git rebase --continue` |
| **Cancelar un rebase** | `git rebase --abort` |
| **Subir rama primera vez** | `git push -u origin <nombre-rama>` |
| **Subir rama tras rebase** | `git push --force-with-lease origin <nombre-rama>` |
| **Limpiar ramas remotas borradas** | `git fetch --prune` |
| **Borrar rama local ya integrada** | `git branch -d <nombre-rama>` |

### Las 5 Reglas de Oro del Equipo
1. **Nadie programa directamente en `main` ni en `develop`**.
2. **Las ramas de desarrollo nacen de `develop` y hacen Pull Request hacia `develop`**.
3. **No uses `git merge develop` en tu rama local; usa siempre `git rebase origin/develop`**.
4. **`main` solo recibe código probado mediante Release PR desde `develop` o `hotfix/*`**.
5. **Revisa los Pull Requests de tus compañeros en menos de 24 horas**.

---

## 8. Caso Práctico Completo de Principio a Fin

A continuación se muestra una simulación real paso a paso de un desarrollador trabajando en equipo:

### 👤 Escenario:
* **Desarrollador:** Carlos
* **Tarea:** Agregar botón de Logout en la barra de navegación.
* **Situación:** Mientras Carlos programa, su compañera **Ana** fusionó cambios a `develop` que modificaron el mismo archivo `Navbar.tsx`.

---

### Paso 1: Carlos inicia su tarea desde `develop`
```bash
# Carlos se asegura de tener develop al día
git checkout develop
git pull origin develop

# Carlos crea su rama de trabajo a partir de develop
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
Mientras Carlos trabajaba, Ana subió un PR que agregó el avatar del usuario en `Navbar.tsx` dentro de `develop`.
Carlos sincroniza su rama con lo nuevo de `develop`:
```bash
git fetch origin develop
git rebase origin/develop
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
<<<<<<< HEAD (Cambios que subió Ana a develop)
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

### Paso 7: Carlos sube su rama y abre el Pull Request hacia `develop`
```bash
git push -u origin feat/boton-logout
```
En GitHub, Carlos abre el PR:
* **Base branch:** `develop` ⬅️ **Compare branch:** `feat/boton-logout`
* **Título:** `feat(nav): agregar boton de cerrar sesion con confirmacion`
* **Descripción:**
  > Integra el botón de logout en la barra superior. Se probó la compatibilidad con el avatar de usuario y la redirección al login tras cerrar sesión.
* Solicita revisión a Ana.

---

### Paso 8: Fusión en `develop` y Limpieza
Ana aprueba el PR y realiza **Squash and Merge** hacia `develop`.
Carlos finaliza limpiando su entorno local:
```bash
git checkout develop
git pull origin develop
git branch -d feat/boton-logout
```

---

### Paso 9: Paso a Producción (Cuando esté probado)
Una vez que el equipo prueba todas las funcionalidades en el entorno de pruebas vinculado a `develop`:
1. Se abre PR de `develop` hacia `main` (Release).
2. Se fusiona en `main`.
3. ¡Se despliega a producción de forma segura y sin sorpresas!
