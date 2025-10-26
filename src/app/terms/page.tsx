import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl">Network Guardian</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-16">
            <div className="prose prose-lg mx-auto dark:prose-invert">
                <h1 className="font-headline text-4xl font-bold">Conditions Générales d'Utilisation</h1>
                <p className="text-lg text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <p>Les présentes Conditions Générales d'Utilisation ("CGU") régissent votre accès et votre utilisation de l'application Network Guardian ("le Service"). En utilisant le Service, vous acceptez d'être lié par ces CGU.</p>

                <h2>1. Utilisation du Service</h2>
                <p>Le Service est fourni pour votre usage personnel et non commercial. Il est conçu pour vous aider à surveiller et à gérer votre réseau domestique. Vous acceptez de n'utiliser le Service qu'à des fins légales et conformément aux présentes CGU.</p>
                
                <h2>2. Comptes Utilisateur</h2>
                <p>Pour utiliser le Service, vous devez créer un compte en fournissant un nom, une adresse e-mail et un mot de passe. Vous êtes responsable du maintien de la confidentialité de vos informations de compte et de toutes les activités qui se déroulent sous votre compte. Le compte est stocké localement sur votre appareil et n'est pas géré par un serveur central.</p>

                <h2>3. Avertissement sur la Sécurité et la Simulation</h2>
                <p><strong>IMPORTANT :</strong> La version actuelle de Network Guardian est un prototype avancé. Les fonctions de scan réseau, de détection d'anomalies et de blocage sont basées sur des **données simulées**. Le Service, dans son état actuel, ne scanne pas réellement votre réseau et ne fournit pas de protection active. Il est destiné à des fins de démonstration et de développement de l'interface utilisateur.</p>

                <h2>4. Propriété Intellectuelle</h2>
                <p>Le Service, y compris son code source, sa conception, ses graphismes et son contenu, est la propriété de Network Guardian et est protégé par les lois sur le droit d'auteur et la propriété intellectuelle. Vous ne pouvez pas copier, modifier, distribuer, vendre ou louer une partie de notre Service.</p>

                <h2>5. Activités Interdites</h2>
                <p>Vous vous engagez à ne pas :</p>
                <ul>
                    <li>Utiliser le Service à des fins illégales ou non autorisées.</li>
                    <li>Tenter de décompiler, de désassembler ou de faire de l'ingénierie inverse sur une partie du Service.</li>
                    <li>Interférer avec le fonctionnement normal du Service.</li>
                </ul>

                <h2>6. Limitation de Responsabilité</h2>
                <p>Le Service est fourni "en l'état", sans aucune garantie d'aucune sorte. En aucun cas Network Guardian ne pourra être tenu responsable des dommages directs, indirects, accessoires ou consécutifs résultant de l'utilisation ou de l'incapacité à utiliser le Service, y compris en ce qui concerne la sécurité de votre réseau.</p>
                
                <h2>7. Résiliation</h2>
                <p>Vous pouvez cesser d'utiliser le Service à tout moment. La suppression des données du site dans votre navigateur entraînera la suppression de votre compte et de toutes les données associées.</p>

                <h2>8. Modifications des CGU</h2>
                <p>Nous nous réservons le droit de modifier ces CGU à tout moment. Nous vous informerons de tout changement en publiant les nouvelles CGU sur cette page. Votre utilisation continue du Service après de telles modifications constitue votre acceptation des nouvelles CGU.</p>
                
                 <h2>9. Contact</h2>
                <p>Pour toute question concernant ces CGU, veuillez nous contacter à <a href="mailto:terms@networkguardian.example.com">terms@networkguardian.example.com</a>.</p>
            </div>
        </div>
      </main>

       <footer className="border-t">
        <div className="container py-6 text-center text-sm text-muted-foreground">
           <p>© {new Date().getFullYear()} Network Guardian. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}