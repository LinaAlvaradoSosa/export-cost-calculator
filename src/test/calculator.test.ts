import { describe, it, expect } from "vitest";
import {
    calculateTotals,
    initialData,
    type FormData,
} from "../hooks/useExportCalculator";

describe("Calculadora de exportación", () => {
    it("calcula correctamente el total unitario", () => {
        const form: FormData = {
        ...initialData,
        costoUnitario: "10",
        fedex: "5",
        categoria: "moda",
        modelo: "FBA",
        unidades: "1",
    };

    const result = calculateTotals(form);

    expect(result.totalUnitario).toBe(15);
});

    it("calcula correctamente el total por lote", () => {
        const form: FormData = {
        ...initialData,
        costoUnitario: "10",
        fedex: "5",
        unidades: "100",
    };

    const result = calculateTotals(form);

    expect(result.totalUnitario).toBeCloseTo(10.05, 10);
    expect(result.totalLote).toBeCloseTo(1005, 10);
    expect(result.units).toBe(100);
});

    it("usa solo los costos de moda cuando la categoría es moda", () => {
        const form: FormData = {
        ...initialData,
        categoria: "moda",
        unidades: "1",
        etiquetadoTextil: "5",
        instruccionesCuidado: "3",
        regulacionCosmetica: "100",
        controlLote: "100",
    };

    const result = calculateTotals(form);

    expect(result.subtotalCategoria).toBe(8);
});

    it("usa solo los costos de belleza cuando la categoría es belleza", () => {
        const form: FormData = {
        ...initialData,
        categoria: "belleza",
        unidades: "1",
        etiquetadoTextil: "5",
        instruccionesCuidado: "3",
        regulacionCosmetica: "4",
        controlLote: "6",
    };

    const result = calculateTotals(form);

    expect(result.subtotalCategoria).toBe(10);
});

    it("convierte valores vacíos o negativos en 0", () => {
        const form: FormData = {
        ...initialData,
        costoUnitario: "",
        fedex: "-10",
        unidades: "",
    };

    const result = calculateTotals(form);

    expect(result.totalUnitario).toBe(0);
    expect(result.totalLote).toBe(0);
    expect(result.units).toBe(1);
});

    it("calcula correctamente el margen con precio de referencia", () => {
        const form: FormData = {
        ...initialData,
        costoUnitario: "20",
        precioReferencia: "50",
        unidades: "1",
    };

    const result = calculateTotals(form);

    expect(result.totalUnitario).toBe(20);
    expect(result.margen).toBe(60);
});

    it("calcula correctamente el porcentaje de producto", () => {
        const form: FormData = {
        ...initialData,
        costoUnitario: "20",
        fedex: "20",
        unidades: "1",
    };

    const result = calculateTotals(form);

    expect(result.pctProducto).toBeCloseTo(50, 10);
    expect(result.pctExportacion).toBeCloseTo(50, 10);
});
});