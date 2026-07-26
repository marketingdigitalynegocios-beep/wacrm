# AGENT_SETUP.md — Guía de Transformación: WACRM SaaS → Producto Base para Clientes

> **Para el agente de IA:** Este archivo es tu punto de partida. Lee todo antes de ejecutar cualquier cambio. Contiene el contexto completo del proyecto, la estrategia comercial, y las tareas exactas que debes realizar en este repositorio.

---

## 1. Contexto del Proyecto

### ¿Qué es este repositorio?

Este es **WACRM** — un CRM con integración de WhatsApp Business API construido con:
- **Next.js 15** (App Router)
- **Supabase** (base de datos PostgreSQL + auth)
- **WhatsApp Cloud API** (Meta for Developers)
- **Tailwind CSS + shadcn/ui**
- **i18n** (react-i18next, soporte ES/EN)

### ¿Qué fue originalmente?

Originalmente era una aplicación **SaaS multi-tenant**: una sola instancia servía a múltiples clientes ("cuentas"), con facturación mensual vía Wompi, landing page de venta, y una sola App de Meta compartida para el flujo de conexión WhatsApp.

### ¿Qué queremos que sea ahora?

**Producto base para implementación por cliente.** La estrategia comercial es:

1. El dueño de este repo vende e implementa el sistema a **negocios pequeños y medianos**.
2. Cada cliente recibe **su propia instancia** del sistema (su propio despliegue, su propio Supabase, su propio dominio).
3. Cada cliente **crea su propia App en Meta for Developers** y conecta su WhatsApp Oficial.
4. Este repo es el **código base limpio** del que se hace un **fork por cada cliente nuevo**.
5. Los clientes pagan directamente al implementador — no hay facturación dentro del sistema.

### Estructura de repos (referencia, no ejecutar)

```
wacrm-base (este repo, privado)     ← código limpio, sin datos de cliente
├── fork → wacrm-cliente-A          ← instalación de Cliente A
├── fork → wacrm-cliente-B          ← instalación de Cliente B
└── fork → wacrm-cliente-C          ← instalación de Cliente C
```

---

## 2. Arquitectura Actual — Lo que Debes Saber

### Multi-tenancy (account_id)

Todas las tablas de Supabase tienen un campo `account_id`. Esto **no hay que eliminarlo** — en single-tenant simplemente existirá una sola cuenta por instalación. Los roles (`owner`, `admin`, `agent`, `viewer`) siguen siendo útiles para el equipo del cliente.

### Cómo funciona la conexión WhatsApp actualmente

El sistema tiene **dos modos** de conectar WhatsApp en `src/components/settings/whatsapp-config.tsx`:

1. **Embedded Signup** (botón verde "Conectar con WhatsApp"):
   - Usa `NEXT_PUBLIC_META_APP_ID` y `NEXT_PUBLIC_META_CONFIG_ID` del `.env`
   - Lanza el flujo OAuth de Facebook con **tu App de Meta** (la del SaaS)
   - **No sirve para clientes** porque cada cliente tiene su propia App de Meta
   - **Debe eliminarse o desactivarse**

2. **Manual Setup** (acordeón colapsado "Configuración manual"):
   - El usuario ingresa manualmente: Phone Number ID, WABA ID, Access Token, Verify Token, PIN
   - **Funciona perfectamente** para el modelo de cliente
   - **Debe estar abierto por defecto** (no colapsado)

### Variables de entorno relevantes

```
# Meta / WhatsApp
META_APP_SECRET          ← App Secret de la App de Meta (cambia por cliente)
META_APP_ID              ← App ID de la App de Meta (cambia por cliente)
NEXT_PUBLIC_META_APP_ID  ← Mismo App ID, lado cliente (cambia por cliente)
NEXT_PUBLIC_META_CONFIG_ID ← Config ID para Embedded Signup (ELIMINAR de este base)

# Facturación SaaS (ELIMINAR)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY
WOMPI_PRIVATE_KEY
WOMPI_INTEGRITY_SECRET

# Infraestructura (cambia por cliente)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ENCRYPTION_KEY
NEXT_PUBLIC_SITE_URL
```

