import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleChevronDown } from "lucide-react";

interface HeaderProps {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
};

export const Header = ({ 
    memberImage,
    memberName = "Member",
    onClick,
}: HeaderProps) => {

    const avatarFallback = memberName.charAt(0).toUpperCase();
    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Button
                variant="ghost"
                className="text-lg font-semibold overflow-hidden px-2 w-auto"
                size="sm"
                onClick={onClick}
            >
                <Avatar className="size-6 mr-2">
                    <AvatarImage src={memberImage} />
                    <AvatarFallback>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="truncate">
                    {memberName}
                </span>
                <CircleChevronDown className="size-3.5 ml-0.5" />
            </Button>
        </div>
    );
};