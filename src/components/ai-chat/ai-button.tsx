import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { useAISidebar } from "./";
import { Button } from "../ui/button";
import Image from "next/image";
import { icons, images } from "@/assets";

// AI Toggle Button Component
const AIToggleButton = () => {
  const { toggleOpen: toggleAISidebar, open: isSidebarOpen } = useAISidebar();

  return (
    !isSidebarOpen && (
      <div className="fixed bottom-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full"
                onClick={(e) => {
                  if (!isSidebarOpen) {
                    e.stopPropagation();
                    toggleAISidebar();
                  }
                }}
              >
                <div className="flex items-center justify-center">
                  <Image
                    src={images.bot}
                    alt="AI Assistant"
                    width={25}
                    height={25}
                    className=""
                  />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle AI Assistant</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  );
};

export default AIToggleButton;
