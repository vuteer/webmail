// badge component 

import { cn } from "@/lib/utils";

interface BadgeProps {
    text: string; 
    type: "primary" | "secondary" | "danger" | "other"; 
}; 

const Badge: React.FC<BadgeProps> = ({text, type}) => (
    <span className={cn(type === "primary" ? "border-green-500": type === "secondary" ? "border-yellow-500": type === "danger" ? "border-destructive": "border-gray-500", 
        "flex items-center gap-1 bg-secondary border rounded-full px-2  text-[.6rem] font-bold w-fit h-fit uppercase"
    )}>
        <span className={cn(
            type === "primary" ? "bg-green-500": type === "secondary" ? "bg-yellow-500": type === "danger" ? "bg-destructive": "bg-gray-500",
            "block w-2 h-2 rounded-sm"
        )}/>
        {text}
    </span>
); 

export default Badge; 