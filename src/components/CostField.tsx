interface CostFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  placeholder?: string;
}

export default function CostField({ label, value, onChange, prefix = "$", placeholder = "0" }: CostFieldProps) {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="field-label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{prefix}</span>
        <input
          type="number"
          min="0"
          step="any"
          className="field-input pl-7"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
