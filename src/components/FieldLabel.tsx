import { CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FieldLabelProps {
  htmlFor: string;
  label: string;
  tooltip?: string;
}

export default function FieldLabel({ htmlFor, label, tooltip }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="field-label inline-flex items-center gap-1.5">
      <span>{label}</span>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-help"
            >
              <CircleHelp size={14} />
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs leading-relaxed">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </label>
  );
}
