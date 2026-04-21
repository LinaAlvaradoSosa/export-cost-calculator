import { useState, useMemo, useCallback, useEffect } from "react";
import { parseMoney } from "@/lib/currency";

export type Categoria = "moda" | "belleza";
export type ModeloLogistico = "FBA" | "FBM";
export type UnidadMedida = "caja" | "paquete" | "pallet";

export interface FormData {
  empresa: string;
  producto: string;
  categoria: Categoria;
  modelo: ModeloLogistico;
  unidadMedida: UnidadMedida;
  unidades: string;
  pesoKg: string;
  altoCm: string;
  anchoCm: string;
  largoCm: string;
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
  unidadMedida: "caja",
  unidades: "",
  pesoKg: "",
  altoCm: "",
  anchoCm: "",
  largoCm: "",
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

const isUnidadMedida = (value: unknown): value is UnidadMedida =>
  value === "caja" || value === "paquete" || value === "pallet";

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

    if (field === "unidadMedida") {
      normalized[field] = isUnidadMedida(savedValue) ? savedValue : initialData[field];
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

export function calculateTotals(form: FormData) {
  const units = Math.max(1, Math.floor(parseMoney(form.unidades)) || 1);
  const money = parseMoney;

  const subtotalProducto = money(form.costoUnitario) + money(form.empaqueUnitario);
  const subtotalProductoLote = subtotalProducto * units;

  const subtotalExportacionLote =
    money(form.fedex) +
    money(form.transporteInt) +
    money(form.seguros) +
    money(form.aranceles) +
    money(form.nacionalizacion) +
    money(form.agenciaAduana) +
    money(form.otrosExportacion);
  const subtotalExportacion = subtotalExportacionLote / units;

  const subtotalImportacionLote =
    money(form.etiquetadoCompliance) +
    money(form.documentacion) +
    money(form.inspeccion) +
    money(form.otrosImportacion);
  const subtotalImportacion = subtotalImportacionLote / units;

  const subtotalCategoriaLote =
    form.categoria === "moda"
      ? money(form.etiquetadoTextil) + money(form.instruccionesCuidado)
      : money(form.regulacionCosmetica) + money(form.controlLote);
  const subtotalCategoria = subtotalCategoriaLote / units;

  const subtotalLogisticaLote =
    money(form.almacenamiento) +
    money(form.pickingPacking) +
    money(form.inbound) +
    money(form.transporteInterno) +
    money(form.devoluciones) +
    money(form.otrosLogistica);
  const subtotalLogistica = subtotalLogisticaLote / units;

  const totalUnitario =
    subtotalProducto +
    subtotalExportacion +
    subtotalImportacion +
    subtotalCategoria +
    subtotalLogistica;

  const totalLote = totalUnitario * units;
  const precioRef = money(form.precioReferencia);
  const margen =
    precioRef > 0 ? ((precioRef - totalUnitario) / precioRef) * 100 : 0;
  const gananciaUnitario = precioRef - totalUnitario;
  const gananciaLote = gananciaUnitario * units;
  const ratioExportacionVenta =
    precioRef > 0 ? (subtotalExportacion / precioRef) * 100 : 0;
  const ratioLogisticaVenta =
    precioRef > 0 ? (subtotalLogistica / precioRef) * 100 : 0;

  const pct = (v: number) => (totalUnitario > 0 ? (v / totalUnitario) * 100 : 0);

  return {
    units,
    subtotalProducto,
    subtotalProductoLote,
    subtotalExportacion,
    subtotalExportacionLote,
    subtotalImportacion,
    subtotalImportacionLote,
    subtotalCategoria,
    subtotalCategoriaLote,
    subtotalLogistica,
    subtotalLogisticaLote,
    totalUnitario,
    totalLote,
    margen,
    gananciaUnitario,
    gananciaLote,
    precioRef,
    ratioExportacionVenta,
    ratioLogisticaVenta,
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
