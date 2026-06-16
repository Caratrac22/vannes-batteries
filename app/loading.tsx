export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
        <p className="text-muted text-sm font-medium">Chargement…</p>
      </div>
    </div>
  );
}