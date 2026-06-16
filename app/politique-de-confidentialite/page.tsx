import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "POLITIQUE DE CONFIDENTIALITÉ | VANNES BATTERIES",
  description: "Politique de confidentialité de Vannes Batteries — protection de vos données personnelles.",
  path: "/politique-de-confidentialite",
});

export default function PolitiqueConfidentialite() {
  return (
    <section className="bg-light-50 py-32 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-rajdhani font-bold text-3xl md:text-4xl uppercase tracking-tight text-dark-950 mb-8 border-b border-gray-200 pb-4">
          Politique de Confidentialité
        </h1>
        <div className="prose prose-slate max-w-none text-dark-700">
          <p>
            VANNES BATTERIES SAS attache une importance particulière à la protection de vos données personnelles. La présente politique de confidentialité (ci-après la « Politique ») vous informe de la manière dont nous collectons, utilisons et protégeons vos données lorsque vous utilisez le site <strong>vannes-batteries.fr</strong>.
          </p>

          <h3>1. Responsable du traitement</h3>
          <p>
            Le responsable du traitement de vos données personnelles est la société <strong>VANNES BATTERIES SAS</strong>, représentée par son Président Arnold Lecarpentier.
          </p>
          <ul>
            <li>Adresse : 19 rue Denis Papin, Z.A. de Kerniol, 56000 Vannes</li>
            <li>Email : batterie56@hotmail.com</li>
            <li>Téléphone : 02 97 49 20 19</li>
          </ul>

          <h3>2. Données collectées</h3>
          <p>Nous collectons uniquement les données que vous nous fournissez volontairement via notre formulaire de contact :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone</li>
            <li>Message (objet et contenu de votre demande)</li>
          </ul>
          <p>
            Nous ne collectons aucune donnée sensible (origine raciale, opinions politiques, santé, etc.).
          </p>

          <h3>3. Finalités du traitement</h3>
          <p>Vos données sont collectées exclusivement pour :</p>
          <ul>
            <li>Répondre à vos demandes de renseignements via le formulaire de contact</li>
            <li>Assurer la bonne gestion de la relation client</li>
            <li>Respecter nos obligations légales et réglementaires</li>
          </ul>
          <p>
            Vos données ne sont pas utilisées à des fins de prospection commerciale sans votre consentement explicite.
          </p>

          <h3>4. Base légale du traitement</h3>
          <p>
            Le traitement de vos données repose sur l'exécution de mesures précontractuelles (réponse à votre demande de contact) et, le cas échéant, sur votre consentement (article 6.1.a et 6.1.b du RGPD).
          </p>

          <h3>5. Durée de conservation</h3>
          <p>
            Vos données personnelles sont conservées pendant une durée maximale de <strong>3 ans</strong> à compter du dernier échange. Passé ce délai, elles sont définitivement supprimées. Les données nécessaires à l'exercice de nos obligations légales (facturation, comptabilité) sont conservées conformément aux durées légales en vigueur.
          </p>

          <h3>6. Destinataires des données</h3>
          <p>
            Vos données sont destinées exclusivement aux services habilités de VANNES BATTERIES SAS. Elles ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales. Nous pouvons être amenés à partager vos données avec des prestataires techniques (hébergeur, service email) dans le strict cadre de nos besoins opérationnels, sous contrat garantissant la conformité au RGPD.
          </p>

          <h3>7. Transfert hors UE</h3>
          <p>
            Vos données sont hébergées en France et dans l'Union Européenne. Aucun transfert de données en dehors de l'UE n'est effectué.
          </p>

          <h3>8. Sécurité</h3>
          <p>
            Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité de vos données personnelles (chiffrement SSL, accès restreint, pare-feu, sauvegardes régulières).
          </p>

          <h3>9. Vos droits</h3>
          <p>
            Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
          </p>
          <ul>
            <li><strong>Droit d'accès :</strong> obtenir confirmation que vos données sont traitées et en obtenir une copie</li>
            <li><strong>Droit de rectification :</strong> demander la correction de données inexactes ou incomplètes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la limitation :</strong> demander la suspension du traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit de retirer votre consentement :</strong> à tout moment, sans affecter la licéité du traitement antérieur</li>
          </ul>

          <h3>10. Exercice de vos droits</h3>
          <p>
            Pour exercer vos droits, contactez-nous par email à <strong>batterie56@hotmail.com</strong> ou par courrier à <strong>19 rue Denis Papin, Z.A. de Kerniol, 56000 Vannes</strong>. Nous nous engageons à répondre à votre demande dans un délai d'un mois.
          </p>

          <h3>11. Réclamation auprès de la CNIL</h3>
          <p>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong> :
          </p>
          <ul>
            <li>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></li>
            <li>Adresse : 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
            <li>Téléphone : 01 53 73 22 22</li>
          </ul>

          <h3>12. Mise à jour</h3>
          <p>
            La présente Politique peut être mise à jour à tout moment pour tenir compte des évolutions réglementaires ou techniques. Nous vous invitons à consulter régulièrement cette page.
          </p>

          <p className="text-sm text-dark-400 mt-8">
            Dernière mise à jour : juin 2026
          </p>
        </div>
      </div>
    </section>
  );
}
