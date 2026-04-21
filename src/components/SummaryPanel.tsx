import { FileDown, RotateCcw } from "lucide-react";
import { formatMoney, formatPercent } from "@/lib/currency";

interface CostRow {
  label: string;
  value: number;
  lotValue: number;
  pct: number;
  color: string;
  basis: "unit" | "lot";
}

interface SummaryPanelProps {
  totalLote: number;
  totalUnitario: number;
  margen: number;
  gananciaUnitario: number;
  gananciaLote: number;
  precioReferencia: number;
  rows: CostRow[];
  onReset: () => void;
  onExportPdf: () => void;
}

export default function SummaryPanel({
  totalLote,
  totalUnitario,
  margen,
  gananciaUnitario,
  gananciaLote,
  precioReferencia,
  rows,
  onReset,
  onExportPdf,
}: SummaryPanelProps) {
  const healthTone =
    margen <= 0
      ? {
          label: "Rentabilidad en riesgo",
          pill: "bg-white/10 text-white border border-white/20",
        }
      : margen < 20
        ? {
            label: "Rentabilidad ajustada",
            pill: "bg-white/10 text-white border border-white/20",
          }
        : margen < 40
          ? {
              label: "Rentabilidad saludable",
              pill: "bg-white/15 text-white border border-white/25",
            }
          : {
              label: "Rentabilidad sólida",
              pill: "bg-white/15 text-white border border-white/25",
            };

  return (
    <div className="space-y-5">
      {/* Main summary */}
      <div className="summary-card space-y-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 opacity-90">
            <FileDown size={16} /> Resumen de Inversión
          </h3>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${healthTone.pill}`}>
            {healthTone.label}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] opacity-75 uppercase tracking-wider">Costo Total por Lote</p>
            <p className="mt-1 text-3xl font-extrabold">
              {formatMoney(totalLote)}
            </p>
          </div>
          <div>
            <p className="text-[11px] opacity-75 uppercase tracking-wider">Costo Unitario Final</p>
            <p className="mt-1 text-3xl font-extrabold">{formatMoney(totalUnitario)}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/15 bg-white/10 p-3">
            <p className="text-[11px] uppercase tracking-wider opacity-75">Ganancia por Unidad</p>
            <p className="mt-1 text-xl font-bold">{formatMoney(gananciaUnitario)}</p>
            {precioReferencia > 0 && (
              <p className="mt-1 text-xs opacity-80">
                Sobre un precio de venta de {formatMoney(precioReferencia)}.
              </p>
            )}
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-3">
            <p className="text-[11px] uppercase tracking-wider opacity-75">Ganancia por Lote</p>
            <p className="mt-1 text-xl font-bold">{formatMoney(gananciaLote)}</p>
            <p className="mt-1 text-xs opacity-80">
              Resultado estimado del lote completo.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
          <div>
            <p className="text-[11px] opacity-75 uppercase tracking-wider">Margen estimado</p>
            <p className="mt-1 text-2xl font-bold">{margen.toFixed(1)}%</p>
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full border ${
              margen >= 0
                ? "bg-white/10 text-white border-white/20"
                : "bg-black/20 text-white border-white/15"
            }`}
          >
            {margen >= 0 ? "↗" : "↘"} {margen >= 0 ? "Margen positivo" : "Margen negativo"}
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
              <span className="uppercase tracking-wider text-muted-foreground">
                {r.label} · {r.basis === "lot" ? "Por lote" : "Por unidad"}
              </span>
              <span className="text-foreground">
                {formatMoney(r.value)} ({formatPercent(r.pct)})
              </span>
            </div>
            {r.basis === "lot" && (
              <p className="mb-1 text-[11px] text-muted-foreground">
                Total lote: {formatMoney(r.lotValue)} dividido entre las unidades.
              </p>
            )}
            <div className="w-full h-2 rounded-full bg-muted">
              <div
                className="cost-bar"
                style={{ width: `${Math.min(r.pct, 100)}%`, backgroundColor: r.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Export */}
      <button
        onClick={onExportPdf}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
      >
        <FileDown size={15} /> Exportar PDF
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm font-medium"
      >
        <RotateCcw size={15} /> Limpiar Formulario
      </button>
    </div>
  );
}
