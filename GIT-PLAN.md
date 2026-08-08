# Plan de subida incremental a GitHub

> Repo: https://github.com/dair7/portfolio-frontend · rama `main` · **privado por ahora**
> Última actualización: 2026-08-06

## Convención acordada

El proyecto se sube **por lotes, no de golpe**. Cada lote son **2 commits** (uno por
grupo de archivos), y luego se pushea. Lo que no está en el lote actual se queda como
*untracked* en local — no se borra ni se pierde nada.

**Por qué por lotes:** el objetivo es mantener la racha de contribuciones en GitHub con
commits diarios. El reparto en lotes es el calendario de trabajo, no una restricción técnica.

**Pendiente de decidir:** si el repo pasa a público y qué hace falta antes
(ver "Antes de hacerlo público" al final).

**Gestor de paquetes: pnpm** (decidido 2026-08-01). `node_modules` ya estaba instalado con
pnpm — junctions y `.modules.yaml` más reciente que el lockfile de npm. Se borró
`package-lock.json` (nunca llegó al historial) y se fijó `"packageManager": "pnpm@10.28.2"`
en `package.json` para que no vuelva a haber ambigüedad.

Comandos de cada lote:

```powershell
cd C:\Users\dairg\Documents\Mi_portafolio_manager\portfolio-frontend

git add <grupo-1>
git commit -m "<mensaje 1>"

git add <grupo-2>
git commit -m "<mensaje 2>"

git push
```

Verificar antes de pushear: `git log --oneline --stat`

---

## Estado actual

### ✅ Lote 1 — SUBIDO (2026-07-31)

| Commit | Contenido |
|---|---|
| `6765320` Add axios API client with JWT request and 401 response interceptors | `src/api/axios.ts` |
| `6b455f5` Add application router and private route guard | `src/router/AppRouter.tsx`, `src/router/PrivateRoute.tsx` |

3 archivos, 85 líneas.

### ✅ Lote 2 — SUBIDO (2026-08-01)

| Commit | Contenido |
|---|---|
| `8daed64` Add shared TypeScript domain types | `src/types/index.ts` |
| `6b9f7b4` Add auth context with token persistence and login/logout | `src/context/AuthContext.tsx` |

Cierra el import roto de `PrivateRoute`.

### ✅ Lote 3 — SUBIDO (2026-08-01)

| Commit | Contenido |
|---|---|
| `b33def2` Add package manifest, pnpm lockfile and git ignore rules | `package.json`, `pnpm-lock.yaml`, `.gitignore` |
| `ac6285a` Add TypeScript, Vite and ESLint configuration | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `eslint.config.js`, `index.html` |

`main` sincronizado con `origin/main`. El repo ya es **instalable**: `pnpm install && pnpm dev`.

### ✅ Lote 4 — SUBIDO (2026-08-02)

| Commit | Contenido |
|---|---|
| `20f7469` Add UI components: navbar, footer, project card, modal and tech badge | `src/components/` (5 archivos) |
| `52dead9` Add main and admin layouts with useInView scroll hook | `src/layouts/`, `src/hooks/useInView.ts` |

### ✅ Lote 5 — SUBIDO (2026-08-02)

| Commit | Contenido |
|---|---|
| `4cff3ac` Add public site sections: hero, about, projects, skills and contact | `src/sections/` (5 archivos) |
| `01e4402` Add home page, app root, entry point and global styles | `src/pages/Home.tsx`, `src/App.tsx`, `src/main.tsx`, `src/index.css` |

Los Lotes 4 y 5 se subieron **el mismo día** (2026-08-02, 19:52 y 20:00 local), así que
el calendario va un día adelantado respecto a lo previsto.

### ✅ Lote 6 — SUBIDO (2026-08-03, 21:22 local)

| Commit | Contenido |
|---|---|
| `11c0100` Add admin pages: login, dashboard, project form, technologies and skills | `src/pages/admin/` (5 archivos) |
| `2c982cf` Add public assets: favicon and icon sprite | `public/favicon.svg`, `public/icons.svg` |

Se subió **el mismo 3 de agosto, un minuto después** de que esta sesión se diera por
cerrada — la nota anterior de "sesión sin subida" era incorrecta y se eliminó.

