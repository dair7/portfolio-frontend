# Plan de subida incremental a GitHub

> Repo: https://github.com/dair7/portfolio-frontend · rama `main` · **privado por ahora**
> Última actualización: 2026-08-04 (noche)

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

## Y ahora qué — la fase después de los lotes

Ya no hay archivos guardados para dosificar, así que **cada commit diario tiene que ser
trabajo real**. La buena noticia es que la lista de pendientes de `ANALISIS.md` está hecha
justo de eso: arreglos pequeños e independientes, uno o dos por día.

El orden de abajo prioriza lo que **desbloquea hacer público el repo**, que es el objetivo
que quedó abierto desde el principio.

### ✅ Día 1 — Dependencias y lint · HECHO (2026-08-04, 21:4x local)

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

> ⚠️ **Queda 1 *high* que no se puede cerrar con un minor:**
> [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2), un bypass de
> CSRF en `react-router`. Pide subir a **8.3.0**, que es un *major*. Solo afecta al
> **modo RSC**, y este proyecto es una SPA con `BrowserRouter` sobre Vite — no lo usa, así
> que no es alcanzable aquí. **No bloquea hacer público el repo.** Si algún día se migra a
> RSC o a un framework con SSR, hay que revisarlo.

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

### ⬜ Día 2 (2026-08-05) — Los enlaces y el formulario de contacto · **el siguiente**

Lo más vergonzoso si alguien entra hoy al sitio: **el formulario de contacto no funciona**
y los enlaces sociales no van a ningún lado (`ANALISIS.md` §2, puntos 1 y 2).

- [ ] Commit A: reemplazar los placeholders de LinkedIn/GitHub/email en `Contact.tsx`,
      `Footer.tsx` y `Hero.tsx` por las URLs reales
- [ ] Commit B: mover las claves de EmailJS a `.env` (`VITE_EMAILJS_SERVICE_ID`,
      `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`), actualizar `.env.example` y
      configurar la cuenta de EmailJS de verdad

Requiere que Dair tenga una cuenta de EmailJS y sus URLs de LinkedIn a mano.

### ⬜ Día 3 — SEO

`index.html` sigue con `<title>portfolio-frontend</title>` y `lang="en"` sobre contenido
en español (`ANALISIS.md` §2, punto 19). Para un portafolio que debe salir en Google y
verse bien al compartirlo en LinkedIn, es de lo más rentable que hay.

- [ ] Commit A: `<title>`, `lang="es"`, meta description
- [ ] Commit B: Open Graph + Twitter Card

### ⬜ Día 4 en adelante — a elegir

Ya sin orden obligatorio. Candidatos por retorno, todos de `ANALISIS.md`:

| Qué | Dónde | Por qué |
|---|---|---|
| `catch` en las 4 promesas con `try/finally` | Dashboard, Skills, Technologies, ProjectForm | Hoy la UI miente: muestra "no hay proyectos" cuando la API falla |
| Accesibilidad de `ProjectCard`/`ProjectModal` | `src/components/` | Hoy no se puede abrir un proyecto sin ratón |
| Usar `public/icons.svg` | 5 SVG de GitHub inline | El sprite existe y no se usa en ningún lado |
| Unificar el español (voseo vs tuteo) | Toda la UI | Se nota, y es un rato |
| Backend: `BadCredentialsException` → 401 | `../portfolio-manager/` | Hoy un login fallido devuelve 500 |
| Backend: CORS duplicado y abierto | `CorsConfig` + `SecurityConfig` | Indefendible en una entrevista |

**El backend es la otra fuente de commits** cuando el frontend se quede corto:
`../portfolio-manager/` → https://github.com/dair7/dev-portfolio-manager

> ⚠️ Antes de meterle trabajo grande al backend, ojo con la decisión abierta de
> `ANALISIS.md` §1 (si el sitio público debe depender de él en runtime). Los dos arreglos
> de la tabla valen igual, decida lo que decida.

---

## Lo que NO se sube

| Archivo | Motivo |
|---|---|
| `.env` | Ya ignorado por `.gitignore`. Contiene `VITE_API_URL`. ~~Pendiente el `.env.example`~~ **Resuelto (2026-08-04):** se creó `.env.example` y va en el Lote 7. |
| `node_modules/`, `dist/` | Ya ignorados. |
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
| Día 1 | 4 ago 21:4x | **5 de agosto** |

Van cinco días consecutivos (1 al 5 de agosto UTC) sin huecos. Se mantiene el patrón
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

- [x] **Actualizar `axios` y `react-router-dom`** ✅ 2026-08-04 — `d4797b4`. De 39
      vulnerabilidades (16 *high*) a 1, y la que queda solo afecta al modo RSC de
      React Router, que este proyecto no usa. **Ya no queda ningún requisito técnico.**
- [x] Reescribir el `README.md` ✅ 2026-08-04 — subido en `03dabab`
- [x] Crear y subir `.env.example` con `VITE_API_URL` ✅ 2026-08-04 — subido en `03dabab`
- [ ] Confirmar que ningún commit del historial incluyó `.env` o claves
- [x] Tener subido al menos hasta el Lote 3 para que el repo sea instalable ✅ 2026-08-01
- [x] Tener subido el Lote 6 para que el repo compile ✅ 2026-08-04 — `pnpm build` verificado

> Sobre las claves: las credenciales de EmailJS en `src/sections/Contact.tsx` son
> placeholders (`TU_SERVICE_ID`, `TU_TEMPLATE_ID`, `TU_PUBLIC_KEY`), no valores reales.
> Revisado el 2026-08-04. Cuando se pongan las de verdad, ojo: la *public key* de EmailJS
> viaja en el bundle igual, así que la protección hay que ponerla en el panel de EmailJS
> (restricción por dominio), no en el código.

---

## Recordatorios al retomar

0. ⏰ Rutina normal: commitear **antes de las 7:00 pm** local, o si se hace de noche, que
   el día siguiente también sea de noche. No alternar.
1. 🏁 **Los lotes se acabaron** (Lote 7 subido el 2026-08-04). Ya no hay archivos
   guardados: de aquí en adelante cada commit es trabajo real. El **Día 1** también quedó
   hecho esa misma noche, así que lo siguiente es el **Día 2 — enlaces y formulario de
   contacto**, en la sección "Y ahora qué". Hace falta tener a mano la cuenta de EmailJS y
   las URLs reales de LinkedIn/GitHub. Usar `pnpm`, no `npm`.
2. El backend ya tiene su propio repo: `../portfolio-manager/` →
   https://github.com/dair7/dev-portfolio-manager (ojo: el `.git` está en el nivel
   `portfolio-manager/`, no en la carpeta anidada `portfolio-manager/portfolio-manager/`).
   Es otra fuente de commits diarios cuando el frontend se quede corto.
3. Si el backend se mantiene o no, **se discute más adelante** — decisión abierta.
   El razonamiento de fondo está en [`ANALISIS.md`](./ANALISIS.md) §1.
4. Los pendientes técnicos del proyecto están en [`ANALISIS.md`](./ANALISIS.md).
