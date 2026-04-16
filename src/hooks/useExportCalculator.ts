import { useState, useMemo, useCallback, useEffect } from "react";

export type Categoria = "moda" | "belleza";
export type ModeloLogistico = "FBA" | "FBM";

export interface FormData {
  empresa: string;
  producto: string;
  categoria: Categoria;
  modelo: ModeloLogistico;
  unidades: string;
  costoUnitario: string;
  precioReferencia: string;
  empaqueUnitario: string;
  fedex: string;
  transporteInt: string;
  seguros: string;
  aranceles: string;
  nacionalizacion: string;
  agenciaAduana: string;
  otrosExportacion: string;
  etiquetadoCompliance: string;
  documentacion: string;
  inspeccion: string;
  otrosImportacion: string;
  etiquetadoTextil: string;
  instruccionesCuidado: string;
  regulacionCosmetica: string;
  controlLote: string;
  almacenamiento: string;
  pickingPacking: string;
  inbound: string;
  transporteInterno: string;
  devoluciones: string;
  otrosLogistica: string;
}

export const initialData: FormData = {
  empresa: "",
  producto: "",
  categoria: "moda",
  modelo: "FBA",
  unidades: "",
  costoUnitario: "",
  precioReferencia: "",
  empaqueUnitario: "",
  fedex: "",
  transporteInt: "",
  seguros: "",
  aranceles: "",
  nacionalizacion: "",
  agenciaAduana: "",
  otrosExportacion: "",
  etiquetadoCompliance: "",
  documentacion: "",
  inspeccion: "",
  otrosImportacion: "",
  etiquetadoTextil: "",
  instruccionesCuidado: "",
  regulacionCosmetica: "",
  controlLote: "",
  almacenamiento: "",
  pickingPacking: "",
  inbound: "",
  transporteInterno: "",
  devoluciones: "",
  otrosLogistica: "",
};

const STORAGE_KEY = "export-cost-calculator:form:v1";

const isCategoria = (value: unknown): value is Categoria =>
  value === "moda" || value === "belleza";

const isModeloLogistico = (value: unknown): value is ModeloLogistico =>
  value === "FBA" || value === "FBM";

function normalizeSavedForm(value: unknown): FormData | null {
  if (!value || typeof value !== "object") return null;

  const saved = value as Partial<Record<keyof FormData, unknown>>;
  const normalized = { ...initialData };

  Object.keys(initialData).forEach((key) => {
    const field = key as keyof FormData;
    const savedValue = saved[field];

    if (field === "categoria") {
      normalized[field] = isCategoria(savedValue) ? savedValue : initialData[field];
      return;
    }

    if (field === "modelo") {
      normalized[field] = isModeloLogistico(savedValue) ? savedValue : initialData[field];
      return;
    }

    normalized[field] = typeof savedValue === "string" ? savedValue : initialData[field];
  });

  return normalized;
}

function loadSavedForm(): FormData {
  if (typeof window === "undefined") return initialData;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;

    return normalizeSavedForm(JSON.parse(raw)) ?? initialData;
  } catch {
    return initialData;
  }
}

function saveForm(form: FormData) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  } catch {
    // Local storage can fail in private browsing or when quota is exceeded.
  }
}

function clearSavedForm() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures; the in-memory form still resets.
  }
}

const n = (v: string) => {
  const num = parseFloat(v);
  return isNaN(num) || num < 0 ? 0 : num;
};

export function calculateTotals(form: FormData) {
  const units = Math.max(1, Math.floor(n(form.unidades)) || 1);

  const subtotalProducto = n(form.costoUnitario) + n(form.empaqueUnitario);

  const subtotalExportacion =
    (n(form.fedex) +
      n(form.transporteInt) +
      n(form.seguros) +
      n(form.aranceles) +
      n(form.nacionalizacion) +
      n(form.agenciaAduana) +
      n(form.otrosExportacion)) / units;

  const subtotalImportacion =
    (n(form.etiquetadoCompliance) +
      n(form.documentacion) +
      n(form.inspeccion) +
      n(form.otrosImportacion)) / units;

  const subtotalCategoria =
    form.categoria === "moda"
      ? (n(form.etiquetadoTextil) + n(form.instruccionesCuidado)) / units
      : (n(form.regulacionCosmetica) + n(form.controlLote)) / units;

  const subtotalLogistica =
    n(form.almacenamiento) +
    n(form.pickingPacking) +
    n(form.inbound) +
    n(form.transporteInterno) +
    n(form.devoluciones) +
    n(form.otrosLogistica);

  const totalUnitario =
    subtotalProducto +
    subtotalExportacion +
    subtotalImportacion +
    subtotalCategoria +
    subtotalLogistica;

  const totalLote = totalUnitario * units;
  const precioRef = n(form.precioReferencia);
  const margen =
    precioRef > 0 ? ((precioRef - totalUnitario) / precioRef) * 100 : 0;

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
}

export type CalculationTotals = ReturnType<typeof calculateTotals>;

export function useExportCalculator() {
  const [form, setForm] = useState<FormData>(() => loadSavedForm());

  const update = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    clearSavedForm();
    setForm(initialData);
  }, []);

  useEffect(() => {
    saveForm(form);
  }, [form]);

  const calc = useMemo(() => calculateTotals(form), [form]);

  return { form, update, reset, calc };
}
