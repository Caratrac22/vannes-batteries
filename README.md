# VANNES BATTERIES — Site web

Site professionnel de [Vannes Batteries](https://www.vannes-batteries.fr), spécialiste de la vente et pose de batteries à Vannes depuis plus de 30 ans.

## Stack

- **Framework** : Next.js 14 (App Router) + TypeScript
- **Styling** : Tailwind CSS v3 avec design system custom (rouge #DC2626 / bleu #1E40AF / blanc)
- **Animations** : Framer Motion 11
- **SEO** : JSON-LD LocalBusiness, sitemap automatisé, middleware trailing slash
- **Backend** : API contact avec Zod + Nodemailer + Redis rate-limiting
- **OG Image** : Générée dynamiquement via `@vercel/og`

## Développement

```bash
npm run dev     # http://localhost:3000
npm run build   # Production build
npm start       # Production server
```

## Structure

```
app/              # Routes Next.js (App Router)
├── a-propos/     # Galerie photos avec lightbox
├── contact/      # Formulaire de contact
├── services/     # Services
├── og-image/     # OG image dynamique
└── mentions-legales, politique-de-confidentialité, ...
components/
├── layout/       # Navbar, Footer
├── sections/     # Hero, Stats, Batteries, Services, PremiumShowcase, ...
└── ui/           # Lightbox, Icons, SocialLinks, SectionTitle
lib/              # Metadata, schema, animations, icons
public/media/     # Images et médias
```

## Commandes utiles

```bash
npm run lint      # ESLint
npm run build     # Build + sitemap automatique
```
