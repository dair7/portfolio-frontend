# Análisis del proyecto — Portfolio Manager

> Fecha: 2026-07-31
> Alcance: `portfolio-manager/` (Spring Boot 4.0.2) + `portfolio-frontend/` (React 19 + Vite + TS)
> Verificado con: `mvnw -o clean compile` (OK), `tsc -b` (OK), `eslint .` (1 error), `npm audit`, `npm outdated`

---

## 1. Veredicto: ¿es necesario el backend?

**Para el sitio público, no. Como pieza de portafolio, sí — pero el sitio público no debe depender de él en runtime.**

Los datos que sirve la API son:
- ~10 proyectos, ~15 skills, ~15 tecnologías
- 100% públicos (`GET /api/projects`, `/skills`, `/technologies` son `permitAll`)
- Los edita **una sola persona**, quizás una vez al mes

Eso es un CMS para un usuario sobre un dataset que cabe en un JSON de 8 KB. Toda la maquinaria
(PostgreSQL + JPA + Specifications + JWT + BCrypt + Swagger) existe para evitar editar un archivo.

**El problema real no es la elegancia, es operativo:** un portafolio se despliega en free tier
(Render/Railway/Fly). Ahí el backend duerme tras 15 min de inactividad. Un reclutador abre la web,
ve los skeletons de `Projects.tsx` durante 30-50 segundos de cold start, y si el timeout de axios
salta antes, lee literalmente *"No se pudieron cargar los proyectos"*. Sumado a que PostgreSQL
gestionado suele costar dinero real, el backend convierte la carta de presentación en el punto de fallo.

### Propuesta: separar los dos objetivos (sin tirar nada)

| Objetivo | Solución |
|---|---|
| Sitio público rápido y siempre vivo | Generar los JSON en **build time**: un script que llama a la API, vuelca `projects.json`/`skills.json` a `public/`, y el sitio los lee. Deploy estático en Vercel/Netlify → carga instantánea, SEO real, coste 0. |
| Panel admin | Sigue usando la API real. Solo lo uso yo, y no importa si tarda 40s en despertar. |
| El backend como demo técnica | Sigue existiendo, con su Swagger público. Es exactamente lo que un empleador de Java quiere ver. |

Alternativa mínima si no se quiere tocar el pipeline: cachear la respuesta en `localStorage` con un
`projects.json` estático como *fallback* cuando la API falle. Menos limpio, ~20 líneas.

### Sobre "eficiente"

A esta escala, el `FetchType.EAGER` del `@ManyToMany` y la falta de paginación **no importan** — son
10 filas. No perder tiempo optimizando eso.

Lo que sí es desperdicio real: el backend implementa filtrado por categoría y tecnología
(`ProjectSpecification`, `?category=&technology=`) y **el frontend nunca lo llama** — `Projects.tsx:23`
trae todo y filtra/pagina en memoria. Código muerto en el backend.

---

## 2. Errores encontrados

### 🔴 Críticos (rompen funcionalidad visible)

**1. El formulario de contacto no funciona.** `src/sections/Contact.tsx:5-7`:
```ts
const SERVICE_ID  = 'TU_SERVICE_ID'
const TEMPLATE_ID = 'TU_TEMPLATE_ID'
const PUBLIC_KEY  = 'TU_PUBLIC_KEY'
```
Todo visitante que envíe el formulario ve *"Error al enviar"*. Es el bug más caro del proyecto: es el
único canal de contacto de un portafolio. Además, deberían ir en `.env` (`VITE_EMAILJS_*`), no hardcodeados.

**2. Enlaces placeholder rotos.**
- `Contact.tsx`: LinkedIn → `https://linkedin.com` (home genérica), Email → `mailto:tu@email.com`
- `Footer.tsx`: GitHub → `https://github.com` sin usuario, LinkedIn → `https://linkedin.com`
- `Hero.tsx` sí usa `github.com/dair7`, pero su LinkedIn también está genérico

**3. Login con credenciales incorrectas devuelve HTTP 500, no 401.** `AuthServiceImpl.login()` deja
escapar `BadCredentialsException`; como se lanza dentro del controller (no en la cadena de filtros),
la atrapa el `@ExceptionHandler(Exception.class)` de `GlobalExceptionHandler.java:66`. El frontend lo
disimula porque usa un `catch` genérico, pero la API está mal y el interceptor 401 de `axios.ts:19`
nunca dispara para este caso.

