"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      <div className="text-center">
        <p className="text-red-500 font-rajdhani font-bold text-6xl md:text-8xl mb-4">!</p>
        <h1 className="font-rajdhani font-bold text-2xl md:text-3xl text-white uppercase mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-muted mb-8 max-w-md mx-auto">
          Nous nous excusons pour ce désagrément. Veuillez réessayer.
        </p>
        <button onClick={reset} className="btn-primary">
          Réessayer
        </button>
      </div>
    </section>
  );
}