# Plan Maestro de Traducción WACRM

Este documento sirve como hoja de ruta para traducir toda la aplicación (WACRM) al español e implementar soporte multilenguaje completo. 
Iremos marcando cada sección a medida que la vayamos completando.

## 1. Fase Inicial (Completada) ✅
- [x] Configuración de dependencias (`i18next`, `react-i18next`)
- [x] Creación de archivos de diccionario (`en.json`, `es.json`)
- [x] Traducción del Menú Lateral (Sidebar)
- [x] Traducción de Rutas de Autenticación (Login, Registro, Recuperar Contraseña)
- [x] Traducción de Cabecera Superior (Header y Menú de Perfil)

## 2. Fase Dashboard (Tablero Principal) ⏳
- [x] Extraer y traducir textos de `src/app/(dashboard)/dashboard/page.tsx`
- [x] Traducir componente `MetricCard` (Tarjetas de métricas)
- [x] Traducir componente `QuickActions` (Acciones Rápidas)
- [x] Traducir componente `ConversationsChart` (Gráfico de Conversaciones)
- [x] Traducir componente `PipelineDonut` (Gráfico de Embudos)
- [x] Traducir componente `ResponseTimeChart` (Gráfico de Tiempos)
- [x] Traducir componente `ActivityFeed` (Feed de actividad)

## 3. Fase Inbox (Bandeja de Entrada)
- [ ] Extraer textos de `src/app/(dashboard)/inbox` (Estructura principal)
- [ ] Traducir Lista de Conversaciones (Sidebar de Inbox)
- [ ] Traducir Interfaz de Chat (Área de mensajes y caja de texto)
- [ ] Traducir Panel de Perfil de Contacto (Lado derecho)

## 4. Fase Contacts (Contactos)
- [ ] Traducción de la Tabla principal de Contactos
- [ ] Traducción de Botones de Filtro, Exportar e Importar
- [ ] Traducción del Modal de Crear/Editar Contacto
- [ ] Traducción del Perfil individual del Contacto

## 5. Fase Pipelines (Embudos y CRM)
- [ ] Traducción del Tablero Kanban (Columnas y Tarjetas)
- [ ] Traducción de Estados y Tipos de Tratos (Deals)
- [ ] Traducción del Modal para Agregar/Mover un Trato

## 6. Fase Settings (Configuración)
- [ ] Traducción de Pestaña "Perfil" (Profile)
- [ ] Traducción de Pestaña "WhatsApp API" (Tokens y Configuración)
- [ ] Traducción de Pestaña "Webhooks" 
- [ ] Traducción de Pestaña "Miembros de Equipo"

## 7. Fase Módulos Adicionales
- [ ] Traducción del módulo de Notificaciones
- [ ] Traducción del módulo de Difusiones (Broadcasts)
- [ ] Traducción del módulo de Automatizaciones (Automations)

---
*Nota: Podemos retomar el trabajo mañana y continuar con la **Fase Dashboard**. Solo avísame cuando estés listo para arrancar con el siguiente punto de la lista.*
