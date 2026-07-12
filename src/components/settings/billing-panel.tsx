'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function BillingPanel() {
  const { accountRole, account } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Fallback si useAuth no devuelve el plan
  // Se requiere que use-auth devuelva account.plan_tier en un paso futuro
  const plan: string = (account as any)?.plan_tier || 'free'; // default temporal

  const handleSubscribe = async (planTier: string) => {
    setIsLoading(true);
    try {
      // Create Wompi Checkout integration here
      // For now, simple alert as placeholder
      alert(`Implementación de checkout de Wompi para plan: ${planTier}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (accountRole !== 'owner' && accountRole !== 'admin') {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-medium text-foreground">Facturación</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Solo los administradores o propietarios pueden gestionar la facturación.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">
              Plan Actual: {plan.toUpperCase()}
            </h2>
            <p className="text-sm text-muted-foreground">
              Gestiona tu suscripción y métodos de pago.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Emprendedor */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Emprendedor</h3>
          <p className="mt-2 text-sm text-muted-foreground">Para negocios que están empezando.</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold">$49.900</span>
            <span className="text-sm text-muted-foreground">COP/mes</span>
          </div>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Bandeja multiusuario (hasta 2 miembros)</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>1 Agente de Inteligencia Artificial</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Contactos ilimitados</span>
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            variant={plan === 'emprendedor' ? 'outline' : 'default'}
            disabled={plan === 'emprendedor' || isLoading}
            onClick={() => handleSubscribe('emprendedor')}
          >
            {plan === 'emprendedor' ? 'Plan Actual' : 'Suscribirse'}
          </Button>
        </div>

        {/* Profesional */}
        <div className="rounded-xl border-2 border-primary bg-card p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Profesional</h3>
          <p className="mt-2 text-sm text-muted-foreground">Para escalar más rápido.</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold">$99.900</span>
            <span className="text-sm text-muted-foreground">COP/mes</span>
          </div>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Bandeja multiusuario (hasta 3 miembros)</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>1 Agente de Inteligencia Artificial</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Automatizaciones ilimitadas</span>
            </li>
          </ul>
          <Button 
            className="mt-6 w-full" 
            disabled={plan === 'profesional' || isLoading}
            onClick={() => handleSubscribe('profesional')}
          >
            {plan === 'profesional' ? 'Plan Actual' : 'Suscribirse'}
          </Button>
        </div>
      </div>
    </div>
  );
}
