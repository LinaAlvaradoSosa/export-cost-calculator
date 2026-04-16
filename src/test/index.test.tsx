import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Index from "../pages/Index";
import { beforeEach, describe, it, expect } from "vitest";

describe("Index - UI calculadora", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza el título principal", () => {
    render(<Index />);

    expect(screen.getByText("Simulador de Exportación")).toBeInTheDocument();
    expect(screen.getByText("Información General")).toBeInTheDocument();
  });

  it("muestra campos de moda por defecto", () => {
    render(<Index />);

    expect(screen.getByText(/Detalles de Categoría: Moda/i)).toBeInTheDocument();
    expect(screen.getByText(/Costo Textil\/Insumos/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Instrucciones de Cuidado")).toBeInTheDocument();
  });

  it("cambia a belleza y muestra los campos correctos", async () => {
    const user = userEvent.setup();
    render(<Index />);

    const categoriaSelect = screen.getByLabelText(/Categoría/i);
    await user.selectOptions(categoriaSelect, "belleza");

    expect(screen.getByText(/Detalles de Categoría: Belleza/i)).toBeInTheDocument();
    expect(screen.getByText(/Etiquetado\/Regulación Cosmética/i)).toBeInTheDocument();
    expect(screen.getByText(/Control de Lote\/Vencimiento/i)).toBeInTheDocument();
  });

  it("permite escribir en los campos principales", async () => {
    const user = userEvent.setup();
    render(<Index />);

    const empresaInput = screen.getByLabelText(/Nombre de la Empresa/i);
    const productoInput = screen.getByLabelText(/^Producto$/i);
    const unidadesInput = screen.getByLabelText(/Unidades/i);

    await user.type(empresaInput, "Mi Empresa");
    await user.type(productoInput, "Labial");
    await user.clear(unidadesInput);
    await user.type(unidadesInput, "300");

    expect(empresaInput).toHaveValue("Mi Empresa");
    expect(productoInput).toHaveValue("Labial");
    expect(unidadesInput).toHaveValue(300);
  });
  it("actualiza el resumen cuando el usuario ingresa costos", async () => {
    const user = userEvent.setup();
    render(<Index />);
  
    const costoInput = screen.getByLabelText(/Costo Unitario/i);
    const fedexInput = screen.getByLabelText(/FedEx \/ Mensajería/i);
  
    await user.type(costoInput, "10");
    await user.type(fedexInput, "5");
  
    const totalLote = screen.getByText(/Costo Total por Lote/i).parentElement;

    expect(totalLote).toHaveTextContent("$15,00");
    expect(totalLote).toHaveTextContent("USD");
  });
});
