"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ShieldCheck,
  Zap,
  UsersRound,
  LineChart,
  Bot,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">ChatFlowAI</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Iniciar sesión
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Empezar Gratis
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          {/* Subtle background glow */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>

          <div className="container mx-auto max-w-screen-xl px-4 text-center">
            <div className="mx-auto max-w-3xl space-y-8">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Automatiza, Vende y Escala en WhatsApp{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  sin Riesgos
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                El CRM todo-en-uno para gestionar chats, construir embudos de venta y automatizar con Inteligencia Artificial. Conexión oficial para tu negocio.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base group">
                    Crear Cuenta Gratis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                    Ver Planes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Banner (Anti-Baneo) */}
        <section className="border-y border-border/50 bg-muted/30 py-8">
          <div className="container mx-auto max-w-screen-xl px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <ShieldCheck className="h-8 w-8 text-green-500" />
              </div>
              <div className="max-w-xl">
                <h3 className="text-xl font-bold text-foreground">
                  Partner Oficial de Meta. 0% Riesgo de Baneo.
                </h3>
                <p className="text-muted-foreground mt-1">
                  Utilizamos exclusivamente la API Oficial de WhatsApp Cloud. Tu número de negocio está 100% seguro contra bloqueos y suspensiones por spam.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto max-w-screen-xl px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Todo lo que necesitas para dominar WhatsApp
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Reemplaza múltiples herramientas con una única plataforma unificada.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <UsersRound className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Bandeja Multiusuario</h3>
                <p className="text-sm text-muted-foreground">
                  Todo tu equipo de ventas y soporte respondiendo desde un mismo número de WhatsApp simultáneamente.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Embudos de Venta</h3>
                <p className="text-sm text-muted-foreground">
                  Organiza a tus prospectos en un tablero Kanban interactivo. Arrastra y suelta para cerrar más ventas.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Difusiones Seguras</h3>
                <p className="text-sm text-muted-foreground">
                  Envía campañas masivas de marketing directamente desde la API oficial sin ser detectado como spam.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Agentes de IA</h3>
                <p className="text-sm text-muted-foreground">
                  Automatiza respuestas y califica prospectos 24/7 con bots impulsados por Inteligencia Artificial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container mx-auto max-w-screen-xl px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Precios Justos y Accesibles
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Potencia tu negocio sin gastar una fortuna. Cancela en cualquier momento.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* Emprendedor Plan */}
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-foreground">Emprendedor</h3>
                <p className="mt-2 text-muted-foreground">Para negocios que están empezando.</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">$49.900</span>
                  <span className="text-sm font-semibold text-muted-foreground">COP/mes</span>
                </div>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Bandeja multiusuario (hasta 3 agentes)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Gestión de contactos ilimitada</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">API Oficial de Meta (sin baneos)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Soporte por email</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="mt-8 w-full bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">
                    Comenzar Ahora
                  </Button>
                </Link>
              </div>

              {/* Profesional Plan */}
              <div className="rounded-3xl border-2 border-primary bg-card p-8 shadow-md relative">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Más Popular
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Profesional</h3>
                <p className="mt-2 text-muted-foreground">Para equipos que quieren escalar rápido.</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">$99.900</span>
                  <span className="text-sm font-semibold text-muted-foreground">COP/mes</span>
                </div>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Agentes de equipo ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Agentes de Inteligencia Artificial ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Embudos de Ventas (Pipelines) avanzados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Campañas de Difusión masiva</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="mt-8 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Comenzar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto max-w-screen-xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">ChatFlowAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ChatFlowAI. Todos los derechos reservados. Partner Oficial de Meta.
          </p>
        </div>
      </footer>
    </div>
  );
}
