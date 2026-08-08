# Plan: migrar el sitio público a estático

> Fecha: 2026-08-05
> Decisión tomada: el sitio público deja de depender del backend en runtime.
> Relacionado: `ANALISIS.md` §1 (el veredicto original), `GIT-PLAN.md` (calendario de commits)

## Por qué

Los datos del portafolio son ~10 proyectos y ~15 skills, todos públicos, editados por una
sola persona quizá una vez al mes. Eso cabe en un archivo. Mantener PostgreSQL + JPA + JWT
vivo 24/7 para servirlo no es un problema de elegancia, es **operativo**: en free tier
(Render/Railway) el backend duerme a los 15 minutos. Un reclutador abre la web, ve los
skeletons de `Projects.tsx` durante 40 segundos, y si el timeout de axios salta antes lee
literalmente *"No se pudieron cargar los proyectos"*.

**Sin backend:** deploy estático en Vercel/Netlify, carga instantánea, SEO real, coste 0,
cero puntos de fallo.

**El backend no se tira.** Se queda como repo propio, con su Swagger y sus tests — es
exactamente lo que un empleador de Java quiere ver. Solo deja de ser una dependencia en
runtime del sitio público. Se separan los dos objetivos en vez de sacrificar uno.

### Sobre las imágenes

Duda razonable, con respuesta tranquilizadora: **el backend nunca sirvió las imágenes.**
Verificado el 2026-08-05:

- `imageUrl` es una columna de texto (`src/types/index.ts:30`)
- El formulario admin es un `<input type="url">` con placeholder `https://i.imgur.com/...`
  (`src/pages/admin/ProjectForm.tsx:172-177`) — se pega una URL a mano, no se sube un archivo
- **No hay ningún `MultipartFile` ni endpoint de upload** en todo el Spring Boot
- `ProjectCard.tsx:19` hace `<img src={project.imageUrl}>` y el navegador va directo a
  imgur; el tráfico de la imagen nunca pasa por el servidor

Hoy el backend devuelve *el string* y la imagen la carga el navegador de un tercero. Sin
backend, ese mismo string vive en el repo. Idéntico para el navegador — y mejor, porque
permite alojar las imágenes localmente (Fase 3).

---

## Fase 0 — Los datos ✅ resuelta (2026-08-05)

**No se exporta nada del backend.** El catálogo que hay en la BD está desactualizado, así
que Dair lo reescribe entero a mano sobre el andamiaje de la Fase 1.

## Fase 1 — La capa de datos ✅ andamiaje hecho (2026-08-05)

- [x] `src/data/technologies.ts` — catálogo central; los proyectos lo referencian **por
      clave** (`'react'`, `'spring'`), así que una clave mal escrita es un error de
      compilación y no una badge que desaparece en silencio. **Badges solo texto, sin
      iconos** (decidido 2026-08-05) — una línea por tecnología y cero dependencia de un CDN
- [x] `src/data/projects.ts` — el Portfolio Manager real + **3 proyectos inventados** de
      relleno, marcados con `⚠️ PLACEHOLDER`, para poder ver filtros, grilla y modal
      funcionando. **Hay que borrarlos antes del deploy**
- [x] `src/data/skills.ts` — seis entradas de arranque con niveles a ojo
- [ ] **Rellenar el contenido real** ← lo hace Dair

**TypeScript, no JSON.** Si se escribe mal una categoría (`"FRONTEN"`), el build falla en
vez de renderizar una sección vacía en silencio. Con JSON el error no aparece hasta abrir
la web. Además se importan directo, sin `fetch` y sin estado de carga.

Limpieza de tipos en `src/types/index.ts`:

- [x] Eliminados `createdAt` y `updatedAt`. **Verificado: no se usaban en ningún
      componente**, solo existían en el tipo — artefactos de la entidad JPA