**4. `npm run lint` falla.** 1 error en `AuthContext.tsx:49`
(`react-refresh/only-export-components`, por exportar `useAuth` junto al provider).
Un comando del propio `package.json` está roto.

### 🟠 Seguridad

**5. CORS abierto y duplicado.** Hay **dos** configuraciones compitiendo:
- `CorsConfig.java:17` → `allowedOrigins("*")` vía `WebMvcConfigurer`
- `SecurityConfig.java:88-91` → `allowedOriginPatterns("*")` **con `allowCredentials(true)`**

Cualquier web del mundo puede llamar la API. El impacto real es bajo (el token va por header, no por
cookie), pero es una configuración indefendible en una entrevista técnica. Elegir una sola fuente y
restringirla al dominio propio + `localhost:5173`.

**6. El handler genérico filtra internos.** `GlobalExceptionHandler.java:71` devuelve `ex.getMessage()`
al cliente en cualquier 500 → mensajes de Hibernate/SQL expuestos.

**7. Secreto JWT con default inseguro.** `JwtUtil.java:18`: `@Value("${jwt.secret:mySecretKey}")`.
Ese default tiene <32 bytes, así que `Keys.hmacShaKeyFor()` lanzaría `WeakKeyException` en runtime.
El fallback no salva nada y esconde un error de configuración — mejor que falle al arrancar.

**8. Sin rate limiting en `/api/auth/login`.** Un solo usuario admin, endpoint público, fuerza bruta ilimitada.

**9. Token de 24h en `localStorage`**, sin refresh token ni revocación server-side. `logout()` solo
borra el cliente; el token sigue siendo válido hasta que expire.

**10. Las URLs no se validan.** `ProjectRequestDTO` usa `@NotBlank` en `githubUrl` pero no valida el
esquema. Se puede guardar `javascript:alert(1)` y `ProjectCard.tsx` lo renderiza en `href`. Solo
explotable por el admin, pero es un `@URL`/`@Pattern` de una línea.

**11. `PrivateRoute` no comprueba rol.** `PrivateRoute.tsx:6` solo mira `token`. `isAdmin` está
definido en `AuthContext.tsx:40` y **no se usa en ningún sitio**. Inocuo hoy (hay un usuario), pero
es una guarda a medias.

### 🟡 Robustez y lógica

**12. Promesas sin `catch`.** `Dashboard.fetchProjects`, `Skills.fetchSkills`,
`Technologies.fetchTechnologies` y `ProjectForm.load` usan `try { } finally { }` **sin `catch`**.
Si la API falla, se produce un unhandled rejection y la UI muestra el estado vacío
("No hay proyectos todavía") como si fuera correcto — mentira al usuario. `Projects.tsx` sí lo hace bien.

**13. `SkillServiceImpl.update` no valida duplicados** (`SkillServiceImpl.java:44`), mientras `create`
sí y `TechnologyServiceImpl.update` sí. Se puede renombrar una skill al nombre exacto de otra. Peor:
`Skill.name` **no tiene `unique = true`** en la entidad (`Technology.name` sí), así que la BD tampoco lo impide.

**14. La app no arranca sin `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_EMAIL`.**
`DataInitializer.java:16-24` las inyecta sin default → fallo de arranque.
**Y no están documentadas en `CLAUDE.md`.** Quien clone esto no puede levantarlo.

**15. `ddl-auto=update` sin migraciones.** Sin Flyway/Liquibase no se puede renombrar una columna, no
hay historial de esquema, y `update` nunca elimina nada (columnas huérfanas para siempre).

**16. `window.location.href` en el interceptor 401** (`axios.ts:24`) fuerza un recargo completo y
destruye el estado de React Router. Como los GET públicos no requieren auth, un 401 espurio en la home
expulsaría a un visitante anónimo al panel de login.

**17. `@Data` de Lombok en entidades JPA.** Genera `equals`/`hashCode` sobre todos los campos, incluida
la colección `Set<Technology>` — antipatrón conocido con proxies de Hibernate y colecciones lazy.
Usar `@Getter/@Setter` + `equals` por `id`.