✅ **El repo remoto ya compila.** Verificado el 2026-08-04 con `pnpm build`: 118 módulos,
`dist/` en 340.62 kB (103.49 kB gzip), sin errores de `tsc -b`. Queda cerrado el pendiente
que arrastraban los Lotes 4–6.

Como cayó a las 21:22 local = **4 ago 02:22 UTC**, el cuadrito del 4 de agosto quedó
lleno y la racha nunca estuvo en riesgo. La alarma "🚨 4 de agosto" que había en este
archivo se basaba en el supuesto equivocado de que no se había commiteado.

### ✅ Lote 7 — SUBIDO (2026-08-04)

| Commit | Contenido |
|---|---|
| `03dabab` Add project README and environment variable example | `README.md`, `.env.example` |
| `324c67b` Add technical analysis and incremental upload plan | `ANALISIS.md`, `GIT-PLAN.md` |

`README.md` se reescribió desde cero — ya no es el template de Vite. Cubre qué es el
proyecto, requisitos, arranque con pnpm, `VITE_API_URL`, scripts, estructura de `src/`,
tabla de rutas, cómo funciona el JWT y el aviso de los placeholders de EmailJS.

🏁 **Con esto se acaban los lotes: no queda ni un archivo del frontend sin subir.**
`git status` está limpio y `main` sincronizado con `origin/main`.

---

## La fase después de los lotes

Ya no hay archivos guardados para dosificar, así que **cada commit diario tiene que ser
trabajo real**.

De esta fase solo llegó a hacerse el Día 1 con el plan viejo. Lo que vino después está en
el **Plan de 8 días**, más abajo.

### ✅ Día 1 (plan viejo) — Dependencias y lint · HECHO (2026-08-04, 21:4x local)

Se adelantó a la noche del 4 de agosto. Como cae en el **cuadrito del 5 de agosto UTC**,
que era el día que tenía asignado, el calendario sigue exacto.

| Commit | Contenido |
|---|---|
| `d4797b4` Update axios and react-router-dom to patch security advisories | `package.json`, `pnpm-lock.yaml` |
| `6898e2d` Split auth context so Fast Refresh works in AuthContext.tsx | `src/context/auth.ts`, `src/hooks/useAuth.ts` + 4 archivos |

**Vulnerabilidades: de 39 (16 *high*) a 1.** El recuento de partida se verificó el
2026-08-04 con `pnpm audit --prod` y desmintió las 5 que decía `ANALISIS.md` §3: ese
número era de `npm audit` del 31 de julio, solo miraba `react-router-dom` y no vio que la
mayor parte venía de **axios 1.15.0** (prototype pollution, ReDoS, fuga de
`Proxy-Authorization`, SSRF por bypass de `no_proxy`).

| Paquete | Antes | Ahora |
|---|---|---|
| `axios` | 1.15.0 | 1.19.0 |
| `react-router-dom` | 7.14.0 | 7.18.2 |

Las dos eran *minor* y no hubo breaking changes: `pnpm build` pasó (123 módulos,
351.73 kB / 107.26 kB gzip).

> ⚠️ **Quedó 1 *high* que no se pudo cerrar con un minor:**
> [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2), un bypass de
> CSRF en `react-router`. Pedía subir a **8.3.0**, que es un *major*. Solo afectaba al
> **modo RSC**, y este proyecto era una SPA con `BrowserRouter` sobre Vite — no lo usaba.
>
> ✅ **Cerrada el 2026-08-05**, sin parchear nada: al borrar el panel admin,
> `react-router-dom` se quedó sin consumidores y se desinstaló. `pnpm audit --prod` pasó a
> *"No known vulnerabilities found"*. Ver `PLAN-ESTATICO.md`, Fase 4.

El commit B además dejó **`pnpm lint` limpio por primera vez**. El error era
`react-refresh/only-export-components`: `AuthContext.tsx` exportaba el componente
`AuthProvider` *y* el hook `useAuth`, y con eso Fast Refresh no funciona en ese archivo.
Ahora:

