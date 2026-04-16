import { Info, Package, Truck, ShieldCheck, Tag, Warehouse } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import TopNav from "@/components/TopNav";
import SectionCard from "@/components/SectionCard";
import CostField from "@/components/CostField";
import SummaryPanel from "@/components/SummaryPanel";
import { useExportCalculator, Categoria, ModeloLogistico } from "@/hooks/useExportCalculator";
import { exportCalculationPdf } from "@/lib/pdf";

export default function Index() {
  const { form, update, reset, calc } = useExportCalculator();

  const costRows = [
    { label: "Producto", value: calc.subtotalProducto, pct: calc.pctProducto, color: "hsl(210,70%,45%)" },
    { label: "Exportación", value: calc.subtotalExportacion, pct: calc.pctExportacion, color: "hsl(160,60%,45%)" },
    { label: "Importación", value: calc.subtotalImportacion, pct: calc.pctImportacion, color: "hsl(38,92%,50%)" },
    { label: "Categoría", value: calc.subtotalCategoria, pct: calc.pctCategoria, color: "hsl(280,60%,55%)" },
    { label: "Logística USA", value: calc.subtotalLogistica, pct: calc.pctLogistica, color: "hsl(350,70%,55%)" },
  ];

  const handleExportPdf = () => {
    void exportCalculationPdf({ form, calc, rows: costRows });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Simulador de Exportación</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Complete los detalles de su operación para obtener un desglose preciso de costos y márgenes.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Form */}
              <div className="flex-1 space-y-6 min-w-0">
                {/* 1. Info General */}
                <SectionCard icon={<Info size={18} />} title="Información General">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="empresa" className="field-label">Nombre de la Empresa</label>
                      <input
                        id="empresa"
                        className="field-input"
                        placeholder="Ej. Textiles de Colombia"
                        value={form.empresa}
                        onChange={(e) => update("empresa", e.target.value)}
                      />
                    </div>
                    <div>
                    <label htmlFor="producto" className="field-label">Producto</label>
                      <input
                        id="producto"
                        className="field-input"
                        placeholder="Ej. Camisetas Algodón"
                        value={form.producto}
                        onChange={(e) => update("producto", e.target.value)}
                      />
                    </div>
                    <div>
                    <label htmlFor="categoria" className="field-label">Categoría</label>
                      <select
                        id="categoria"
                        className="field-input"
                        value={form.categoria}
                        onChange={(e) => update("categoria", e.target.value as Categoria)}
                      >
                        <option value="moda">Moda (Textiles/Accesorios)</option>
                        <option value="belleza">Productos de Belleza</option>
                      </select>
                    </div>
                    <div>
                    <label htmlFor="modelo" className="field-label">Modelo Logístico</label>
                      <select
                        id="modelo"
                        className="field-input"
                        value={form.modelo}
                        onChange={(e) => update("modelo", e.target.value as ModeloLogistico)}
                      >
                        <option value="FBA">FBA (Amazon)</option>
                        <option value="FBM">FBM (Fulfillment propio)</option>
                      </select>
                    </div>
                    <div>
                    <label htmlFor="unidades" className="field-label">Unidades</label>
                        <input
                          id="unidades"
                          type="number"
                          min="1"
                          step="1"
                          className="field-input"
                          placeholder="500"
                          value={form.unidades}
                          onChange={(e) => update("unidades", e.target.value)}
                        />
                    </div>
                  </div>
                </SectionCard>

                {/* 2. Costos Producto */}
                <SectionCard icon={<Package size={18} />} title="Costos de Producto">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <CostField label="Costo Unitario (COP/USD)" value={form.costoUnitario} onChange={(v) => update("costoUnitario", v)} />
                    <CostField label="Precio Ref. Venta" value={form.precioReferencia} onChange={(v) => update("precioReferencia", v)} />
                    <CostField label="Empaque Unitario" value={form.empaqueUnitario} onChange={(v) => update("empaqueUnitario", v)} />
                  </div>
                </SectionCard>

                {/* 3. Exportación */}
                <SectionCard icon={<Truck size={18} />} title="Costos de Exportación (Logística)">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <CostField label="FedEx / Courier" value={form.fedex} onChange={(v) => update("fedex", v)} />
                    <CostField label="Transporte Int." value={form.transporteInt} onChange={(v) => update("transporteInt", v)} />
                    <CostField label="Seguros" value={form.seguros} onChange={(v) => update("seguros", v)} />
                    <CostField label="Aranceles" value={form.aranceles} onChange={(v) => update("aranceles", v)} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    <CostField label="Nacionalización" value={form.nacionalizacion} onChange={(v) => update("nacionalizacion", v)} />
                    <CostField label="Agencia Aduana" value={form.agenciaAduana} onChange={(v) => update("agenciaAduana", v)} />
                    <CostField label="Otros Gastos Export" value={form.otrosExportacion} onChange={(v) => update("otrosExportacion", v)} />
                  </div>
                </SectionCard>

                {/* 4. Compliance USA */}
                <SectionCard icon={<ShieldCheck size={18} />} title="Compliance USA">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <CostField label="Etiquetado Compliance (FDA/FTC)" value={form.etiquetadoCompliance} onChange={(v) => update("etiquetadoCompliance", v)} />
                    <CostField label="Documentación & Certificados" value={form.documentacion} onChange={(v) => update("documentacion", v)} />
                    <CostField label="Inspección" value={form.inspeccion} onChange={(v) => update("inspeccion", v)} />
                    <CostField label="Otros Costos Importación" value={form.otrosImportacion} onChange={(v) => update("otrosImportacion", v)} />
                  </div>
                </SectionCard>

                {/* 5. Categoría */}
                <SectionCard
                  icon={<Tag size={18} />}
                  title={`Detalles de Categoría: ${form.categoria === "moda" ? "Moda" : "Belleza"}`}
                >
                  {form.categoria === "moda" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CostField label="Costo Textil/Insumos" value={form.etiquetadoTextil} onChange={(v) => update("etiquetadoTextil", v)} />
                      <CostField label="Instrucciones de Cuidado" value={form.instruccionesCuidado} onChange={(v) => update("instruccionesCuidado", v)} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CostField label="Etiquetado/Regulación Cosmética" value={form.regulacionCosmetica} onChange={(v) => update("regulacionCosmetica", v)} />
                      <CostField label="Control de Lote/Vencimiento" value={form.controlLote} onChange={(v) => update("controlLote", v)} />
                    </div>
                  )}
                </SectionCard>

                {/* 6. Logística USA */}
                <SectionCard icon={<Warehouse size={18} />} title="Logística & Fulfillment USA">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <CostField label="Almacenamiento (Mes)" value={form.almacenamiento} onChange={(v) => update("almacenamiento", v)} />
                    <CostField label="Picking / Packing" value={form.pickingPacking} onChange={(v) => update("pickingPacking", v)} />
                    <CostField label="Inbound Ship" value={form.inbound} onChange={(v) => update("inbound", v)} />
                    <CostField label="Transporte Local" value={form.transporteInterno} onChange={(v) => update("transporteInterno", v)} />
                    <CostField label="Devoluciones" value={form.devoluciones} onChange={(v) => update("devoluciones", v)} />
                    <CostField label="Otros Logística" value={form.otrosLogistica} onChange={(v) => update("otrosLogistica", v)} />
                  </div>
                </SectionCard>
              </div>

              {/* Summary */}
              <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-6 lg:self-start">
                <SummaryPanel
                  totalLote={calc.totalLote}
                  totalUnitario={calc.totalUnitario}
                  margen={calc.margen}
                  rows={costRows}
                  onReset={reset}
                  onExportPdf={handleExportPdf}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
