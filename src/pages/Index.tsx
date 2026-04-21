import { Info, Package, Truck, ShieldCheck, Tag, Warehouse } from "lucide-react";
import TopNav from "@/components/TopNav";
import SectionCard from "@/components/SectionCard";
import CostField from "@/components/CostField";
import FieldLabel from "@/components/FieldLabel";
import SummaryPanel from "@/components/SummaryPanel";
import { useExportCalculator, Categoria, ModeloLogistico, UnidadMedida } from "@/hooks/useExportCalculator";
import { exportCalculationPdf } from "@/lib/pdf";

export default function Index() {
  const { form, update, reset, calc } = useExportCalculator();
  const currencySuffix = "USD";
  const fieldTips = {
    empresa: "Nombre comercial o razón social del exportador.",
    producto: "Nombre del producto que estás evaluando para exportación.",
    categoria: "Define qué bloque regulatorio y de categoría aplica al cálculo.",
    modelo: "Selecciona si la gestión logística la hace Amazon o el vendedor.",
    unidades: "Cantidad total de unidades incluidas en el lote.",
    unidadMedida: "Forma en que se presenta o despacha el lote: caja, paquete o pallet.",
    pesoKg: "Peso total estimado del lote en kilogramos.",
    altoCm: "Altura total del empaque o unidad logística en centímetros.",
    anchoCm: "Ancho total del empaque o unidad logística en centímetros.",
    largoCm: "Largo total del empaque o unidad logística en centímetros.",
  } as const;

  const costRows = [
    {
      label: "Producto",
      value: calc.subtotalProducto,
      lotValue: calc.subtotalProductoLote,
      pct: calc.pctProducto,
      color: "hsl(355, 75%, 40%)",
      basis: "unit" as const,
    },
    {
      label: "Exportación",
      value: calc.subtotalExportacion,
      lotValue: calc.subtotalExportacionLote,
      pct: calc.pctExportacion,
      color: "hsl(358, 68%, 36%)",
      basis: "lot" as const,
    },
    {
      label: "Importación",
      value: calc.subtotalImportacion,
      lotValue: calc.subtotalImportacionLote,
      pct: calc.pctImportacion,
      color: "hsl(0, 65%, 58%)",
      basis: "lot" as const,
    },
    {
      label: "Categoría",
      value: calc.subtotalCategoria,
      lotValue: calc.subtotalCategoriaLote,
      pct: calc.pctCategoria,
      color: "hsl(0, 0%, 22%)",
      basis: "lot" as const,
    },
    {
      label: "Logística EE. UU.",
      value: calc.subtotalLogistica,
      lotValue: calc.subtotalLogisticaLote,
      pct: calc.pctLogistica,
      color: "hsl(0, 83%, 40%)",
      basis: "lot" as const,
    },
  ];

  const handleExportPdf = () => {
    void exportCalculationPdf({ form, calc, rows: costRows });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col min-w-0">
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
                    <FieldLabel htmlFor="empresa" label="Nombre de la Empresa" tooltip={fieldTips.empresa} />
                      <input
                        id="empresa"
                        className="field-input"
                        placeholder="Ej. Textiles de Colombia"
                        value={form.empresa}
                        onChange={(e) => update("empresa", e.target.value)}
                      />
                    </div>
                    <div>
                    <FieldLabel htmlFor="producto" label="Producto" tooltip={fieldTips.producto} />
                      <input
                        id="producto"
                        className="field-input"
                        placeholder="Ej. Camisetas Algodón"
                        value={form.producto}
                        onChange={(e) => update("producto", e.target.value)}
                      />
                    </div>
                    <div>
                    <FieldLabel htmlFor="categoria" label="Categoría" tooltip={fieldTips.categoria} />
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
                    <FieldLabel htmlFor="modelo" label="Modelo Logístico" tooltip={fieldTips.modelo} />
                      <select
                        id="modelo"
                        className="field-input"
                        value={form.modelo}
                        onChange={(e) => update("modelo", e.target.value as ModeloLogistico)}
                      >
                        <option value="FBA">FBA (gestionado por Amazon)</option>
                        <option value="FBM">FBM (gestionado por el vendedor)</option>
                      </select>
                    </div>
                    <div>
                    <FieldLabel htmlFor="unidades" label="Unidades" tooltip={fieldTips.unidades} />
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
                    <div>
                    <FieldLabel htmlFor="unidad-medida" label="Unidad de Medida" tooltip={fieldTips.unidadMedida} />
                      <select
                        id="unidad-medida"
                        className="field-input"
                        value={form.unidadMedida}
                        onChange={(e) => update("unidadMedida", e.target.value as UnidadMedida)}
                      >
                        <option value="caja">Caja</option>
                        <option value="paquete">Paquete</option>
                        <option value="pallet">Pallet</option>
                      </select>
                    </div>
                    <div>
                    <FieldLabel htmlFor="peso-kg" label="Peso (Kg)" tooltip={fieldTips.pesoKg} />
                        <input
                          id="peso-kg"
                          type="number"
                          min="0"
                          step="any"
                          className="field-input"
                          placeholder="25"
                          value={form.pesoKg}
                          onChange={(e) => update("pesoKg", e.target.value)}
                        />
                    </div>
                    <div>
                    <FieldLabel htmlFor="alto-cm" label="Alto (cm)" tooltip={fieldTips.altoCm} />
                        <input
                          id="alto-cm"
                          type="number"
                          min="0"
                          step="any"
                          className="field-input"
                          placeholder="40"
                          value={form.altoCm}
                          onChange={(e) => update("altoCm", e.target.value)}
                        />
                    </div>
                    <div>
                    <FieldLabel htmlFor="ancho-cm" label="Ancho (cm)" tooltip={fieldTips.anchoCm} />
                        <input
                          id="ancho-cm"
                          type="number"
                          min="0"
                          step="any"
                          className="field-input"
                          placeholder="30"
                          value={form.anchoCm}
                          onChange={(e) => update("anchoCm", e.target.value)}
                        />
                    </div>
                    <div>
                    <FieldLabel htmlFor="largo-cm" label="Largo (cm)" tooltip={fieldTips.largoCm} />
                        <input
                          id="largo-cm"
                          type="number"
                          min="0"
                          step="any"
                          className="field-input"
                          placeholder="60"
                          value={form.largoCm}
                          onChange={(e) => update("largoCm", e.target.value)}
                        />
                    </div>
                  </div>
                </SectionCard>

                {/* 2. Costos Producto */}
                <SectionCard icon={<Package size={18} />} title="Costos de Producto (por unidad)">
                  <div className="grid grid-cols-1 min-[520px]:grid-cols-2 xl:grid-cols-3 gap-4">
                    <CostField label="Costo Unitario" value={form.costoUnitario} onChange={(v) => update("costoUnitario", v)} suffix={currencySuffix} helperText="Costo por cada unidad." />
                    <CostField label="Precio Ref. Venta" value={form.precioReferencia} onChange={(v) => update("precioReferencia", v)} suffix={currencySuffix} helperText="Precio esperado por unidad." />
                    <CostField label="Empaque Unitario" value={form.empaqueUnitario} onChange={(v) => update("empaqueUnitario", v)} suffix={currencySuffix} helperText="Empaque por cada unidad." />
                  </div>
                </SectionCard>

                {/* 3. Exportación */}
                <SectionCard icon={<Truck size={18} />} title="Costos de Exportación">
                  <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CostField label="FedEx / Mensajería" value={form.fedex} onChange={(v) => update("fedex", v)} suffix={currencySuffix} helperText="Costo total del envío internacional por courier o mensajería para este lote." />
                    <CostField label="Transporte Int." value={form.transporteInt} onChange={(v) => update("transporteInt", v)} suffix={currencySuffix} helperText="Costo del transporte internacional principal desde origen hasta destino." />
                    <CostField label="Seguros" value={form.seguros} onChange={(v) => update("seguros", v)} suffix={currencySuffix} helperText="Prima del seguro de carga para proteger el lote durante el tránsito." />
                    <CostField label="Aranceles" value={form.aranceles} onChange={(v) => update("aranceles", v)} suffix={currencySuffix} helperText="Impuestos o derechos aduaneros aplicables al ingresar la mercancía." />
                  </div>
                  <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <CostField label="Nacionalización" value={form.nacionalizacion} onChange={(v) => update("nacionalizacion", v)} suffix={currencySuffix} helperText="Costos asociados al proceso de ingreso legal y liberación aduanera del lote." />
                    <CostField label="Agencia Aduana" value={form.agenciaAduana} onChange={(v) => update("agenciaAduana", v)} suffix={currencySuffix} helperText="Honorarios del agente o agencia aduanera que gestiona la operación." />
                    <CostField label="Otros Gastos Export" value={form.otrosExportacion} onChange={(v) => update("otrosExportacion", v)} suffix={currencySuffix} helperText="Cualquier costo adicional de exportación que no esté cubierto en los campos anteriores." />
                  </div>
                </SectionCard>

                {/* 4. Cumplimiento en EE. UU. */}
                <SectionCard
                  icon={<ShieldCheck size={18} />}
                  title={
                    <span className="text-foreground">Cumplimiento legal en EE. UU.</span>
                  }
                >
                  <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CostField label="Etiquetado normativo (FDA/FTC)" value={form.etiquetadoCompliance} onChange={(v) => update("etiquetadoCompliance", v)} suffix={currencySuffix} helperText="Adecuaciones de etiquetado para cumplir requisitos regulatorios y de información al consumidor." />
                    <CostField label="Documentación & Certificados" value={form.documentacion} onChange={(v) => update("documentacion", v)} suffix={currencySuffix} helperText="Certificados, fichas técnicas, registros o documentos exigidos para importar o comercializar." />
                    <CostField label="Inspección" value={form.inspeccion} onChange={(v) => update("inspeccion", v)} suffix={currencySuffix} helperText="Revisión física, técnica o de calidad requerida por autoridad, cliente o canal de venta." />
                    <CostField label="Otros Costos Importación" value={form.otrosImportacion} onChange={(v) => update("otrosImportacion", v)} suffix={currencySuffix} helperText="Gastos adicionales de cumplimiento o importación no contemplados en los otros campos." />
                  </div>
                </SectionCard>

                {/* 5. Categoría */}
                <SectionCard
                  icon={<Tag size={18} />}
                  title={`Detalles de Categoría: ${form.categoria === "moda" ? "Moda" : "Belleza"}`}
                >
                  {form.categoria === "moda" ? (
                    <div className="grid grid-cols-1 min-[520px]:grid-cols-2 gap-4">
                      <CostField label="Costo Textil/Insumos" value={form.etiquetadoTextil} onChange={(v) => update("etiquetadoTextil", v)} suffix={currencySuffix} helperText="Costos adicionales propios de moda, como insumos textiles, etiquetas de composición o acabados requeridos." />
                      <CostField label="Instrucciones de Cuidado" value={form.instruccionesCuidado} onChange={(v) => update("instruccionesCuidado", v)} suffix={currencySuffix} helperText="Costo de incluir etiquetas, impresión o materiales con instrucciones de lavado, uso y conservación." />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 min-[520px]:grid-cols-2 gap-4">
                      <CostField label="Etiquetado/Regulación Cosmética" value={form.regulacionCosmetica} onChange={(v) => update("regulacionCosmetica", v)} suffix={currencySuffix} helperText="Adecuaciones regulatorias, claims, ingredientes y rotulado exigidos para productos cosméticos." />
                      <CostField label="Control de Lote/Vencimiento" value={form.controlLote} onChange={(v) => update("controlLote", v)} suffix={currencySuffix} helperText="Marcación y control de lote, fecha de vencimiento o trazabilidad del producto." />
                    </div>
                  )}
                </SectionCard>

                {/* 6. Logística en EE. UU. */}
                <SectionCard icon={<Warehouse size={18} />} title="Logística y gestión en EE. UU">
                  <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CostField label="Almacenamiento (Mes)" value={form.almacenamiento} onChange={(v) => update("almacenamiento", v)} suffix={currencySuffix} helperText="Costo estimado de bodegaje o almacenamiento del inventario en EE. UU. durante un periodo mensual." />
                    <CostField label="Picking and Packing" value={form.pickingPacking} onChange={(v) => update("pickingPacking", v)} suffix={currencySuffix} helperText="Costo de preparación del pedido: alistamiento, empaque y manipulación dentro del centro logístico." />
                    <CostField label="Envío entrante" value={form.inbound} onChange={(v) => update("inbound", v)} suffix={currencySuffix} helperText="Costo de mover el lote desde el punto de llegada hasta la bodega o centro de fulfillment." />
                    <CostField label="Transporte Local" value={form.transporteInterno} onChange={(v) => update("transporteInterno", v)} suffix={currencySuffix} helperText="Traslados internos en EE. UU. entre bodega, operador logístico, cliente o marketplace." />
                    <CostField label="Devoluciones" value={form.devoluciones} onChange={(v) => update("devoluciones", v)} suffix={currencySuffix} helperText="Reserva estimada para gestionar devoluciones, reprocesos o reposición de inventario." />
                    <CostField label="Otros costos" value={form.otrosLogistica} onChange={(v) => update("otrosLogistica", v)} suffix={currencySuffix} helperText="Cargos logísticos adicionales en EE. UU. que no encajan en almacenamiento, preparación o transporte." />
                  </div>
                </SectionCard>
              </div>

              {/* Summary */}
              <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-6 lg:self-start">
                <SummaryPanel
                  totalLote={calc.totalLote}
                  totalUnitario={calc.totalUnitario}
                  margen={calc.margen}
                  gananciaUnitario={calc.gananciaUnitario}
                  gananciaLote={calc.gananciaLote}
                  precioReferencia={calc.precioRef}
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
