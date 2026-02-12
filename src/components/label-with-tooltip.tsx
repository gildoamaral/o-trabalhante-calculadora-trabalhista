import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
// import { useIsMobile } from "@/hooks/useIsMobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LabelWithTooltipProps {
  label: string;
  tooltipText: string;
  htmlFor?: string;
}

export function LabelWithTooltip({ label, tooltipText, htmlFor }: LabelWithTooltipProps) {
  // const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor} className="text-foreground font-medium">
        {label}
      </Label>

      {/* {isMobile ? ( */}
      <div className="block sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="inline-flex focus:outline-none">
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              <span className="sr-only">Informação sobre {label}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <p className="text-sm">{tooltipText}</p>
          </PopoverContent>
        </Popover>
      </div>
      {/* ) : ( */}
      <div className="hidden sm:block">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="inline-flex focus:outline-none">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                <span className="sr-only">Informação sobre {label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* )} */}
    </div>
  );
}