---

## 3. Tareas a Ejecutar en Este Repositorio Base

Ejecuta las tareas en el orden indicado. Marca cada una cuando la completes.

---

### TAREA 1 — Eliminar el sistema de facturación (Wompi / Billing)

**Objetivo:** Remover todo lo relacionado con pagos/suscripciones del SaaS.

#### 1.1 Eliminar las rutas API de billing

Eliminar la carpeta completa:
```
src/app/api/billing/
```

Verificar primero su contenido con `list_dir` y luego eliminar con el comando:
```powershell
Remove-Item -Recurse -Force "src\app\api\billing"
```

#### 1.2 Eliminar la página de billing del dashboard (si existe)

Buscar si existe:
```
src/app/(dashboard)/billing/
```
Si existe, eliminarla.

#### 1.3 Eliminar el ítem de billing en el sidebar/navegación

Buscar en `src/components/layout/sidebar.tsx` (o similar) cualquier referencia a `billing`, `plan`, `subscription`, `Wompi` y eliminar esos ítems del menú de navegación.

Buscar con grep:
```
"billing" en src/components/layout/
```

#### 1.4 Limpiar referencias a billing en el código

Hacer grep de `billing`, `wompi`, `subscription`, `plan` en todo `src/` y eliminar los componentes o referencias que sean exclusivos del SaaS. Tener cuidado de no eliminar código que usa estos términos de forma diferente.

#### 1.5 Actualizar `.env.local.example`

En el archivo `.env.local.example` de la raíz:
- Eliminar la sección `# WOMPI (SaaS Billing)` y sus 3 variables
- Agregar una sección clara de instrucciones para el modelo cliente

Reemplazar al final del archivo con:

```bash
# ============================================================
# MODELO DE IMPLEMENTACIÓN POR CLIENTE
# ============================================================
# Este proyecto se despliega UNA VEZ POR CLIENTE. No hay
# facturación interna. Cada cliente tiene:
#   - Su propio proyecto de Supabase (URL + keys únicos)
#   - Su propia App en Meta for Developers
#   - Su propia ENCRYPTION_KEY (generar una nueva por cliente)
#   - Su propio dominio (NEXT_PUBLIC_SITE_URL)
#
# Para generar ENCRYPTION_KEY:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# ============================================================
```

---

### TAREA 2 — Transformar la landing page (`src/app/page.tsx`)

**Objetivo:** La landing actual es la página de venta del SaaS (con planes, precios, testimonios). En el modelo cliente, la app debe llevar directo al login.

#### 2.1 Revisar el contenido actual

Ver el archivo `src/app/page.tsx` completo para entender qué contiene.

#### 2.2 Reemplazar por redirección al login

Reemplazar el contenido del archivo por:

```typescript
import { redirect } from 'next/navigation';

/**
 * Root page — redirects to the login screen.
 * In the per-client deployment model there is no public marketing
 * landing page; the app is accessed directly by the client's team.
 */
export default function Home() {
  redirect('/login');
}
```

> **Nota:** Si el archivo original tiene metadata de SEO (`generateMetadata`), eliminarla también — no aplica para una página que redirige.

---

### TAREA 3 — Modificar la pantalla de conexión WhatsApp

**Objetivo:** Desactivar el Embedded Signup y dejar el Manual Setup como formulario principal visible.

**Archivo:** `src/components/settings/whatsapp-config.tsx`

#### 3.1 Eliminar el import de `Script` de Next.js

Buscar y eliminar:
```typescript
import Script from 'next/script';
```

#### 3.2 Eliminar los estados relacionados con Embedded Signup

Buscar y eliminar estas líneas de estado:
```typescript
const [isSdkLoaded, setIsSdkLoaded] = useState(false);
const [isFbLoggingIn, setIsFbLoggingIn] = useState(false);
```

#### 3.3 Eliminar la inicialización del SDK de Facebook

