import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiInsertProps {
    children: React.ReactNode;
    hint?: string;
    onEmojiSelect: (emoji: any) => void;
};

export const EmojiInsert = ({
    children,
    hint = "Emoji",
    onEmojiSelect,
}: EmojiInsertProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const onSelect = (emoji: any) => {
        onEmojiSelect(emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen(false);
        }, 500);
    };

    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip
                    open={tooltipOpen}
                    onOpenChange={setTooltipOpen}
                    delayDuration={50}
                >
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className="bg-black text-white border border-white/5">
                        <p className="font-medium text-xs">{hint}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0 w-full border-none shadow-none">
                    <Picker data={data} onEmojiSelect={onSelect} />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
};