> **Cambio respecto al plan original: `id` sigue siendo `number`, no un slug.**
> El motivo apareció al implementar: `src/types/index.ts` es un tipo *compartido* con el
> panel admin, que trata los ids como números (`technologyIds: number[]` en
> `ProjectRequest`, el estado de edición de `Technologies.tsx`). Cambiarlo a string rompía
> la compilación del panel a cambio de nada, porque el sitio público no usa el `id` en
> ninguna URL — solo como React key. Los ids se derivan de la posición en el array, así
> que no hay que mantenerlos a mano. Si algún día hacen falta enlaces directos por
> proyecto, se añade un campo `slug` aparte.

## Fase 2 — Desconectar el sitio público ✅ hecha (2026-08-05)

- [x] `src/sections/Projects.tsx` — fuera el `useEffect`, los estados `loading` y `error`,
      los skeletons y el mensaje *"No se pudieron cargar los proyectos"*. El cálculo de
      categorías disponibles subió a nivel de módulo (`AVAILABLE_CATEGORIES`): el catálogo
      es estático, no hay nada que recalcular por render
- [x] `src/sections/Skills.tsx` — igual, con `GROUPED` a nivel de módulo. Bonus: ese
      `.finally()` sin `.catch()` era el punto 12 de `ANALISIS.md` y desapareció solo
- [x] Verificado: `tsc -b` exit 0, `pnpm lint` limpio, `pnpm build` OK (126 módulos)

Los filtros, la paginación y el modal **no se tocaron**: ya trabajaban sobre un array en
memoria.

**El sitio público ya no hace ni una llamada de red.** Verificado: los únicos importadores
de `src/api/axios.ts` son las cinco páginas de `src/pages/admin/`.

> El bundle sigue en 352 kB / 107 kB gzip porque `AppRouter.tsx` importa el panel admin de
> forma estática, así que axios y las pantallas de administración viajan igual al visitante.
> Eso lo arregla la Fase 4.

## Fase 3 — Imágenes locales

- [ ] Crear `public/projects/` con un archivo por proyecto
- [ ] Referenciarlas en los datos como `/projects/nombre.png`

Quedan versionadas en Git, las sirve el mismo CDN que el resto del sitio, Vite las procesa
en el build (hash + caché eterna) y desaparece la dependencia de imgur. `ProjectCard.tsx`
no cambia una línea, porque `/projects/x.png` es una `src` tan válida como una URL absoluta.

*Pendiente: confirmar si las imágenes están a mano o hay que hacer capturas.*

## Fase 4 — El panel admin ✅ hecha (2026-08-05) — **borrado**

Se descartó el `React.lazy` que proponía este plan. Era un punto medio que pagaba todos los
costos y solo difería la descarga.

**El argumento que decidió:** con el sitio leyendo de `src/data/`, el panel escribía en una
BD que ya nadie lee. Guardar un cambio ahí no producía ningún efecto en la web — no era
código de más, era una funcionalidad que mentía. Y ya había cobrado impuesto: el `id` no
pudo ser un slug porque `ProjectRequest.technologyIds: number[]` del panel exigía números.
Un panel muerto condicionando el diseño del sitio vivo.

Además dejaba `/admin/login` publicado en producción apuntando a un backend dormido — y los
bots escanean `/admin`.

Borrado (1.288 líneas):

- [x] `src/pages/admin/`, `src/layouts/`, `src/router/`, `src/context/`, `src/hooks/useAuth.ts`,
      `src/api/axios.ts`
- [x] `AppRouter` y `MainLayout` colapsados dentro de `App.tsx`: con una sola página, el
      router y el layout eran indirección para nada
- [x] `src/types/index.ts` — fuera `AuthResponse`, `LoginRequest`, `ProjectRequest`,
      `SkillRequest`. Los tipos que quedan describen el catálogo estático, ya no espejan
      los DTO de Java, así que se quitaron los comentarios `// Matches XxxDTO.java`
- [x] `axios` y `react-router-dom` desinstalados
- [x] `.env.example` borrado — el proyecto ya no usa ninguna variable de entorno

### Resultado medido

| Métrica | Antes | Después |
|---|---|---|
| JS bundle | 352.84 kB | **226.53 kB** |
| JS gzip | 107.56 kB | **68.52 kB** (−36 %) |
| CSS | 34.15 kB | 27.33 kB |
| Módulos | 126 | 52 |
| `pnpm audit --prod` | 1 *high* | **0 — "No known vulnerabilities found"** |

