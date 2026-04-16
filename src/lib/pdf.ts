import type { CalculationTotals, FormData } from "@/hooks/useExportCalculator";
import { formatMoney, formatPercent, parseMoney } from "@/lib/currency";

type PdfDocument = InstanceType<typeof import("jspdf").default>;
type AutoTable = typeof import("jspdf-autotable").default;

export interface PdfCostRow {
  label: string;
  value: number;
  lotValue: number;
  pct: number;
  basis: "unit" | "lot";
}

interface ExportCalculationPdfParams {
  form: FormData;
  calc: CalculationTotals;
  rows: PdfCostRow[];
}

const fmtText = (value: string, fallback = "Sin especificar") =>
  value.trim() || fallback;

const fmtInputMoney = (value: string) => formatMoney(parseMoney(value));

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const addSection = (
  autoTable: AutoTable,
  doc: PdfDocument,
  title: string,
  body: Array<[string, string]>,
  startY: number,
) => {
  autoTable(doc, {
    startY,
    head: [[title, ""]],
    body,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [24, 24, 27], textColor: [255, 255, 255] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 78 },
      1: { cellWidth: 96 },
    },
  });

  return (doc as PdfDocument & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? startY;
};

export async function exportCalculationPdf({ form, calc, rows }: ExportCalculationPdfParams) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const generatedAt = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Resumen de Exportacion", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generado el ${generatedAt}`, 14, 25);

  let y = 34;

  y = addSection(
    autoTable,
    doc,
    "Informacion general",
    [
      ["Empresa", fmtText(form.empresa)],
      ["Producto", fmtText(form.producto)],
      ["Categoria", form.categoria === "moda" ? "Moda" : "Belleza"],
      ["Modelo logistico", form.modelo === "FBA" ? "Gestionado por Amazon" : "Gestionado por el vendedor"],
      ["Moneda", "USD"],
      ["Unidades", String(calc.units)],
    ],
    y,
  );

  y = addSection(
    autoTable,
    doc,
    "Resultado",
    [
      ["Costo total por lote", formatMoney(calc.totalLote)],
      ["Costo unitario final", formatMoney(calc.totalUnitario)],
      ["Precio ref. venta", fmtInputMoney(form.precioReferencia)],
      ["Margen estimado", `${calc.margen.toFixed(1)}%`],
    ],
    y + 8,
  );

  y = addSection(
    autoTable,
    doc,
    "Distribucion de costos",
    rows.map((row) => [
      `${row.label} (${row.basis === "lot" ? "por lote" : "por unidad"})`,
      row.basis === "lot"
        ? `${formatMoney(row.value)} por unidad / ${formatMoney(row.lotValue)} por lote (${formatPercent(row.pct)})`
        : `${formatMoney(row.value)} por unidad (${formatPercent(row.pct)})`,
    ]),
    y + 8,
  );

  const categoryRows: Array<[string, string]> =
    form.categoria === "moda"
      ? [
          ["Costo textil/insumos", fmtInputMoney(form.etiquetadoTextil)],
          ["Instrucciones de cuidado", fmtInputMoney(form.instruccionesCuidado)],
        ]
      : [
          ["Etiquetado/regulacion cosmetica", fmtInputMoney(form.regulacionCosmetica)],
          ["Control de lote/vencimiento", fmtInputMoney(form.controlLote)],
        ];

  y = addSection(
    autoTable,
    doc,
    "Detalle de costos",
    [
      ["Costo unitario", fmtInputMoney(form.costoUnitario)],
      ["Empaque unitario", fmtInputMoney(form.empaqueUnitario)],
      ["FedEx / Mensajeria", fmtInputMoney(form.fedex)],
      ["Transporte internacional", fmtInputMoney(form.transporteInt)],
      ["Seguros", fmtInputMoney(form.seguros)],
      ["Aranceles", fmtInputMoney(form.aranceles)],
      ["Nacionalizacion", fmtInputMoney(form.nacionalizacion)],
      ["Agencia aduana", fmtInputMoney(form.agenciaAduana)],
      ["Otros gastos exportacion", fmtInputMoney(form.otrosExportacion)],
      ["Etiquetado normativo", fmtInputMoney(form.etiquetadoCompliance)],
      ["Documentacion y certificados", fmtInputMoney(form.documentacion)],
      ["Inspeccion", fmtInputMoney(form.inspeccion)],
      ["Otros costos importacion", fmtInputMoney(form.otrosImportacion)],
      ...categoryRows,
      ["Almacenamiento", fmtInputMoney(form.almacenamiento)],
      ["Preparacion y empaque", fmtInputMoney(form.pickingPacking)],
      ["Envio entrante", fmtInputMoney(form.inbound)],
      ["Transporte local", fmtInputMoney(form.transporteInterno)],
      ["Devoluciones", fmtInputMoney(form.devoluciones)],
      ["Otros logistica", fmtInputMoney(form.otrosLogistica)],
    ],
    y + 8,
  );

  const baseName = slugify(form.producto || form.empresa || "calculo-exportacion");
  doc.save(`${baseName || "calculo-exportacion"}.pdf`);
}
