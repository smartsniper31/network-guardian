
"use client";

import { FormEvent, useState } from "react";
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

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate a network call, as per the original action
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const recoveredPassword = await getStoredUserPassword(email);
      if (recoveredPassword) {
        setPassword(recoveredPassword);
        setIsDialogOpen(true);
        toast({
          title: "Récupération initiée",
          description: "Si un compte existe, une fenêtre va apparaître."
        });
      } else {
        setError("Aucun compte n'est associé à cette adresse email.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
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
            disabled={isLoading}
          />
        </div>
         {error && (
          <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recherche...
            </>
          ) : (
            <>
              <Send />
              Récupérer le mot de passe
            </>
          )}
        </Button>
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
