import FieldLabel from "@/components/FieldLabel";

interface CostFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  helperText?: string;
  tooltip?: string;
}

export default function CostField({
  id,
  label,
  value,
  onChange,
  prefix = "$",
  suffix,
  placeholder = "0",
  helperText,
  tooltip,
}: CostFieldProps) {
  const inputId =
    id ??
    `field-${label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")}`;

  return (
    <div className="flex-1 min-w-[140px]">
      <div className="min-h-[2.5rem] flex items-start">
        <FieldLabel htmlFor={inputId} label={label} tooltip={tooltip ?? helperText} />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          {prefix}
        </span>
        <input
          id={inputId}
          type="number"
          min="0"
          step="any"
          className={`field-input pl-7 ${suffix ? "pr-14" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
