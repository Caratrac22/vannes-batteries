import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "MENTIONS LÉGALES | VANNES BATTERIES",
  description: "Mentions légales de Vannes Batteries.",
  path: "/mentions-legales",
});

export default function MentionsLegales() {
  return (
    <section className="bg-light-50 py-32 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-tight text-dark-950 mb-8 border-b border-gray-200 pb-4">
          Mentions Légales
        </h1>
        <div className="prose prose-slate max-w-none text-dark-700">
          <p>
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, il est précisé aux utilisateurs du site Vannes Batteries l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
          </p>

          <h3>Édition du site</h3>
          <p>
            Le présent site est édité par la société <strong>VANNES BATTERIES SAS</strong>.
          </p>
          <ul>
            <li><strong>Raison sociale :</strong> VANNES BATTERIES SAS</li>
            <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
            <li><strong>Capital social :</strong> 10 000 €</li>
            <li><strong>SIRET :</strong> 804 235 695 00017</li>
            <li><strong>RCS :</strong> Vannes 804 235 695</li>
            <li><strong>Numéro TVA intracommunautaire :</strong> FR 85 804235695</li>
            <li><strong>Siège social :</strong> 19 rue Denis Papin, Z.A. de Kerniol, 56000 Vannes, France</li>
            <li><strong>Téléphone :</strong> 02 97 49 20 19</li>
            <li><strong>Email :</strong> batterie56@hotmail.com</li>
            <li><strong>Président :</strong> Arnold Lecarpentier</li>
          </ul>

          <h3>Directeur de la publication</h3>
          <p>Arnold Lecarpentier, en qualité de Président de VANNES BATTERIES SAS.</p>

          <h3>Hébergement du site</h3>
          <p>
            Le site est hébergé par la société <strong>Vercel Inc.</strong><br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
            Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
          </p>

          <h3>Propriété intellectuelle</h3>
          <p>
            L'ensemble du contenu du site vannes-batteries.fr (textes, images, vidéos, logos, icônes, mise en page) est la propriété exclusive de VANNES BATTERIES SAS, sauf mention contraire. Toute reproduction, distribution, modification ou utilisation de ces éléments sans autorisation préalable est interdite et constitue une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>

          <h3>Protection des données</h3>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Pour exercer ces droits, contactez-nous à batterie56@hotmail.com. Pour plus d'informations, consultez notre <a href="/politique-de-confidentialite">Politique de Confidentialité</a>.
          </p>

          <h3>Limitation de responsabilité</h3>
          <p>
            VANNES BATTERIES SAS s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, la société ne saurait être tenue responsable des erreurs, omissions ou des résultats pouvant survenir suite à l'utilisation de ces informations. Les liens hypertextes présents sur le site vers d'autres sites n'engagent pas la responsabilité de VANNES BATTERIES SAS quant au contenu de ces sites.
          </p>

          <h3>Droit applicable</h3>
          <p>
            Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l'utilisation du site relève de la compétence exclusive des tribunaux français.
          </p>

          <p className="text-sm text-dark-400 mt-8">
            Dernière mise à jour : juin 2026
          </p>
        </div>
      </div>
    </section>
  );
}
