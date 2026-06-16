import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      <div className="text-center">
        <p className="text-orange font-rajdhani font-bold text-7xl md:text-9xl mb-4">404</p>
        <h1 className="font-rajdhani font-bold text-2xl md:text-3xl text-white uppercase mb-4">
          Page introuvable
        </h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}