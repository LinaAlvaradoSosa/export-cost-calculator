import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "../pages/Index";
import { beforeEach, describe, it, expect } from "vitest";

const renderIndex = () =>
  render(
    <TooltipProvider>
      <Index />
    </TooltipProvider>,
  );

describe("Index - UI calculadora", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renderiza el título principal", () => {
    renderIndex();

    expect(screen.getByText("Simulador de Exportación")).toBeInTheDocument();
    expect(screen.getByText("Información General")).toBeInTheDocument();
  });

  it("muestra campos de moda por defecto", () => {
    renderIndex();

    expect(screen.getByText(/Detalles de Categoría: Moda/i)).toBeInTheDocument();
    expect(screen.getByText(/Costo Textil\/Insumos/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Instrucciones de Cuidado")).toBeInTheDocument();
  });

  it("cambia a belleza y muestra los campos correctos", async () => {
    const user = userEvent.setup();
    renderIndex();

    const categoriaSelect = screen.getByLabelText(/Categoría/i);
    await user.selectOptions(categoriaSelect, "belleza");

    expect(screen.getByText(/Detalles de Categoría: Belleza/i)).toBeInTheDocument();
    expect(screen.getByText(/Etiquetado\/Regulación Cosmética/i)).toBeInTheDocument();
    expect(screen.getByText(/Control de Lote\/Vencimiento/i)).toBeInTheDocument();
  });

  it("permite escribir en los campos principales", async () => {
    const user = userEvent.setup();
    renderIndex();

    const empresaInput = screen.getByLabelText(/Nombre de la Empresa/i);
    const productoInput = screen.getByLabelText(/^Producto$/i);
    const unidadesInput = screen.getByLabelText(/Unidades/i);
    const unidadMedidaSelect = screen.getByLabelText(/Unidad de Medida/i);
    const pesoInput = screen.getByLabelText(/^Peso$/i);
    const altoInput = screen.getByLabelText(/^Alto$/i);
    const anchoInput = screen.getByLabelText(/^Ancho$/i);
    const largoInput = screen.getByLabelText(/^Largo$/i);
    const inOutInput = screen.getByLabelText(/In\/Out/i);
    const sortingInput = screen.getByLabelText(/Sorting/i);
    const feeMensualInput = screen.getByLabelText(/Fee mensual/i);

    await user.type(empresaInput, "Mi Empresa");
    await user.type(productoInput, "Labial");
    await user.clear(unidadesInput);
    await user.type(unidadesInput, "300");
    await user.selectOptions(unidadMedidaSelect, "pallet");
    await user.type(pesoInput, "45");
    await user.type(altoInput, "120");
    await user.type(anchoInput, "80");
    await user.type(largoInput, "100");
    await user.type(inOutInput, "25");
    await user.type(sortingInput, "10");
    await user.type(feeMensualInput, "40");

    expect(empresaInput).toHaveValue("Mi Empresa");
    expect(productoInput).toHaveValue("Labial");
    expect(unidadesInput).toHaveValue(300);
    expect(unidadMedidaSelect).toHaveValue("pallet");
    expect(pesoInput).toHaveValue(45);
    expect(altoInput).toHaveValue(120);
    expect(anchoInput).toHaveValue(80);
    expect(largoInput).toHaveValue(100);
    expect(inOutInput).toHaveValue(25);
    expect(sortingInput).toHaveValue(10);
    expect(feeMensualInput).toHaveValue(40);
  });
  it("actualiza el resumen cuando el usuario ingresa costos", async () => {
    const user = userEvent.setup();
    renderIndex();
  
    const costoInput = screen.getByLabelText(/Costo Unitario/i);
    const fedexInput = screen.getByLabelText(/FedEx \/ Mensajería/i);
  
    await user.type(costoInput, "10");
    await user.type(fedexInput, "5");
  
    const totalLote = screen.getByText(/Costo Total por Lote/i).parentElement;

    expect(totalLote).toHaveTextContent("$15,00");
    expect(totalLote).toHaveTextContent("USD");
  });
});