### 🔵 Calidad, accesibilidad, duplicación

**18. `ProjectCard` no es accesible.** Es un `<article onClick>` sin `role="button"`, `tabIndex={0}`
ni handler de teclado → imposible abrir el modal sin ratón. `ProjectModal` no tiene `role="dialog"`,
`aria-modal` ni focus trap (sí maneja Escape y scroll lock, eso está bien).

**19. SEO inexistente.** `index.html`: `<title>portfolio-frontend</title>`, `lang="en"` con todo el
contenido en español, sin meta description, sin Open Graph. Para un portafolio que debe aparecer en
Google y verse bien al compartir en LinkedIn, esto es grave.

**20. Duplicación.** El bloque "skills agrupadas + barra de progreso" está casi idéntico en
`sections/Skills.tsx` y `pages/admin/Skills.tsx`. El SVG de GitHub está inline **5 veces**
(Hero, Footer, Contact, ProjectCard, ProjectModal). Existe `public/icons.svg` y **no se usa en ningún lado**.

**21. Español inconsistente:** voseo (*"Revisá los datos"*, *"Completá los datos"*, *"Modificá"*)
mezclado con tuteo (*"Selecciona una categoría"*, *"Escríbeme"*) en la misma UI.

**22. `confirm()` nativo** para los borrados — funcional, pero rompe la estética del panel.

---

## 3. Dependencias

### Frontend — 5 vulnerabilidades (4 high), todas en `react-router-dom` 7.14.0

| CVE | Tipo |
|---|---|
| GHSA-wrjc-x8rr-h8h6 | Open redirect vía backslash en `<Link>`/`useNavigate` |
| GHSA-h8fp-f39c-q6mh | XSS (falta validación de protocolo) |
| GHSA-337j-9hxr-rhxg | Inyección de constructor arbitrario |
| GHSA-chx6-hx7r-mcp5 | DoS no autenticado por route matching ineficiente |
| GHSA-qwww-vcr4-c8h2 | Bypass CSRF en modo RSC |

Se arreglan actualizando a `react-router-dom@7.18.2`. **Prioridad alta.**
El resto (axios 1.15→1.19, tailwind 4.2→4.3, react 19.2.5→19.2.8) son menores sin urgencia.

**Dos lockfiles coexistiendo:** `package-lock.json` y `pnpm-lock.yaml`. Elegir un gestor y borrar el
otro lockfile, o habrá instalaciones divergentes entre local y CI.

### Backend

Limpio, compila sin warnings (`mvnw -o clean compile`, exit 0). Dos notas:
- `springdoc-openapi 2.8.6` está pineado a mano contra **Spring Boot 4.0.2**. La serie 2.x está
  diseñada para Boot 3.x. Compila, pero conviene validar en arranque real (2.9.0 ya está en el caché
  local de Maven).
- `java.version` = 17, pero hay **JDK 21 LTS** instalado. Subirlo a 21.

---

## 4. Tests

**Estado: prácticamente inexistentes.**

- **Frontend: 0 tests.** No hay Vitest, ni Testing Library, ni siquiera la dependencia instalada.
- **Backend: 1 test**, `PortfolioManagerApplicationTests.contextLoads()` — el que genera Spring Initializr, vacío.

Peor: ese único test es `@SpringBootTest`, así que **requiere un PostgreSQL vivo y las 6 variables de
entorno** para pasar. En la práctica no se puede ejecutar. Confirmado: al intentar `mvnw test`, ni
siquiera está descargado el plugin surefire en el caché local de Maven — **los tests nunca se han
ejecutado en esta máquina.**

Qué falta, por orden de retorno:
1. Tests de servicio con Mockito (`ProjectServiceImpl`, `SkillServiceImpl`) — sin BD, rápidos, cubren
   la lógica de duplicados y `ResourceNotFound`
2. `@WebMvcTest` + `spring-security-test` para verificar que los `POST/PUT/DELETE` devuelven 401/403
   sin token (la dependencia ya está declarada y sin usar)
3. **Testcontainers** para el test de integración, en vez de depender del Postgres local
4. Vitest + Testing Library en el frontend: `AuthContext`, `PrivateRoute`, y el filtrado/paginación de `Projects.tsx`

