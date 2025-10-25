
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { loginUser, hasConfiguredRouter } from "@/lib/services/network-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" pending={pending}>
      <LogIn />
      Se connecter
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { data: null, error: null });
  const [clientError, setClientError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function handleLogin() {
      if (state.data && !state.error) {
        try {
          const user = await loginUser(state.data.email, state.data.password);
          toast({
            title: `Bienvenue, ${user.name}!`,
            description: "Vous êtes maintenant connecté.",
          })
          
          const isConfigured = await hasConfiguredRouter();
          if (isConfigured) {
            router.push("/dashboard");
          } else {
            router.push("/setup");
          }

        } catch (error: any) {
          setClientError(error.message);
        }
      }
    }
    handleLogin();
  }, [state, router, toast]);

  const displayError = clientError || state.error;

  return (
    <form action={formAction} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="votre@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>        
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
       {displayError && (
        <Alert variant="destructive">
            <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}
      <SubmitButton />
    </form>
  );
}
