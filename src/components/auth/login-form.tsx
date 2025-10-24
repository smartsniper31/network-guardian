"use client";

import { useFormStatus } from "react-dom";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

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
  return (
    <form action={loginAction} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@networkguardian.com"
          defaultValue="admin@networkguardian.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>        
        <Input
          id="password"
          name="password"
          type="password"
          defaultValue="password"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