---

## 5. Documentación y tooling

**🔴 No hay repositorio Git.** Ni en el backend ni en el frontend (`git status` → *not a repository*).
Hay `.gitignore` y `.gitattributes` listos, pero nunca se hizo `git init`. Para un proyecto cuyo
propósito **es** demostrar el trabajo propio, esto es lo más grave de toda la lista: no hay historial,
no hay backup, no hay nada que enlazar en un CV. Y `portfolio-manager.zip` en la raíz sugiere que el
"control de versiones" actual es copiar carpetas.

**`CLAUDE.md` está desactualizado y contradice el código:**
- Documenta un modelo `Category (1)──(N) Project` con `dto/categoryDTO/` — **no existe**.
  El real es `ProjectCategory` (enum) + entidades `Skill`/`SkillCategory`
- No menciona `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`ADMIN_EMAIL`, **obligatorias para arrancar**
- No menciona los endpoints de skills ni Swagger
- Dice que las rutas públicas son `/api/auth/**`, pero `SecurityConfig` solo abre `/api/auth/login`
  (correcto) y además todos los GET de projects/technologies/skills

**READMEs:** el del frontend es el template de Vite **sin tocar una línea** (habla de React Compiler y
config de ESLint). El backend tiene `HELP.md` de Spring Initializr y ningún README propio.
No hay ni una captura de pantalla.

**Falta todo lo de infraestructura:** sin `.env.example`, sin CI (GitHub Actions), sin `Dockerfile`,
sin `docker-compose.yml` (que resolvería el Postgres local de un comando), sin colección
Postman/`.http`, sin configuración de despliegue.

**Basura en el árbol:** `.idea/` con `workspace.xml`, `portfolio-manager.zip`, y la anidación
redundante `portfolio-manager/portfolio-manager/`.

---

## 6. Plan propuesto, por orden

### Hoy (2-3 h) — cosas que están rotas ahora mismo
- [ ] 1. `git init` + primer commit en ambos proyectos, y subir a GitHub
- [ ] 2. `npm i react-router-dom@latest` (4 vulnerabilidades high)
- [ ] 3. Configurar EmailJS de verdad, moviendo las claves a `.env`
- [ ] 4. Arreglar los enlaces LinkedIn/GitHub/email placeholder
- [ ] 5. Arreglar el lint error de `AuthContext.tsx`

### Esta semana (1 día)
- [ ] 6. `@ExceptionHandler(BadCredentialsException)` → 401, y dejar de devolver `ex.getMessage()` en el 500
- [ ] 7. Eliminar `CorsConfig.java` y restringir el CORS de `SecurityConfig` a los dominios reales
- [ ] 8. Quitar el default `mySecretKey` del JWT
- [ ] 9. Añadir `catch` a las cuatro llamadas que solo tienen `try/finally`
- [ ] 10. SEO: `<title>`, `lang="es"`, meta description, Open Graph
- [ ] 11. Actualizar `CLAUDE.md` y escribir READMEs reales con capturas

### El cambio estructural (1-2 días) — el que más vale
- [ ] 12. Desacoplar el sitio público del backend (JSON generado en build). Es lo que convierte esto
      de "un portafolio frágil" a "un portafolio que siempre carga".
- [ ] 13. `docker-compose.yml` con Postgres + `.env.example`, para que cualquiera lo levante en un comando

### Deuda técnica (cuando toque que se vea profesional)
- [ ] 14. Tests de servicio con Mockito + `@WebMvcTest` de seguridad + Testcontainers
- [ ] 15. Flyway para migraciones, en lugar de `ddl-auto=update`
- [ ] 16. Accesibilidad de `ProjectCard`/`ProjectModal` (teclado + roles ARIA)
- [ ] 17. GitHub Actions: `mvn test` + `npm run lint && npm run build` en cada push
- [ ] 18. Rate limiting en el login (Bucket4j)
- [ ] 19. Java 17 → 21

### Lo que NO hacer
Optimizar el `EAGER`/N+1, añadir paginación al backend, o meter MapStruct. Con 10 proyectos no cambia
nada medible y distrae de los 5 puntos de arriba, que sí se notan.
