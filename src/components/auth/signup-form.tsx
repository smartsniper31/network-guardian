"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { signupAction } from "@/actions/auth";
import { signupUser } from "@/lib/services/network-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" pending={pending}>
      <UserPlus />
      S'inscrire
    </Button>
  );
}

export function SignupForm() {
    const [state, formAction] = useActionState(signupAction, { data: null, error: null });
    const [clientError, setClientError] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function handleSignup() {
            if (state.data && !state.error) {
                try {
                    const user = await signupUser(state.data.name, state.data.email, state.data.password);
                    toast({
                        title: "Compte créé avec succès !",
                        description: `Bienvenue, ${user.name}!`,
                    });
                    router.push("/dashboard");
                } catch (error: any) {
                    setClientError(error.message);
                }
            }
        }
        handleSignup();
    }, [state, router, toast]);

    const displayError = clientError || state.error;

  return (
    <form action={formAction} className="w-full space-y-6">
       <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="ex: Jean Dupont"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ex: jean.dupont@email.com"
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
