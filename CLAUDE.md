# Portafolio v2 — dair.dev

Portafolio personal de Dair Guerrero, desarrollador full stack (Java + Spring Boot en backend, React + TypeScript en frontend). Esta es la versión 2: se reconstruye desde cero en **Astro**, reutilizando solo lo que se indica abajo.

Este archivo es la fuente de verdad. Si una instrucción de una fase contradice este archivo, pregunta antes de seguir.

## Cómo trabajamos

- Trabajamos **por fases**. Haz solo la fase que se te pide. No adelantes trabajo de fases siguientes.
- Antes de escribir código en una fase grande, muestra un plan corto (archivos que vas a crear o cambiar) y espera el visto bueno.
- Al terminar cada fase: corre `pnpm build` y `pnpm astro check`, corrige los errores y termina con un resumen corto en el chat: qué hiciste, qué quedó pendiente y qué debo revisar yo.
- No inventes datos personales, métricas, proyectos ni testimonios. Si falta un dato, deja `TODO(dair): …` en el código y lístalo en el resumen.
- Gestor de paquetes: **pnpm**. Nunca npm ni yarn.

## Prohibido

- **Git**: no ejecutes ningún comando que modifique el repo: `commit`, `push`, `merge`, `rebase`, `reset`, `stash`, `checkout -b`, `branch`, `tag`. Git lo manejo yo. Solo puedes leer (`status`, `diff`, `log`).
- **Comentarios en el código**: no comentes. El código se explica con buenos nombres y funciones pequeñas. La única excepción es una línea cuando hay un porqué que no se deduce del código (un workaround, una restricción externa). Nada de comentarios que repiten lo que hace el código, bloques de documentación, ni separadores decorativos.
- **Documentos**: no crees archivos `.md`, notas, planes, changelogs ni README extensos. Los resúmenes van en el chat.
- **Código muerto**: nada de código comentado, `console.log`, archivos sin usar ni dependencias que no se usen.

## Código limpio