| Archivo | Qué exporta |
|---|---|
| `src/context/auth.ts` | el objeto `AuthContext` y el tipo `AuthContextType` |
| `src/context/AuthContext.tsx` | solo `AuthProvider` |
| `src/hooks/useAuth.ts` | el hook `useAuth` |

Se actualizaron los 3 imports (`AdminLayout.tsx`, `Login.tsx`, `PrivateRoute.tsx`).

> El archivo nuevo se llama `auth.ts` a secas, no `authContext.ts`: en Windows ese nombre
> choca por mayúsculas con `AuthContext.tsx` y TypeScript lo rechaza.

---

## 📅 Plan de 8 días (2026-08-05 → 2026-08-12)

> El plan viejo de "Día 2 — enlaces / Día 3 — SEO" quedó superado el 2026-08-05: ese día
> se hizo la migración a sitio estático completa (ver `PLAN-ESTATICO.md`). Aquellos
> pendientes siguen vivos, pero reubicados en el calendario de abajo.

### Por qué no son 8 días de trabajo de hoy

El trabajo del 5 de agosto es **una sola cosa**: sacar el backend. Y está encadenado —
`src/types/index.ts` borra los tipos de auth, así que en el momento en que ese archivo
entra, el panel admin *tiene* que entrar también o el proyecto no compila. Igual con
`src/data/`: si entra sin la nueva `Projects.tsx`, nadie lo consume.

Forzarlo a 8 días produce **commits que no compilan**, y en un repo cuyo propósito es que
alguien lo mire, eso es peor que tener menos commits. Lo de hoy da **5 commits repartibles
en 3 días**; los 5 días restantes salen de las fases pendientes de `PLAN-ESTATICO.md`.

### El calendario

| Día | Commits | Contenido | Bloqueado por |
|---|---|---|---|
| **D1** · 5 ago ✅ | 1 | Datos estáticos + borrar el panel admin | — |
| **D2** · 6 ago ✅ | 2 | A: traducir `src/components/` · B: traducir `src/sections/` + `index.html` | — |
| **D3** · 7 ago | 2 | A: reescribir `README.md` · B: `PLAN-ESTATICO.md` + este archivo | — |
| **D4** · 8 ago | 2 | A: catálogo real de proyectos · B: skills y tecnologías reales | **Dair** — escribir el contenido |
| **D5** · 9 ago | 1 | Imágenes en `public/projects/` | **Dair** — capturas |
| **D6** · 10 ago | 2 | A: enlaces reales de LinkedIn/email · B: EmailJS configurado | **Dair** — cuenta + URLs |
| **D7** · 11 ago | 2 | A: meta description · B: Open Graph + Twitter Card | — |
| **D8** · 12 ago | 2 | A: deploy en Vercel · B: README con URL y captura | cuenta de Vercel |

**14 commits, 8 días, todos compilando.**

### ✅ D1 y D2 — SUBIDOS

| Día | Commit | Contenido |
|---|---|---|
| D1 · 5 ago 21:36 | `1487b19` Serve the public site from static data and remove the admin panel | `src/data/`, `Projects.tsx`, `Skills.tsx`, `types/index.ts`, `App.tsx`, `main.tsx`, `package.json` + las 15 eliminaciones |
| D2 · 6 ago 20:03 | `7ff047f` Translate UI components to English | `src/components/` (4 archivos) |
| D2 · 6 ago 20:03 | `b7bddba` Translate public sections and page title to English | `Hero.tsx`, `About.tsx`, `Contact.tsx`, `index.html` |

Verificado antes de commitear: `pnpm lint` limpio y `pnpm build` OK — 52 módulos,
226.33 kB / 68.33 kB gzip.

### Los grupos de archivos que quedan (D3)

Ya están escritos en el working tree del 5 de agosto. Se sueltan con `git add` por grupo:

```powershell
# D3 — commit A
git add README.md
git commit -m "Rewrite README for the static, backend-free site"

# D3 — commit B
git add PLAN-ESTATICO.md GIT-PLAN.md
git commit -m "Document the static migration and update the upload plan"

git push
```

Verificar al final de todo: `git status --short` tiene que salir **vacío**.

