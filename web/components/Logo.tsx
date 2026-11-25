export default function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-900/50 p-1.5 flex-shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Órbita Externa do G */}
        <path d="M 50 8 A 42 42 0 1 1 49.9 8" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        {/* Órbita Média */}
        <path d="M 50 22 A 28 28 0 1 1 49.9 22" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        {/* Órbita Interna e Ramo do G */}
        <path d="M 50 36 A 14 14 0 1 1 49.9 36 M 50 50 L 78 50 M 50 36 L 78 36 M 50 64 L 78 64" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
        {/* Ponto Central Sólido */}
        <circle cx="50" cy="50" r="7" fill="#ffffff" />
      </svg>
    </div>
  );
}