- Componentes pequeños, con una sola responsabilidad. Si un archivo pasa de ~150 líneas, divídelo.
- Nombres descriptivos en inglés. Nada de abreviaturas raras.
- Sin valores mágicos: colores, tamaños y textos repetidos salen de tokens o de `src/data`.
- Tipos explícitos en props y datos. Nada de `any`.
- Formato consistente con Prettier (con el plugin de Astro) y ESLint sin errores ni advertencias.
- En los .astro, nunca pegues texto a una {expresión} sin espacio (por ejemplo /api/{id} o PR #{n}): arma el texto completo en el frontmatter y renderiza una sola expresión.

## Stack

- Astro (última versión estable), salida estática, desplegado en Vercel.
- TypeScript estricto.
- Tailwind CSS 4 con `@tailwindcss/vite`, tokens definidos en `@theme`.
- MDX y content collections con esquema Zod para los proyectos.
- React solo como isla donde haga falta interactividad real. Por defecto, componentes `.astro` sin JavaScript.
- Fuentes autoalojadas con `@fontsource` (nunca `@import` de Google Fonts).
- View Transitions de Astro para la navegación entre páginas.

## Qué se reutiliza de la v1

- `scripts/fetch-prs.ts` y `.github/workflows/refresh-opensource.yml`: trae los PRs aceptados de GitHub al compilar. Se mantiene, pero en la página solo se muestran los PRs elegidos a mano (ver Contenido).
- Nada más de la v1: ni el hero de terminal, ni el efecto CRT, ni la paleta ámbar.

## Idioma

- Todo el texto visible del sitio va en **inglés** (público: reclutadores internacionales, trabajo remoto).

## Colores: regla 60/30/10, dos modos

Un solo color de marca: el **rojo tomate**. El modo oscuro es el claro con los papeles invertidos, para que los dos se sientan del mismo sitio.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `bg` (60 %) | `#F7F1EC` marfil | `#160E0F` vino noche | Fondo de página |
| `text` (30 %) | `#2A1418` vino | `#F2EAE4` marfil | Títulos y texto principal |
| `muted` | `#76625F` | `#A8958F` | Texto secundario (mín. 4.5:1) |
| `line` | `#E6DAD3` | `#2E2223` | Bordes y separadores |
| `surface` | `#EFE6E0` | `#231819` | Tarjetas |
| `band` | `#F1E8E2` | `#1C1314` | Fondo de secciones alternas |
| `accent` (10 %) | `#D93A25` | `#F0513A` | Botón principal, detalles |
| `on-accent` | `#FFFFFF` | `#160E0F` | Texto sobre `accent` |
| `feature` | `#2A1418` | `#231819` | Bloque destacado (código, diagramas) |
| `feature-text` | `#F7F1EC` | `#F2EAE4` | Texto en `feature` |
| `feature-muted` | `#D9C9C2` | `#A8958F` | Texto secundario en `feature` |
| `feature-accent` | `#FF7A63` | `#F0513A` | Acento dentro de `feature` |
| `glass` | `rgba(247,241,236,.62)` | `rgba(35,24,25,.55)` | Fondo de la barra de navegación |
| `glass-line` | `rgba(42,20,24,.12)` | `rgba(242,234,228,.12)` | Borde de la barra de navegación |

Reglas de color:
- El `accent` es solo para: botón principal, punto de disponibilidad, números grandes de sección, subrayado de links destacados y detalles pequeños. Nunca en superficies grandes.
- En modo claro, el rojo **no** se usa como color de texto por debajo de 24 px (contraste 4.1:1). Los links pequeños van en `text` con subrayado.
- Todo texto debe pasar WCAG AA: 4.5:1 normal, 3:1 grande.
- Implementación: variables CSS en `:root` (claro) y `[data-theme="dark"]`, mapeadas a `@theme` de Tailwind para usar `bg-bg`, `text-muted`, etc.

## Tipografía

| Rol | Fuente | Pesos |
| --- | --- | --- |
| Títulos, logo, números | Space Grotesk | 500, 700 |
| Texto | Inter | 400, 500, 600 |
| Código y datos | JetBrains Mono | 400, 500 |

- Nombre en el hero: `clamp(56px, 8vw, 104px)`, interletrado `-0.045em`, interlineado 0.95.
- Títulos de sección: `clamp(36px, 4.5vw, 52px)`, interletrado `-0.03em`.
- Texto de lectura: 17–19 px, interlineado 1.6–1.75, máximo ~70 caracteres por línea.
- Mínimo absoluto: 13 px. Nada de etiquetas en mayúsculas con mucho espaciado.

## Componentes clave

- **Barra de navegación**: píldora flotante centrada, fija arriba (`position: sticky; top: 16px`), efecto vidrio (`backdrop-filter: blur(18px) saturate(160%)`, fondo `glass`, borde `glass-line`, sombra suave y un brillo interior arriba). Contiene: logo `dair.dev` (el punto en `accent`), links Work, Open source, About, Contact, botón Résumé y botón de tema. Marca la sección activa. En móvil, menú que se cierra con Escape y al tocar fuera.
- **Botón de tema**: claro/oscuro. Respeta `prefers-color-scheme` la primera vez y recuerda la elección en `localStorage`. Script en línea en el `<head>` para que no haya parpadeo al cargar.
- **Botones**: principal (fondo `accent`), secundario (borde `text`). Altura mínima 44 px.

## Estructura del sitio

- `/` home: hero → trabajo seleccionado → open source → about → contacto.
- `/projects/[slug]`: caso de estudio por proyecto.
- `/resume.pdf`: CV descargable (archivo lo pongo yo).
- `404` propia.

### Home

1. **Hero**: "Available for work · Colombia (UTC-5) · Remote" con punto `accent`; nombre; una frase de lo que hago; botones "View my work" y "Get in touch"; links a GitHub y LinkedIn; hora actual de Bogotá. A la derecha, el concepto "del backend a la pantalla": una respuesta JSON real de la API (`GET /api/projects/1`) y debajo la misma info como tarjeta.
2. **Selected work**: 3 proyectos grandes, numerados `01` `02` `03`, imagen y texto alternando de lado. Cada uno: nombre, problema en una línea, rol y stack, link "Read the case study →".
3. **Open source**: 3 PRs elegidos a mano, cada uno con repo, título, una línea de qué resolví y link. Debajo, "N merged PRs across M organizations · see all" con los números del script.
4. **About**: foto, párrafo en primera persona, stack en tres filas (Every day / Worked with / Learning now).
5. **Contact**: título grande, email con botón de copiar (feedback "Copied" 1.6 s), links a LinkedIn, GitHub y CV.

### Caso de estudio

Título y una línea → botones de código y demo → franja de datos (año, rol, stack, alcance) → diagrama del flujo de una petición → el problema → decisiones clave (tarjetas numeradas) → qué haría distinto → siguiente proyecto.

## Reglas de UX (no negociables)

- El contenido se ve desde el primer frame. Ninguna animación retrasa ni oculta texto.
- Animaciones:
  - GSAP permitido (con SplitText, ScrambleText y ScrollTrigger), cargado con import dinámico y nunca descargado con `prefers-reduced-motion`.
  - Hover y foco: ≤ 300 ms.
  - Entrada y scroll: ≤ 800 ms, una sola vez (la del hero, una vez por sesión).
  - El contenido nunca desaparece para animarse: se anima a partir del texto visible.
  - Nada se mueve solo más de 5 s; si hace falta más, lleva control de pausa.
  - Cero CLS por animaciones.
- Nada de modales para proyectos: cada proyecto es una página con URL propia.
- Todo lo clicable es `<a>` o `<button>` real, accesible con teclado y con foco visible.
- Imágenes con `alt`, ancho y alto definidos, formato optimizado (`astro:assets`).
- Cada página indexable con `title`, `description`, Open Graph y `canonical`; las páginas `noindex` sin `canonical` ni `og:url`.
- Objetivo: Lighthouse ≥ 95 en las cuatro categorías.

## Datos reales que ya existen

- GitHub: `https://github.com/dair7`
- Backend del proyecto principal: `https://github.com/dair7/dev-portfolio-manager` (Spring Boot, Java 17, JPA, PostgreSQL, Spring Security + JWT, DTOs con mappers, servicios con interfaces, secretos en variables de entorno, `open-in-view` desactivado). Endpoints: CRUD de `/api/projects` y `/api/technologies`.
- PRs a destacar:
  - `Predictify-org/predictify-backend#873`: reconcile circuit breaker API and mount impersonate router.
  - `ThinknetCollective/mesh-up_api#46`: cursor-based pagination for solutions, comments and search.
  - `Stellar-Uzima/Uzima-Frontend#328`: multi-select and bulk actions in the admin user table.

## Datos que faltan (dejar TODO)

Email, URL de LinkedIn, foto, CV en PDF, proyectos 02 y 03, el porqué del proyecto Portfolio Manager, una línea de explicación por cada PR, qué estoy aprendiendo ahora.