> ⚠️ **Los commits los ejecuta Dair, no Claude.** Regla fijada el 2026-08-06 en
> `../CLAUDE.md`. Claude prepara el trabajo, lo verifica con `pnpm lint` + `pnpm build` y
> deja los comandos listos para copiar; ahí se para.

### Después del D8

Pendientes que ya no bloquean nada, por si hace falta llenar días:

| Qué | Dónde | Por qué |
|---|---|---|
| Accesibilidad de `ProjectCard`/`ProjectModal` | `src/components/` | Hoy no se puede abrir un proyecto sin ratón (`ANALISIS.md` §2.18) |
| Usar `public/icons.svg` o borrarlo | 5 SVG de GitHub inline | El sprite existe y no se usa en ningún lado |
| Tests con Vitest | — | El frontend tiene 0 tests |
| Backend: `BadCredentialsException` → 401 | `../portfolio-manager/` | Un login fallido devuelve 500 |
| Backend: CORS duplicado y abierto | `CorsConfig` + `SecurityConfig` | Indefendible en una entrevista |

**El backend es la otra fuente de commits** cuando el frontend se quede corto:
`../portfolio-manager/` → https://github.com/dair7/dev-portfolio-manager

> Ya no aplica la advertencia sobre "si el sitio debe depender del backend": se decidió el
> 2026-08-05 que **no**. Los dos arreglos del backend valen igual, como pieza de portafolio
> Java independiente.

---

## Lo que NO se sube

| Archivo | Motivo |
|---|---|
| `.env` | Ya ignorado por `.gitignore`. Contiene un `VITE_API_URL` que desde el 2026-08-05 **ya no lee nadie** — se puede borrar del disco. |
| `.env.example` | **Borrado el 2026-08-05:** el proyecto se quedó sin ninguna variable de entorno en uso. Vuelve en el D6 con las claves de EmailJS. |
| `node_modules/`, `dist/`, `.claude/` | Ya ignorados. |
| `src/assets/` | Carpeta vacía desde abril. Git no versiona directorios vacíos, así que ni aparece. Se puede borrar a mano. |
| `package-lock.json` | ~~Conflicto de lockfiles~~ **Resuelto (2026-08-01):** se eligió pnpm y se borró el lockfile de npm. Solo se sube `pnpm-lock.yaml`. |

---

## Que la racha cuente de verdad

Tres cosas que es fácil pasar por alto:

1. **Contribuciones privadas visibles.** Con el repo en privado, los commits cuentan para
   la racha pero el gráfico se ve vacío para cualquier visitante, salvo que se active
   *Settings → Public profile → Include private contributions on my profile*.
2. **Email del commit asociado a la cuenta.** `git config user.email` es
   `dairplaza77@gmail.com`; debe estar verificado en GitHub o los commits no se atribuyen
   al perfil y no suman.
3. **La hora a la que commiteas** — ver abajo.

Comprobar las dos primeras una sola vez, mirando si el cuadrito se pintó en
https://github.com/dair7

### ⏰ El gráfico va en UTC, tú estás en UTC-05:00

Constatado el 2026-08-01: se hicieron 4 commits ese día y el cuadrito mostraba 2.
No se había perdido nada — era desfase de zona horaria.

El gráfico agrupa los días por **UTC**. Estando en `UTC-05:00` (Bogotá/Lima/Quito), todo
lo que commitees **después de las 7:00 pm hora local** cae en el cuadrito del día
*siguiente*.

| Commits | Hora local (-05:00) | Cuadrito donde caen |
|---|---|---|
| Lote 1 | 31 jul 22:04 | **1 de agosto** |
| Lotes 2 y 3 | 1 ago 20:03–20:06 | **2 de agosto** |
| Lotes 4 y 5 | 2 ago 19:52–20:00 | **3 de agosto** |
| Lote 6 | 3 ago 21:22 | **4 de agosto** |
| Lote 7 | 4 ago 20:30 | **5 de agosto** |
| Día 1 (plan viejo) | 4 ago 21:4x | **5 de agosto** |
| D1 del plan de 8 días | 5 ago 21:36 | **6 de agosto** |
| D2 del plan de 8 días | 6 ago 20:03 | **7 de agosto** |

