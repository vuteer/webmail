// app link button
import Link from "next/link"; 
import { cn } from "@/lib/utils";

const AppLinkButton = (
    {
        children, href, type, className, size,
    }: 
    {
        children: React.ReactNode, 
        href?: string, 
        type: "default" | "secondary" | "outline" | "ghost",
        size: "default" | "sm" | "lg" | "icon" 
        className?: string
    }
) => {
    let cls = cn("cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        type === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90": 
        type === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80": 
        type === "ghost" ? "hover:bg-accent hover:text-accent-foreground": 
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        size === "default" ? "h-10 px-4 py-2":
        size === "sm" ? "h-9 rounded-md px-3": 
        size === "lg" ? "h-11 rounded-md px-8": 
        "h-10 w-10",
        className
    ); 

    return (
        <>
            {
                href ? (
                    <Link 
                        href={href}
                        className={cls}
                    >
                        {children}
                    </Link>
                ): (
                    <span className={cls}>
                        {children}
                    </span>
                )
            }
        </>
    )
};

export default AppLinkButton; 