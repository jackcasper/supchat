"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FloatNoteProps {
    label: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
}

export const FloatNote = ({
    label,
    children,
    side = "top",
    align = "center",
}: FloatNoteProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    className="bg-zinc-900 text-white border border-white/10 px-2 py-1 rounded"
                >
                    <span className="text-xs font-semibold">{label}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
