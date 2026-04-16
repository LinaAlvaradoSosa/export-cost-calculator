import { useState, useMemo, useCallback } from "react";

export type Categoria = "moda" | "belleza";
export type ModeloLogistico = "FBA" | "FBM";

export interface FormData {
  empresa: string;
  producto: string;
  categoria: Categoria;
  modelo: ModeloLogistico;
  unidades: string;
  // Costos producto
  costoUnitario: string;
  precioReferencia: string;
  empaqueUnitario: string;
  // Exportación
  fedex: string;
  transporteInt: string;
  seguros: string;
  aranceles: string;
  nacionalizacion: string;
  agenciaAduana: string;
  otrosExportacion: string;
  // Importación / compliance
  etiquetadoCompliance: string;
  documentacion: string;
  inspeccion: string;
  otrosImportacion: string;
  // Categoría moda
  etiquetadoTextil: string;
  instruccionesCuidado: string;
  // Categoría belleza
  regulacionCosmetica: string;
  controlLote: string;
  // Logística USA
  almacenamiento: string;
  pickingPacking: string;
  inbound: string;
  transporteInterno: string;
  devoluciones: string;
  otrosLogistica: string;
}

const initialData: FormData = {
  empresa: "", producto: "", categoria: "moda", modelo: "FBA", unidades: "",
  costoUnitario: "", precioReferencia: "", empaqueUnitario: "",
  fedex: "", transporteInt: "", seguros: "", aranceles: "",
  nacionalizacion: "", agenciaAduana: "", otrosExportacion: "",
  etiquetadoCompliance: "", documentacion: "", inspeccion: "", otrosImportacion: "",
  etiquetadoTextil: "", instruccionesCuidado: "",
  regulacionCosmetica: "", controlLote: "",
  almacenamiento: "", pickingPacking: "", inbound: "",
  transporteInterno: "", devoluciones: "", otrosLogistica: "",
};

const n = (v: string) => {
  const num = parseFloat(v);
  return isNaN(num) || num < 0 ? 0 : num;
};

export function useExportCalculator() {
  const [form, setForm] = useState<FormData>(initialData);

  const update = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => setForm(initialData), []);

  const calc = useMemo(() => {
    const units = Math.max(1, Math.floor(n(form.unidades)) || 1);

    const subtotalProducto = n(form.costoUnitario) + n(form.empaqueUnitario);

    const subtotalExportacion =
      (n(form.fedex) + n(form.transporteInt) + n(form.seguros) + n(form.aranceles) +
        n(form.nacionalizacion) + n(form.agenciaAduana) + n(form.otrosExportacion)) / units;

    const subtotalImportacion =
      (n(form.etiquetadoCompliance) + n(form.documentacion) + n(form.inspeccion) + n(form.otrosImportacion)) / units;

    const subtotalCategoria =
      form.categoria === "moda"
        ? (n(form.etiquetadoTextil) + n(form.instruccionesCuidado)) / units
        : (n(form.regulacionCosmetica) + n(form.controlLote)) / units;

    const subtotalLogistica =
      n(form.almacenamiento) + n(form.pickingPacking) + n(form.inbound) +
      n(form.transporteInterno) + n(form.devoluciones) + n(form.otrosLogistica);

    const totalUnitario = subtotalProducto + subtotalExportacion + subtotalImportacion + subtotalCategoria + subtotalLogistica;
    const totalLote = totalUnitario * units;
    const precioRef = n(form.precioReferencia);
    const margen = precioRef > 0 ? ((precioRef - totalUnitario) / precioRef) * 100 : 0;

    const pct = (v: number) => (totalUnitario > 0 ? (v / totalUnitario) * 100 : 0);

    return {
      units,
      subtotalProducto,
      subtotalExportacion,
      subtotalImportacion,
      subtotalCategoria,
      subtotalLogistica,
      totalUnitario,
      totalLote,
      margen,
      pctProducto: pct(subtotalProducto),
      pctExportacion: pct(subtotalExportacion),
      pctImportacion: pct(subtotalImportacion),
      pctCategoria: pct(subtotalCategoria),
      pctLogistica: pct(subtotalLogistica),
    };
  }, [form]);

  return { form, update, reset, calc };
}
