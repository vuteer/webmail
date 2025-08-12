// help sheet

import { HelpCircle } from "lucide-react";
import AppLinkButton from "../common/app-link-button";
import SheetContainer from "./container";
import { Heading3 } from "../ui/typography";
import { Separator } from "../ui/separator";

const HelpSheet = () => {
  return (
    <SheetContainer
      trigger={
        <AppLinkButton type="ghost" size="icon">
          <HelpCircle size={18} />
        </AppLinkButton>
      }
    >
      <Heading3>Help</Heading3>
      <Separator />
    </SheetContainer>
  );
};

export default HelpSheet;