Dentro del `useEffect` que carga la config, eliminar el bloque:
```typescript
// Initialize Facebook SDK
if (typeof window !== 'undefined' && !window.fbAsyncInit) {
  window.fbAsyncInit = function () { ... };
} else if (typeof window !== 'undefined' && window.FB) {
  setIsSdkLoaded(true);
}
```

#### 3.4 Eliminar la función `handleEmbeddedSignup`

Eliminar toda la función `handleEmbeddedSignup` (aprox. 45 líneas que empiezan en `const handleEmbeddedSignup = () => {`).

#### 3.5 Eliminar el `<Script>` tag en el JSX

En el return del componente, eliminar:
```tsx
<Script src="https://connect.facebook.net/en_US/sdk.js" strategy="lazyOnload" />
```

#### 3.6 Eliminar la Card del Embedded Signup en el JSX

Eliminar el bloque completo de la Card con el botón verde de WhatsApp. Es la Card que tiene:
- `CardTitle` con `t('settings.whatsapp.embedded.title')`
- El botón con clase `bg-[#25D366]`
- El `<p>` con `t('settings.whatsapp.embedded.hint')`

#### 3.7 Reemplazar el Accordion de "Manual Setup" por un div abierto

Actualmente el formulario manual está dentro de un `<Accordion>` colapsado. Reemplazarlo para que esté siempre visible.

Buscar:
```tsx
<Accordion className="w-full">
  <AccordionItem value="manual-setup" className="border-border rounded-lg border px-4 bg-card/50">
    <AccordionTrigger className="text-muted-foreground hover:text-foreground text-sm font-medium">
      {t('settings.whatsapp.manual.title')}
    </AccordionTrigger>
    <AccordionContent>
      <div className="pt-4 space-y-4">
        {/* ...campos del formulario... */}
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

Reemplazar por:
```tsx
{/* Manual configuration fields — always visible in per-client mode */}
<Card className="border-border">
  <CardHeader>
    <CardTitle className="text-foreground">
      {t('settings.whatsapp.manual.title')}
    </CardTitle>
    <CardDescription className="text-muted-foreground">
      {t('settings.whatsapp.manual.description_client')}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* ...mismos campos del formulario que estaban dentro del AccordionContent... */}
    </div>
  </CardContent>
</Card>
```

> **Importante:** Mantener todos los campos del formulario (`phoneNumberId`, `wabaId`, `accessToken`, `verifyToken`, `pin`) — solo cambia el contenedor.

#### 3.8 Eliminar imports no usados de Accordion

Después de los cambios anteriores, si ya no se usa `Accordion`, eliminar sus imports:
```typescript
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
```

#### 3.9 Eliminar la declaración global de `window.FB`

Eliminar:
```typescript
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}
```

---

### TAREA 4 — Limpiar traducciones i18n del Embedded Signup

**Archivos:** `src/i18n/locales/es.json` y `src/i18n/locales/en.json`

Buscar y eliminar las claves bajo `settings.whatsapp.embedded` en ambos archivos:
```json
"embedded": {
  "title": "...",
  "description": "...",
  "btn": "...",
  "btn_loading": "...",
  "hint": "..."
}
```

Y agregar una clave nueva para la descripción del formulario manual en modo cliente:

En `es.json`, dentro de `settings.whatsapp.manual`:
```json
"description_client": "Ingresa las credenciales de tu App de Meta. Puedes encontrar estos valores en Meta for Developers → tu aplicación → WhatsApp → Configuración."
```

En `en.json`, dentro de `settings.whatsapp.manual`:
```json
"description_client": "Enter your Meta App credentials. You can find these values in Meta for Developers → your app → WhatsApp → Configuration."
```

---

### TAREA 5 — Verificar que el proyecto compila sin errores

Después de todos los cambios, ejecutar:

```powershell
npx tsc --noEmit
```

Corregir cualquier error de TypeScript que aparezca (principalmente imports no usados o referencias a funciones eliminadas).

---

### TAREA 6 — Actualizar el README.md

Reemplazar el `README.md` de la raíz para que refleje el nuevo modelo. El nuevo README debe incluir:

1. **Qué es este proyecto** — CRM + WhatsApp, modelo single-tenant por cliente
2. **Requisitos por cliente** — Supabase, App de Meta, dominio
3. **Setup de una instalación nueva** (los pasos en orden)
4. **Variables de entorno** — tabla con todas las variables y su origen
5. **Cómo conectar WhatsApp** — proceso para crear App de Meta y configurarla
6. **Cómo actualizar desde el base** — `git pull upstream main`

---

### TAREA 7 — Commit y push al nuevo repo base

```bash
git add -A
git commit -m "chore: convert from SaaS to per-client deployment base

