
import { Icons } from "@/components/icons";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage({
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
            Mot de passe oublié
          </h1>
        </Link>
        <p className="text-center text-muted-foreground">
          Saisissez votre email et nous vous aiderons à récupérer votre compte.
        </p>

        {searchParams.error && (
          <Alert variant="destructive">
            <AlertDescription>{searchParams.error}</AlertDescription>
          </Alert>
        )}

        <ForgotPasswordForm />
        
        <p className="text-sm text-muted-foreground">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
                Connectez-vous
            </Link>
        </p>
      </div>
       <div className="absolute bottom-4 z-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Network Guardian. Tous droits réservés.
      </div>
    </div>
  );
}
