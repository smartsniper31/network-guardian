import { Icons } from "@/components/icons";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background"></div>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 rounded-xl border bg-card p-8 shadow-2xl">
        <Link href="/" className="flex items-center gap-3">
          <Icons.logo className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
            Network Guardian
          </h1>
        </Link>
        <p className="text-center text-muted-foreground">
          Connectez-vous pour accéder à votre tableau de bord réseau.
        </p>
        
        {searchParams.error && (
          <Alert variant="destructive">
            <AlertDescription>{searchParams.error}</AlertDescription>
          </Alert>
        )}

        <LoginForm />

        <div className="flex justify-between w-full text-sm">
            <p className="text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Inscrivez-vous
                </Link>
            </p>
            <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
                Mot de passe oublié ?
            </Link>
        </div>
      </div>
       <div className="absolute bottom-4 z-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Network Guardian. Tous droits réservés.
      </div>
    </div>
  );
}
