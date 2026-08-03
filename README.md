# Tasks Management

Prueba técnica Senior Full Stack: gestión de proyectos y tareas con tablero kanban
y drag & drop. Backend en Node.js/Express/TypeScript sobre PostgreSQL (Prisma),
frontend en React con TanStack Query y @dnd-kit.

## Funcionalidad

- CRUD de proyectos.
- CRUD de tareas asociadas a un proyecto, con `status` (`TODO` / `IN_PROGRESS` / `DONE`)
  y `priority` (`LOW` / `MEDIUM` / `HIGH`).
- Tablero kanban por proyecto, con cambio de estado por drag & drop (PATCH optimista
  con rollback si falla) y un `<select>` de status en el formulario de edición como
  vía alternativa accesible.
- Sin autenticación: fuera de alcance para poder enfocar el tiempo de la prueba en el
  CRUD, el tablero y el drag & drop en vez de en un sistema de login/sesión.

## Stack y por qué

- **TypeScript** en todo el monorepo (server y client): tipado end-to-end entre el
  contrato de la API (schemas Zod, tipos de Prisma) y el consumo en el frontend,
  detecta desalineaciones de contrato en tiempo de compilación en vez de en runtime.
- **Prisma** como ORM: schema declarativo con migraciones versionadas, cliente
  tipado generado a partir del schema (los tipos de `Project`/`Task` en el frontend
  están calcados de ahí, no inventados a mano).
- **Zod** para validación: schemas de request body/params reusables tanto como
  fuente de los tipos de TypeScript como de los mensajes de error consistentes
  (`{ error, details }`) que devuelve la API.
- **TanStack Query** en el cliente: cache, invalidación y estados de carga/error
  declarativos para las llamadas a la API, con soporte de mutations optimistas
  (usado en el drag & drop del kanban) sin tener que escribir ese manejo a mano.
- **@dnd-kit** (`core` + `utilities`, sin `sortable`) para el drag & drop: la
  librería resuelve arrastrar tarjetas entre columnas sin imponer un modelo de
  orden dentro de una columna, que no forma parte del alcance (no hay contrato de
  orden entre tareas del mismo status). `sortable` habría sumado una dependencia
  no justificada por el requisito.
- **PostgreSQL vía Docker Compose**: un contenedor `db` para desarrollo y uno
  `db_test` aparte (con `tmpfs`, sin persistencia) para no correr los tests de
  integración contra los mismos datos que se usan manualmente en el navegador.

## Estructura del repo

```
tasks-management/
├── docker-compose.yml       # postgres (dev, puerto 5432) + postgres (test, puerto 5433)
├── server/
│   ├── prisma/               # schema.prisma + migraciones
│   ├── src/
│   │   ├── routes/           # definición de endpoints
│   │   ├── controllers/      # traducen HTTP <-> service, sin lógica de negocio
│   │   ├── services/         # lógica de negocio + acceso a Prisma
│   │   ├── schemas/          # validación Zod (body/params)
│   │   ├── middlewares/      # validate, asyncHandler, errorHandler
│   │   ├── lib/               # cliente Prisma singleton
│   │   ├── app.ts            # app de Express (sin levantar el puerto, para testear con Supertest)
│   │   └── index.ts          # entrypoint real (levanta el puerto)
│   └── tests/                # integración con Vitest + Supertest contra db_test
└── client/
    ├── src/
    │   ├── api/               # cliente fetch + tipos + hooks de TanStack Query
    │   └── features/
    │       ├── projects/
    │       └── tasks/
    └── ...
```

## Requisitos previos

- Node.js 20+ y npm.
- Docker y Docker Compose.

## Arranque paso a paso

### 1. Bases de datos (Docker)

Desde la raíz del repo:

```bash
docker compose up -d
```

Esto levanta dos contenedores Postgres: `db` (puerto `5432`, dev, con datos
persistentes) y `db_test` (puerto `5433`, para tests de integración, sin
persistencia — se resetea cada vez que se recrea el contenedor).

> Si el puerto `5432` ya está ocupado en tu máquina (por ejemplo por una
> instalación nativa de PostgreSQL), cambiá el mapeo de puertos en
> `docker-compose.yml` (ej. `"5434:5432"`) y actualizá `DATABASE_URL` en el
> `.env` del server acorde.

### 2. Backend

```bash
cd server
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

- `.env.example` ya trae valores que funcionan out-of-the-box contra los
  contenedores de Docker Compose del paso 1 — no hace falta editar nada salvo
  que hayas cambiado los puertos.
- `npm run prisma:migrate` aplica las migraciones existentes contra `db` (dev).
- El servidor queda escuchando en `http://localhost:3001` (`GET /health` para
  verificar que responde).

### 3. Frontend

En otra terminal:

```bash
cd client
npm install
npm run dev
```