> 📌 Ojo con el Plan de 8 días: **el cuadrito del 5 de agosto ya quedó lleno** por el Día 1
> del plan viejo, commiteado la noche del 4. O sea que el D1 de hoy no está sosteniendo la
> racha — el margen está cubierto pase lo que pase. Lo único que importa es mantener el
> patrón: si se commitea de noche, que sea *siempre* de noche.

Van siete días consecutivos (1 al 7 de agosto UTC) sin huecos. Se mantiene el patrón
nocturno: commitear después de las 7:00 pm local desplaza el cuadrito un día, pero
mientras sea *siempre* de noche la racha no se rompe.

**El desfase por sí solo no rompe la racha:** si siempre commiteas de noche, cada día se
corre uno y quedan igual de consecutivos.

**El riesgo real es mezclar horarios.** Ejemplo:

- Lunes 10:00 am → cuenta el **lunes** UTC ✅
- Martes 8:00 pm → cuenta el **miércoles** UTC ✅
- Martes UTC queda **en cero** → racha rota, aunque se commiteó los dos días

**Regla:** commitear antes de las **7:00 pm** hora local. Si un día se hace tarde, que el
siguiente también sea tarde — no alternar.

---

## Antes de hacerlo público

- [x] **Actualizar `axios` y `react-router-dom`** ✅ 2026-08-04 — `d4797b4`
- [x] **Cero vulnerabilidades** ✅ 2026-08-05 — al borrar el panel admin se fueron las dos
      dependencias. `pnpm audit --prod`: *"No known vulnerabilities found"*
- [x] Reescribir el `README.md` ✅ 2026-08-04 — `03dabab`, y reescrito otra vez el
      2026-08-05 (describía un panel admin que ya no existe)
- [ ] Confirmar que ningún commit del historial incluyó `.env` o claves
- [x] Tener subido al menos hasta el Lote 3 para que el repo sea instalable ✅ 2026-08-01
- [x] Tener subido el Lote 6 para que el repo compile ✅ 2026-08-04 — `pnpm build` verificado
- [ ] **Reemplazar los 3 proyectos inventados** de `src/data/projects.ts` por el catálogo
      real. Van marcados con `⚠️ PLACEHOLDER` — no pueden salir a producción

> Sobre las claves: las credenciales de EmailJS en `src/sections/Contact.tsx` siguen siendo
> placeholders (`TU_SERVICE_ID`, `TU_TEMPLATE_ID`, `TU_PUBLIC_KEY`). Cuando se pongan las
> de verdad (D6), ojo: la *public key* de EmailJS viaja en el bundle igual, así que la
> protección hay que ponerla en el panel de EmailJS (restricción por dominio), no en el
> código.

---

## Recordatorios al retomar

0. ⏰ Rutina normal: commitear **antes de las 7:00 pm** local, o si se hace de noche, que
   el día siguiente también sea de noche. No alternar.
1. 📅 **Se sigue el "Plan de 8 días"** de más arriba. Mirar en qué día quedó el calendario
   y soltar el grupo de archivos que toca. Usar `pnpm`, no `npm`.
2. 🔌 **El sitio público ya no depende del backend** (decidido y hecho el 2026-08-05).
   Los datos viven en `src/data/` como módulos TypeScript. **No volver a proponer la API
   como fuente de datos del sitio.** El razonamiento completo está en
   [`PLAN-ESTATICO.md`](./PLAN-ESTATICO.md).
3. 🌐 **El sitio es solo en inglés** (decidido el 2026-08-05, mercado objetivo remoto
   internacional). Se descartó el toggle ES/EN. El chat sigue siendo en español.
4. El backend ya tiene su propio repo: `../portfolio-manager/` →
   https://github.com/dair7/dev-portfolio-manager (ojo: el `.git` está en el nivel
   `portfolio-manager/`, no en la carpeta anidada `portfolio-manager/portfolio-manager/`).
   Es otra fuente de commits diarios cuando el frontend se quede corto.
5. Los pendientes técnicos están en [`ANALISIS.md`](./ANALISIS.md), pero **ojo: ese
   documento es del 31 de julio** y buena parte de su diagnóstico del frontend quedó
   obsoleto con la migración a estático.
