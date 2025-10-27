
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { forgotPasswordAction } from "@/actions/auth";
import { getStoredUserPassword } from "@/lib/services/network-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Envoi en cours...
        </>
      ) : (
        <>
          <Send />
          Récupérer le mot de passe
        </>
      )}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, { error: "", success: "" });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function handleRecovery() {
      if (state.success && !state.error) {
        try {
          const recoveredPassword = await getStoredUserPassword(email);
          if (recoveredPassword) {
            setPassword(recoveredPassword);
            setIsDialogOpen(true);
          } else {
             toast({
                variant: "destructive",
                title: "Aucun compte trouvé",
                description: "Aucun compte n'est associé à cette adresse email.",
            });
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message,
          });
        }
      }
    }
    handleRecovery();
  }, [state, email, toast]);
  
  return (
    <>
      <form action={formAction} className="w-full space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
         {state.error && (
          <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <SubmitButton />
      </form>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mot de passe récupéré</DialogTitle>
            <DialogDescription>
              Voici votre mot de passe. Veuillez le conserver en lieu sûr et le mémoriser.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Alert>
              <AlertTitle className="text-center text-2xl font-bold tracking-widest font-code">
                {password}
              </AlertTitle>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className="w-full">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
