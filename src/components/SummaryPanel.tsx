import { FileDown, RotateCcw } from "lucide-react";

interface CostRow {
  label: string;
  value: number;
  pct: number;
  color: string;
}

interface SummaryPanelProps {
  totalLote: number;
  totalUnitario: number;
  margen: number;
  rows: CostRow[];
  onReset: () => void;
}

const fmt = (v: number) =>
  v.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SummaryPanel({ totalLote, totalUnitario, margen, rows, onReset }: SummaryPanelProps) {
  return (
    <div className="space-y-5">
      {/* Main summary */}
      <div className="summary-card space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 opacity-90">
          <FileDown size={16} /> Resumen de Inversión
        </h3>
        <div>
          <p className="text-xs opacity-70 uppercase tracking-wider">Costo Total por Lote</p>
          <p className="text-3xl font-extrabold mt-1">
            ${fmt(totalLote)} <span className="text-sm font-normal opacity-70">USD</span>
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-70 uppercase tracking-wider">Costo Unitario Final</p>
            <p className="text-2xl font-bold">${fmt(totalUnitario)}</p>
          </div>
          <span
            className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
              margen >= 0
                ? "bg-accent/20 text-accent-foreground"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            {margen >= 0 ? "↗" : "↘"} Margen {margen.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Cost distribution */}
      <div className="section-card space-y-4">
        <h3 className="section-title text-base">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary">⚙</span>
          Distribución de Costos
        </h3>
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="uppercase tracking-wider text-muted-foreground">{r.label}</span>
              <span className="text-foreground">
                ${fmt(r.value)} ({r.pct.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted">
              <div
                className="cost-bar"
                style={{ width: `${Math.min(r.pct, 100)}%`, backgroundColor: r.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      {margen < 20 && margen > 0 && (
        <div className="section-card bg-warning/5 border-warning/20">
          <div className="flex gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Tip del Experto</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tu margen es bajo. Considera consolidar carga o negociar tarifas de transporte para mejorar tu rentabilidad.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm font-medium"
      >
        <RotateCcw size={15} /> Limpiar Formulario
      </button>
    </div>
  );
}
