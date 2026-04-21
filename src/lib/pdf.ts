import type { CalculationTotals, FormData } from "@/hooks/useExportCalculator";
import { formatMoney, formatPercent, parseMoney } from "@/lib/currency";

type PdfDocument = InstanceType<typeof import("jspdf").default>;
type AutoTable = typeof import("jspdf-autotable").default;

const BRAND_RED = [180, 26, 39] as const;
const BRAND_BLACK = [24, 24, 27] as const;
const BRAND_LIGHT = [248, 244, 244] as const;

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

const fmtMeasure = (value: string, unit: string) =>
  value.trim() ? `${value} ${unit}` : "Sin especificar";

const fmtUnitLabel = (value: FormData["unidadMedida"]) => {
  if (value === "paquete") return "Paquete";
  if (value === "pallet") return "Pallet";
  return "Caja";
};

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
    headStyles: { fillColor: [...BRAND_RED], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [...BRAND_LIGHT] },
    bodyStyles: { textColor: [...BRAND_BLACK] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 78 },
      1: { cellWidth: 96 },
    },
  });

  return (doc as PdfDocument & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? startY;
};

const loadLogoDataUrl = async () => {
  const logoUrl = `${import.meta.env.BASE_URL}mercadeo-aplicado-logo.png`;

  try {
    const response = await fetch(logoUrl);
    if (!response.ok) return null;

    const blob = await response.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(typeof reader.result === "string" ? reader.result : null);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export async function exportCalculationPdf({ form, calc, rows }: ExportCalculationPdfParams) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const logoDataUrl = await loadLogoDataUrl();
  const generatedAt = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 14, 10, 38, 15);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...BRAND_BLACK);
  doc.text("Resumen de Exportacion", logoDataUrl ? 58 : 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND_RED);
  doc.text(`Generado el ${generatedAt}`, logoDataUrl ? 58 : 14, 25);

  let y = logoDataUrl ? 36 : 34;

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
      ["Unidad de medida", fmtUnitLabel(form.unidadMedida)],
      ["Peso", fmtMeasure(form.pesoKg, "kg")],
      ["Alto", fmtMeasure(form.altoCm, "cm")],
      ["Ancho", fmtMeasure(form.anchoCm, "cm")],
      ["Largo", fmtMeasure(form.largoCm, "cm")],
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
      ["In/Out", fmtInputMoney(form.inOut)],
      ["Sorting", fmtInputMoney(form.sorting)],
      ["Fee mensual", fmtInputMoney(form.feeMensual)],
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