Vite levanta el cliente en `http://localhost:5173` (o el próximo puerto libre).
La URL base del backend está hardcodeada como `http://localhost:3001` en
`client/src/api/client.ts` — no requiere variables de entorno propias.

### 4. Verificar

Con ambos procesos corriendo y Docker levantado, abrí `http://localhost:5173`:
crear un proyecto, entrar a su detalle, crear tareas y arrastrarlas entre
columnas del tablero.

## Tests

Los tests de integración del backend corren contra `db_test` (Postgres real,
sin mocks de Prisma):

```bash
cd server
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tasks_management_test" npx prisma migrate deploy   # solo la primera vez, o si recreaste el contenedor db_test desde cero
npm test
```

> `db_test` usa `tmpfs` (sin persistencia): si el contenedor se recrea (no solo
> se reinicia), hay que volver a aplicar las migraciones contra el puerto
> `5433` antes de correr los tests, como arriba. Si el contenedor sigue vivo de
> una corrida anterior con el schema ya aplicado, `npm test` alcanza directo.
> `npm test` internamente usa `TEST_DATABASE_URL` del `.env` (remapeado a
> `DATABASE_URL` en `vitest.config.ts`), no la variable de entorno de este
> comando puntual.

## Decisiones de arquitectura

- **Capas `routes → controller → service`**: las rutas solo declaran endpoints y
  middlewares (validación); los controllers traducen HTTP (status codes, forma
  de la respuesta) sin contener lógica de negocio; los services concentran el
  acceso a Prisma y las reglas propias del dominio. Separación pensada para que
  la lógica de negocio sea testeable/reusable sin depender de `req`/`res`.
- **Validación con Zod como middleware transversal** (`validate.ts`), no repetida
  en cada controller: cada recurso define sus schemas (`create`/`update`/params)
  y el middleware los aplica antes de que la request llegue al controller, que
  puede asumir que el body/params ya son válidos y del tipo correcto.
- **Errores en formato consistente** `{ error, details }`: 400 con `details` del
  `flatten()` de Zod, 404 solo con `error`, 500 genérico desde un
  `error-handler` centralizado al final de `app.ts`.
- **Tests de integración contra Postgres real, sin mocks de Prisma**: corren
  contra el contenedor `db_test` dedicado, con un `beforeEach` global que limpia
  las tablas (`deleteMany` en `Project`, que hace cascade sobre `Task`). Se
  descartó aislar cada test en una transacción con rollback porque hubiera
  requerido inyectar un cliente Prisma scoped en cada service, tocando la
  arquitectura de producción solo para poder testear. Como contrapartida, los
  archivos de test corren en serie (`fileParallelism: false` en
  `vitest.config.ts`) para que no haya carreras entre un archivo limpiando la
  tabla y otro afirmando sobre filas recién creadas.
- **`app.ts` separado de `index.ts`**: `app.ts` exporta la app de Express sin
  levantar el puerto, para poder testear con Supertest sin abrir un socket real;
  `index.ts` es el entrypoint que sí lo levanta.
- **PATCH optimista en el drag & drop**: `useUpdateTask` (TanStack Query) aplica
  el cambio de status en cache antes de que responda el server (`onMutate`),
  hace rollback si falla (`onError` restaura el snapshot previo) y siempre
  reconcilia con el server al final (`onSettled`). El mismo hook sirve tanto
  para el PATCH completo del formulario de edición como para el PATCH de solo
  `status` del drag, sin duplicar el mecanismo optimista.
- **Sin `@dnd-kit/sortable`**: no hay contrato de orden dentro de una columna,
  solo mover tarjetas entre columnas — `useDraggable`/`useDroppable`/
  `DndContext` de `@dnd-kit/core` alcanza sin sumar una dependencia extra.

## Limitaciones conocidas

- Sin autenticación ni autorización — cualquiera con acceso a la API puede
  operar sobre cualquier proyecto/tarea. Fuera de alcance del MVP.
- Frontend sin sistema de estilos propio (CSS default del scaffold de Vite, con
  algunas excepciones puntuales de estilos inline documentadas en el código
  donde eran necesarias para que el tablero kanban fuera legible como tal).
- No hay reordenamiento de tareas dentro de una misma columna — el drag & drop
  solo cambia `status` al mover entre columnas.
- `GET /projects/:id/tasks` no soporta filtro por status en el contrato de la
  API; el agrupamiento por columna del kanban se hace client-side sobre un
  único fetch.
- El drag & drop con mouse no está completamente pulido para teclado/lectores
  de pantalla (hay soporte técnico básico vía `KeyboardSensor`, sin
  `announcements` ni `DragOverlay` custom); el `<select>` de status en el
  formulario de edición es la vía accesible recomendada.
- La URL base de la API está hardcodeada en el cliente (`http://localhost:3001`)
  en vez de vivir en una variable de entorno — suficiente para el alcance de
  esta prueba (un solo entorno local), documentado como simplificación
  deliberada.
