"use client";

import { useFormStatus } from "react-dom";
import { signupAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

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
  return (
    <form action={signupAction} className="w-full space-y-6">
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
      <SubmitButton />
    </form>
  );
}
