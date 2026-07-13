# Plan Maestro de Traducción WACRM

Este documento sirve como hoja de ruta para traducir toda la aplicación (WACRM) al español e implementar soporte multilenguaje completo. 
Iremos marcando cada sección a medida que la vayamos completando.

## 1. Fase Inicial (Completada) ✅
- [x] Configuración de dependencias (`i18next`, `react-i18next`)
- [x] Creación de archivos de diccionario (`en.json`, `es.json`)
- [x] Traducción del Menú Lateral (Sidebar)
- [x] Traducción de Rutas de Autenticación (Login, Registro, Recuperar Contraseña)
- [x] Traducción de Cabecera Superior (Header y Menú de Perfil)

## 2. Fase Dashboard (Tablero Principal) ✅
- [x] Extraer y traducir textos de `src/app/(dashboard)/dashboard/page.tsx`
- [x] Traducir componente `MetricCard` (Tarjetas de métricas)
- [x] Traducir componente `QuickActions` (Acciones Rápidas)
- [x] Traducir componente `ConversationsChart` (Gráfico de Conversaciones)
- [x] Traducir componente `PipelineDonut` (Gráfico de Embudos)
- [x] Traducir componente `ResponseTimeChart` (Gráfico de Tiempos)
- [x] Traducir componente `ActivityFeed` (Feed de actividad)

## 3. Fase Inbox (Bandeja de Entrada) ✅
- [x] Extraer textos de `src/app/(dashboard)/inbox` (Estructura principal)
- [x] Traducir Lista de Conversaciones (Sidebar de Inbox)
- [x] Traducir Interfaz de Chat (Área de mensajes y caja de texto)
- [x] Traducir Panel de Perfil de Contacto (Lado derecho)

## 4. Fase Contacts (Contactos) ✅
- [x] Traducción de la Tabla principal de Contactos
- [x] Traducción de Botones de Filtro, Exportar e Importar
- [x] Traducción del Modal de Crear/Editar Contacto
- [x] Traducción del Perfil individual del Contacto

## 5. Fase Pipelines (Embudos y CRM) ✅
- [x] Traducción del Tablero Kanban (Columnas y Tarjetas)
- [x] Traducción de Estados y Tipos de Tratos (Deals)
- [x] Traducción del Modal para Agregar/Mover un Trato
- [x] Traducción del Panel de Analíticas (métricas y tooltips)
- [x] Traducción del Modal de Configuración de Embudo (etapas, colores, eliminación)

## 6. Fase Settings (Configuración) ✅
- [x] Traducción de Pestaña "Perfil" (Profile)
- [x] Traducción de Pestaña "WhatsApp API" (Tokens y Configuración)
- [x] Traducción de Pestaña "Webhooks" 
- [x] Traducción de Pestaña "Miembros de Equipo"
- [x] Traducción de Pestaña "API Keys"

## 7. Fase Módulos Adicionales
- [x] Traducción del módulo de Notificaciones
- [x] Traducción del módulo de Difusiones (Broadcasts)
- [x] Traducción del módulo de Automatizaciones (Automations)
- [x] Traducción del módulo de Flujos (Flows)
- [x] Traducción del módulo de Agentes IA (AI Agents)
