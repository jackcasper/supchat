import { FloatNote } from "@/components/FloatNote";
import { Button } from "@/components/ui/button";
import { CircleChevronDown, Plus } from "lucide-react";
import { useToggle } from "react-use";
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
    children: React.ReactNode;
    label: string;
    hint: string;
    onNew?: () => void;
};

export const WorkspaceSection = ({
    children,
    label,
    hint,
    onNew,
}: WorkspaceSectionProps) => {
    const [on, toggle] = useToggle(true);
    return (
        <div className="flex flex-col mt-3 px-2">
            <div className="flex items-center px-3.5 group">
                <Button
                    variant="ghost"
                    className="p-0.5 text-sm text-[#1c2c7a] shrink-0 size-6"
                    onClick={toggle}
                >
                    <CircleChevronDown className={cn(
                        "size-4 transition-transform",
                        !on && "-rotate-90"
                    )} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="group px-1.5 text-sm text-[#1c2c7a] h-[28px] justify-start overflow-hidden items-center"
                >
                    <span className="truncate">{label}</span>
                </Button>
                {onNew && (
                    <FloatNote label={hint} side="top" align="center">
                        <Button
                            onClick={onNew}
                            variant="ghost"
                            size="iconSm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#1c2c7a] size-6 shrink-0"
                        >
                            <Plus className="size-5" />
                        </Button>
                    </FloatNote>
                )}
            </div>
            {on && children}
        </div>
    );
};