import { Calculator, Shirt, Sparkles, Settings } from "lucide-react";

const nav = [
  { icon: Calculator, label: "Simulador", active: true },
  { icon: Shirt, label: "Moda", active: false },
  { icon: Sparkles, label: "Belleza", active: false },
  { icon: Settings, label: "Configuración", active: false },
];

export default function AppSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 bg-sidebar-bg text-sidebar-fg min-h-screen p-5 shrink-0">
      <div className="mb-8">
        <h2 className="text-primary-foreground font-bold text-sm">Exportador Pro</h2>
        <p className="text-[11px] opacity-50 uppercase tracking-wider mt-0.5">Plan Premium</p>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-[hsl(var(--sidebar-active)/0.15)] text-[hsl(var(--sidebar-active))] border-l-2 border-[hsl(var(--sidebar-active))]"
                : "hover:bg-[hsl(var(--sidebar-active)/0.08)] text-sidebar-fg"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
