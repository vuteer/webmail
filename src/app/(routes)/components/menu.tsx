import MorePopover from "@/components/popovers/more";
import ThemeToggle from "./theme-toggle";
import HelpSheet from "@/components/sheets/help";

import { cn } from "@/lib/utils";

const Menu = ({ other }: { other?: boolean }) => (
  <div
    className={cn(
      other ? "flex-1" : "w-full",
      " flex items-center justify-end gap-2",
    )}
  >
    <div className="w-fit px-2 py-1 rounded-full flex items-center gap-2">
      <ThemeToggle />
      <HelpSheet />

      <MorePopover />
    </div>
  </div>
);
export default Menu;
