
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ShieldCheck, Users, BrainCircuit, ClipboardList, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: 'Analyse par IA',
    description: 'Notre IA analyse votre réseau pour détecter les menaces, les anomalies et les vulnérabilités en temps réel.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Contrôles Parentaux',
    description: "Gérez le temps d'écran, filtrez le contenu et mettez en pause l'accès à internet pour n'importe quel appareil.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Sécurité Robuste',
    description: 'Bloquez les appareils inconnus, isolez les menaces et recevez des alertes instantanées pour toute activité suspecte.',
  },
  {
    icon: <ClipboardList className="h-10 w-10 text-primary" />,
    title: 'Rapports Détaillés',
    description: "Obtenez des rapports hebdomadaires clairs et concis sur l'activité de votre réseau, générés par l'IA.",
  },
];

const testimonials = [
  {
    name: 'Famille Dupont',
    quote: "Enfin une solution simple pour gérer l'accès internet de nos enfants. L'analyse IA est un vrai plus pour notre tranquillité d'esprit.",
    avatar: '/avatars/avatar1.png'
  },
  {
    name: 'M. Kherchi',
    quote: "En tant que freelance, la sécurité de mon réseau domestique est primordiale. Network Guardian m'a permis d'identifier et de corriger des failles que j'ignorais.",
    avatar: '/avatars/avatar2.png'
  },
  {
    name: 'Sophie L.',
    quote: "L'interface est incroyablement intuitive. En quelques clics, j'ai pu bloquer des sites inappropriés sur la tablette de mon fils. Je recommande à 100% !",
    avatar: '/avatars/avatar3.png'
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl">Network Guardian</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Connexion
            </Link>
            <Button asChild>
              <Link href="/signup">S'inscrire gratuitement</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid items-center gap-8 pb-16 pt-6 text-center md:py-24 lg:grid-cols-2 lg:text-left">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Votre réseau. Vos règles. La tranquillité d'esprit,
              <span className="text-primary"> réinventée par l'IA.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
              Prenez le contrôle total de votre réseau domestique. Sécurisez vos appareils, protégez votre famille et comprenez votre trafic internet comme jamais auparavant.
            </p>
            <div className="flex justify-center gap-4 lg:justify-start">
              <Button asChild size="lg">
                <Link href="/signup">
                  Créez votre forteresse numérique <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
              <Image 
                src="https://picsum.photos/seed/rocket/800/600"
                width={800}
                height={600}
                alt="Tableau de bord de Network Guardian"
                className="rounded-lg shadow-2xl"
                data-ai-hint="network dashboard"
              />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted py-16 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">La tour de contrôle de votre vie numérique</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tout ce dont vous avez besoin pour gérer et sécuriser votre réseau, réuni dans une interface simple et puissante.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-lg border bg-card p-6 text-center shadow-sm">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="w-full py-16 md:py-24">
            <div className="container">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Ils nous font confiance.</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Découvrez pourquoi des familles et des professionnels choisissent Network Guardian.
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm">
                            <div>
                                <div className="flex text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                                </div>
                                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Image src={`https://i.pravatar.cc/48?u=${index}`} alt={testimonial.name} width={48} height={48} className="rounded-full" />
                                </div>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="w-full bg-muted">
            <div className="container flex flex-col items-center gap-6 py-24 text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Prêt à prendre le contrôle ?</h2>
                <p className="max-w-xl text-lg text-muted-foreground">
                    Inscrivez-vous en 30 secondes et découvrez une nouvelle ère de gestion de réseau.
                </p>
                 <Button asChild size="lg">
                    <Link href="/signup">
                        Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Icons.logo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Network Guardian. Tous droits réservés.
            </p>
          </div>
          <nav className="flex items-center gap-4">
             <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">Conditions</Link>
             <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary">Confidentialité</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

    

    