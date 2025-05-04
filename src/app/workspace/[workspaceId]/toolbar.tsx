import { Button } from "@/components/ui/button";
import { useWorkspaceById } from "@/features/workspaces/api/useWorkspaceById";
import { useWorkspaceIdParam } from "@/hooks/useWorkspaceIdParam";
import { Info, Search } from "lucide-react";

export const Toolbar = () => {
    const workspaceId = useWorkspaceIdParam();
    const { data } = useWorkspaceById({id: workspaceId});
    return (
        <nav className="bg-[#3D2683] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button size="sm" className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
                    <Search className="size-4 text-white mr-2" />
                    <span className="text-white text-xs">
                        Search {data?.name}
                    </span>
                </Button>
            </div>
            <div className="mt-auto flex-1 flex items-center justify-end">
                <Button variant="transparent" size="iconSm">
                    <Info className="size-5 text-white" />
                </Button>
            </div>
        </nav>
    );
};