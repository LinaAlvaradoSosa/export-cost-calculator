import { Plus } from "lucide-react";

export default function TopNav() {
  return (
    <header className="flex items-center justify-between h-14 px-6 border-b bg-card">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-foreground tracking-tight">ExportCol</span>
        <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
          {["Dashboard", "Aranceles", "Logística", "Historial"].map((l) => (
            <button key={l} className="hover:text-foreground transition-colors">{l}</button>
          ))}
        </nav>
      </div>
      <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <Plus size={16} /> Nuevo Cálculo
      </button>
    </header>
  );
}
