import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function PrivacyPage() {
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
                <h1 className="font-headline text-4xl font-bold">Politique de Confidentialité</h1>
                <p className="text-lg text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <p>Bienvenue sur Network Guardian. Votre vie privée est d'une importance capitale pour nous. Cette Politique de Confidentialité a pour but de vous informer sur la manière dont nous collectons, utilisons et protégeons vos informations.</p>

                <h2>1. Données Collectées</h2>
                <p>Notre service est conçu pour fonctionner avec un minimum de collecte de données. Voici ce que nous traitons :</p>
                <ul>
                    <li><strong>Informations de Compte :</strong> Lors de votre inscription, nous collectons votre nom, votre adresse e-mail et un mot de passe chiffré. Ces informations sont stockées localement sur votre appareil et ne sont jamais transmises à nos serveurs.</li>
                    <li><strong>Données de Configuration Réseau :</strong> Les informations concernant votre routeur et les appareils découverts sur votre réseau (adresses IP, adresses MAC, noms d'appareils) sont également stockées exclusivement sur votre appareil.</li>
                    <li><strong>Données d'Analyse (Anonymisées) :</strong> Pour améliorer nos modèles d'intelligence artificielle, nous pouvons utiliser des données anonymisées et agrégées sur les menaces détectées et les activités réseau. Ces données ne contiennent aucune information personnelle identifiable.</li>
                </ul>

                <h2>2. Utilisation des Données</h2>
                <p>Les données collectées sont utilisées pour :</p>
                <ul>
                    <li>Fournir, maintenir et améliorer le service.</li>
                    <li>Scanner votre réseau, identifier des appareils et détecter des anomalies.</li>
                    <li>Générer des rapports de sécurité et d'activité pour votre usage personnel.</li>
                    <li>Assurer la sécurité de votre compte local.</li>
                </ul>
                <p><strong>Nous ne vendons, ne louons et ne partageons jamais vos données personnelles ou réseau avec des tiers.</strong></p>

                <h2>3. Sécurité des Données</h2>
                <p>La sécurité par conception est notre principe fondamental. Toutes vos données sensibles (informations de compte, configuration réseau) sont stockées dans le stockage local de votre navigateur. Elles ne quittent jamais votre machine.</p>

                <h2>4. Cookies</h2>
                <p>Nous n'utilisons pas de cookies de suivi ou de publicité. Nous utilisons uniquement le `localStorage` pour stocker les informations essentielles au fonctionnement de l'application de manière persistante sur votre propre appareil.</p>

                <h2>5. Vos Droits</h2>
                <p>Puisque toutes vos données sont stockées localement, vous avez un contrôle total :</p>
                <ul>
                    <li><strong>Accès et Modification :</strong> Vous pouvez accéder et modifier les informations de votre compte directement dans les paramètres de l'application.</li>
                    <li><strong>Suppression :</strong> La suppression de l'historique de votre navigateur ou des données de site pour Network Guardian effacera définitivement toutes les informations que l'application a stockées.</li>
                </ul>

                <h2>6. Modifications de cette Politique</h2>
                <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous encourageons à la consulter régulièrement.</p>

                <h2>7. Nous Contacter</h2>
                <p>Pour toute question relative à cette politique de confidentialité, veuillez nous contacter à <a href="mailto:privacy@networkguardian.example.com">privacy@networkguardian.example.com</a>.</p>
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