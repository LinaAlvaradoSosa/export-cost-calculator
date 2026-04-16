import { Calculator } from "lucide-react";

const nav = [
  {
    icon: Calculator,
    label: "Simulador",
    description: "Panel principal para calcular costos y margen.",
    active: true,
  },
];

export default function AppSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 bg-sidebar-bg text-sidebar-fg min-h-screen p-5 shrink-0">
      <div className="mb-8">
        <h2 className="text-primary-foreground font-bold text-sm">Exportador Pro</h2>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              item.active
                ? "bg-[hsl(var(--sidebar-active)/0.15)] text-[hsl(var(--sidebar-active))] border-l-2 border-[hsl(var(--sidebar-active))]"
                : "hover:bg-[hsl(var(--sidebar-active)/0.08)] text-sidebar-fg"
            }`}
          >
            <item.icon size={18} className="mt-0.5 shrink-0" />
            <span>
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-[11px] leading-snug opacity-60 mt-0.5">{item.description}</span>
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
