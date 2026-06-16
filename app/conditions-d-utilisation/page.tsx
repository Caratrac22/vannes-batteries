import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "CONDITIONS D'UTILISATION | VANNES BATTERIES",
  description: "Conditions générales d'utilisation du site vannes-batteries.fr.",
  path: "/conditions-d-utilisation",
});

export default function ConditionsUtilisation() {
  return (
    <section className="bg-light-50 py-32 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-tight text-dark-950 mb-8 border-b border-gray-200 pb-4">
          Conditions Générales d'Utilisation
        </h1>
        <div className="prose prose-slate max-w-none text-dark-700">
          <p>
            Les présentes conditions générales d'utilisation (ci-après les « CGU ») régissent l'accès et l'utilisation du site internet <strong>vannes-batteries.fr</strong> (ci-après le « Site »). En naviguant sur le Site, vous acceptez sans réserve les présentes CGU. Si vous ne les acceptez pas, veuillez ne pas utiliser le Site.
          </p>

          <h3>Article 1 — Objet</h3>
          <p>
            Les présentes CGU ont pour objet de définir les modalités et conditions dans lesquelles les utilisateurs accèdent au Site et utilisent ses services. Tout accès au Site implique l'acceptation et le respect de l'intégralité des présentes CGU.
          </p>

          <h3>Article 2 — Accès au site</h3>
          <p>
            Le Site est accessible gratuitement à tout utilisateur disposant d'une connexion internet. VANNES BATTERIES SAS se réserve le droit de suspendre, modifier ou interrompre l'accès au Site à tout moment, notamment pour des opérations de maintenance, sans préavis.
          </p>

          <h3>Article 3 — Contenu du site</h3>
          <p>
            Le Site présente les produits et services proposés par VANNES BATTERIES SAS, à savoir la vente, le conseil et la pose de batteries pour véhicules (voitures, motos, camping-cars, poids-lourds, bateaux, engins agricoles et TP). Les informations fournies le sont à titre indicatif et ne sauraient engager la responsabilité de VANNES BATTERIES SAS en cas d'inexactitude ou d'omission.
          </p>

          <h3>Article 4 — Propriété intellectuelle</h3>
          <p>
            L'ensemble des éléments composant le Site (textes, images, graphismes, logos, icônes, vidéos, etc.) sont protégés par le droit d'auteur et le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou exploitation, partielle ou totale, sans autorisation écrite préalable de VANNES BATTERIES SAS est interdite.
          </p>

          <h3>Article 5 — Responsabilité</h3>
          <p>
            VANNES BATTERIES SAS met tout en œuvre pour assurer la fiabilité des informations diffusées sur le Site mais ne saurait garantir l'exactitude, l'exhaustivité ou l'actualité de ces dernières. La société ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation du Site ou de l'impossibilité d'y accéder. Le Site peut contenir des liens hypertextes vers des sites tiers. VANNES BATTERIES SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>

          <h3>Article 6 — Données personnelles</h3>
          <p>
            Les données collectées via le formulaire de contact du Site sont destinées exclusivement au traitement de votre demande par VANNES BATTERIES SAS. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à batterie56@hotmail.com. Pour en savoir plus, consultez notre <a href="/politique-de-confidentialite">Politique de Confidentialité</a>.
          </p>

          <h3>Article 7 — Cookies</h3>
          <p>
            Le Site utilise uniquement des cookies techniques essentiels à son fonctionnement. Aucun cookie de suivi publicitaire ou de réseaux sociaux n'est utilisé. Pour en savoir plus, consultez notre <a href="/politique-en-mati%C3%A8re-de-cookies">Politique en matière de cookies</a>.
          </p>

          <h3>Article 8 — Droit applicable et litiges</h3>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents de Vannes.
          </p>

          <h3>Article 9 — Contact</h3>
          <p>
            Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
          </p>
          <ul>
            <li>Par email : batterie56@hotmail.com</li>
            <li>Par téléphone : 02 97 49 20 19</li>
            <li>Par courrier : 19 rue Denis Papin, Z.A. de Kerniol, 56000 Vannes</li>
          </ul>

          <p className="text-sm text-dark-400 mt-8">
            Dernière mise à jour : juin 2025
          </p>
        </div>
      </div>
    </section>
  );
}
