import { Icons } from "@/components/icons";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background"></div>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 rounded-xl border bg-card p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <Icons.logo className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
            Network Guardian
          </h1>
        </div>
        <p className="text-center text-muted-foreground">
          قم بتسجيل الدخول للوصول إلى لوحة تحكم الشبكة الخاصة بك والتحكم في بيئتك الرقمية.
        </p>
        <LoginForm />
      </div>
       <div className="absolute bottom-4 z-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Network Guardian. كل الحقوق محفوظة.
      </div>
    </div>
  );
}