La advisory que quedaba abierta desde el Día 1 (`GHSA-qwww-vcr4-c8h2`, en `react-router`,
que pedía un major) desapareció sin parchear nada: se fue con la dependencia.

> El código no se pierde: está en el historial de Git. Si algún día el panel se quiere
> vivo, su lugar es el repo del backend, que es la API que consume.

## Idioma: solo inglés ✅ hecho (2026-08-05)

Se evaluó hacer el sitio bilingüe con un toggle `ES | EN` en el Navbar y se **descartó**.

**El criterio:** el mercado objetivo es remoto internacional. Inglés cubre a toda la
audiencia; español cubre un subconjunto de ella. Bilingüe cubre lo mismo que inglés solo,
al doble de costo — y el costo no son las ~50 líneas de maquinaria, es el **impuesto
editorial permanente**: cada proyecto nuevo son dos descripciones, y en la práctica la
segunda versión se desincroniza.

Argumentos secundarios: el código, los commits y el README ya estaban en inglés por
convención propia (`CLAUDE.md`), así que el sitio en español era la pieza descolgada; y
desaparece el problema de `hreflang` / qué versión indexa Google.

> No es una puerta de una sola dirección: retrofitear i18n más adelante es una tarde de
> trabajo mecánico. Lo caro de rehacer serían las descripciones de los proyectos — por eso
> se decidió **antes** de escribir el catálogo real.

Traducido: Navbar, Hero, About, Projects, Skills, Contact, Footer, ProjectCard,
ProjectModal, las etiquetas de `SKILL_CATEGORIES` y `PROJECT_CATEGORIES`, y los datos de
ejemplo. Verificado con un grep de caracteres acentuados: no queda español en `src/`.

**Bug encontrado y arreglado de paso:** `ProjectCard.tsx` y `ProjectModal.tsx` renderizaban
`project.category` en crudo, así que la insignia mostraba `FULL_STACK` y `API_REST` en vez
de `Full Stack` y `REST API`. Se añadió `projectCategoryLabel()` en `src/types/index.ts`.

`index.html` ya tenía `lang="en"` — estaba mal antes (contenido en español) y ahora quedó
correcto por accidente. El `<title>` pasó de `portfolio-frontend` a
`Dair Guerrero — Full Stack Developer`; el resto del SEO sigue en la Fase 5.

## Fase 5 — Lo que faltaba igual

Ya estaba en `GIT-PLAN.md` como Día 2 y 3. Sin backend deja de ser "pendiente" y pasa a ser
**requisito para publicar**:

- [ ] **EmailJS de verdad** (`src/sections/Contact.tsx:5-7`, hoy con `TU_SERVICE_ID`).
      Sin backend es el único canal de contacto del sitio. Requiere crear la cuenta; las
      claves van a `.env` como `VITE_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY`
- [ ] **Enlaces reales** de LinkedIn y email en `Contact.tsx` y `Footer.tsx`
      (hoy `https://linkedin.com` y `mailto:tu@email.com`). Requiere las URLs de Dair
- [ ] **SEO**: `<title>`, `lang="es"`, meta description, Open Graph. Con un sitio estático
      esto por fin rinde — Google indexa HTML real

## Fase 6 — Deploy

- [ ] Vercel o Netlify conectado al repo. Push → deploy automático. Coste 0, sin cold start

---

## Orden y dependencias

```
Fase 0 → 1 → 2      ← el corazón del cambio: aquí el sitio ya vive sin backend
         ↓
       3 → 4 → 5 → 6
```

Las fases 1 y 2 se hacen del tirón en cuanto haya datos. Las fases 5 y 6 dependen de cosas
externas (cuenta de EmailJS, URLs de redes, cuenta de Vercel).

## Decisiones abiertas

1. ~~¿Los datos se exportan del backend o se escriben a mano?~~ → **a mano** (2026-08-05)
2. ~~¿El panel admin se lazy-loadea o se borra?~~ → **borrado** (2026-08-05)
3. ¿Las imágenes de los proyectos están disponibles? (Fase 3)
