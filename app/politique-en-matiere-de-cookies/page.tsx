import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "POLITIQUE EN MATIÈRE DE COOKIES | VANNES BATTERIES",
  description: "Politique en matière de cookies de Vannes Batteries.",
  path: "/politique-en-matiere-de-cookies",
});

export default function PolitiqueCookies() {
  return (
    <section className="bg-light-50 py-32 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-tight text-dark-950 mb-8 border-b border-gray-200 pb-4">
          Politique en matière de cookies
        </h1>
        <div className="prose prose-slate max-w-none text-dark-700">
          <p>
            La présente politique en matière de cookies explique ce que sont les cookies, comment nous les utilisons sur le site <strong>vannes-batteries.fr</strong> et comment vous pouvez contrôler leur utilisation.
          </p>

          <h3>Qu'est-ce qu'un cookie ?</h3>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet de stocker des informations relatives à votre navigation et de vous offrir une expérience adaptée.
          </p>

          <h3>Cookies utilisés sur ce site</h3>
          <p>
            Le site vannes-batteries.fr utilise uniquement des <strong>cookies techniques essentiels</strong> au bon fonctionnement du site. Ces cookies sont nécessaires à la navigation et ne peuvent pas être désactivés depuis le site.
          </p>
          <ul>
            <li><strong>Cookies de session :</strong> Ils assurent le bon déroulement de votre navigation et la mémorisation temporaire de vos actions pendant la visite.</li>
            <li><strong>Cookies de sécurité :</strong> Ils permettent de sécuriser les formulaires et de prévenir les abus (protection anti-spam).</li>
          </ul>
          <p>
            <strong>Aucun cookie de ciblage publicitaire, de suivi social ou d'analyse d'audience intrusive n'est utilisé sur ce site.</strong> Nous ne collectons pas vos données à des fins commerciales ou de profilage.
          </p>

          <h3>Cookies tiers</h3>
          <p>
            Ce site n'intègre pas de contenus tiers (vidéos YouTube, boutons de partage sociaux, publicités) qui seraient susceptibles de déposer leurs propres cookies. En conséquence, aucun cookie tiers n'est déposé lors de votre navigation sur vannes-batteries.fr.
          </p>

          <h3>Gestion des cookies</h3>
          <p>
            Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur. Voici les liens vers les pages d'aide des principaux navigateurs :
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/effacer-les-cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/effacer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
          <p>
            La désactivation des cookies techniques essentiels peut toutefois affecter le bon fonctionnement du site.
          </p>

          <h3>Mise à jour de la politique</h3>
          <p>
            Cette politique peut être mise à jour à tout moment pour refléter les évolutions réglementaires ou techniques. La date de dernière mise à jour est indiquée en bas de page.
          </p>

          <h3>Contact</h3>
          <p>
            Pour toute question relative à l'utilisation des cookies, vous pouvez nous contacter à <strong>batterie56@hotmail.com</strong>.
          </p>

          <p className="text-sm text-dark-400 mt-8">
            Dernière mise à jour : juin 2025
          </p>
        </div>
      </div>
    </section>
  );
}