- Remove billing/Wompi system (routes, UI, env vars)
- Replace marketing landing with /login redirect
- Replace WhatsApp Embedded Signup with always-visible Manual Setup
- Update .env.local.example for single-tenant model
- Clean i18n keys for removed embedded signup
- Update README for per-client implementation guide"

git push origin main
```

---

## 4. Lo que NO se Toca

Estas partes **no requieren cambios** y funcionan perfectamente en single-tenant:

| Componente | Razón |
|---|---|
| Sistema `account_id` en DB | Solo habrá 1 cuenta por instalación |
| Roles (owner/admin/agent/viewer) | Útil para el equipo del cliente |
| Sistema de invitaciones (`/join`) | El cliente invita a sus empleados |
| API WhatsApp (webhook, send, templates) | Funciona igual |
| Automaciones y Flows | Funciona igual |
| Contactos, importación CSV | Funciona igual |
| Pipelines y deals | Funciona igual |
| Broadcasts | Funciona igual |
| AI Assistant | El cliente ingresa su propia clave |
| i18n (ES/EN) | Se mantiene |
| Sistema de migraciones de Supabase | Se ejecuta en cada instalación nueva |

---

## 5. Proceso para Onboarding de un Cliente Nuevo (referencia)

Cuando llegue un cliente nuevo, el implementador hace esto:

1. **Fork** de este repo a `wacrm-cliente-[nombre]` (privado)
2. **Crear proyecto Supabase** nuevo → ejecutar `supabase db push` con todas las migraciones
3. **Crear App en Meta for Developers** del cliente:
   - Tipo: Business
   - Producto: WhatsApp
   - Conectar a Business Manager del cliente
4. **Obtener credenciales Meta del cliente:**
   - App ID + App Secret (App Settings → Basic)
   - Phone Number ID + WABA ID (WhatsApp → Getting Started)
   - Access Token (crear System User con token permanente)
5. **Configurar Webhook en Meta:** URL = `https://[dominio-cliente]/api/whatsapp/webhook`
6. **Crear `.env.local`** en el servidor del cliente con todos los valores
7. **Desplegar** en Vercel/Hostinger con ese `.env.local`
8. **Crear cuenta Owner** (primer usuario del cliente)
9. **Ir a Settings → WhatsApp** → llenar Phone Number ID, WABA ID, Access Token, Verify Token, PIN
10. **Verificar conexión** → enviar mensaje de prueba

---

## 6. Checklist Final para el Agente

Antes de dar por terminado el trabajo, verificar:

- [ ] `src/app/api/billing/` eliminado
- [ ] Referencias a Wompi en el sidebar/navegación eliminadas
- [ ] `.env.local.example` actualizado (sin variables Wompi)
- [ ] `src/app/page.tsx` redirige a `/login`
- [ ] `src/components/settings/whatsapp-config.tsx` sin Embedded Signup
- [ ] Formulario Manual Setup visible por defecto (no en Accordion)
- [ ] `declare global { interface Window { FB... } }` eliminado
- [ ] Import de `Script` de Next.js eliminado del componente
- [ ] Claves i18n `settings.whatsapp.embedded.*` eliminadas de es.json y en.json
- [ ] Clave `settings.whatsapp.manual.description_client` agregada en ambos locales
- [ ] `npx tsc --noEmit` sin errores
- [ ] `README.md` actualizado
- [ ] Commit con mensaje descriptivo realizado
