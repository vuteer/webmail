// share sheet

import { VisibilityType } from "@/types";
import SheetContainer from "./container";
import AppLinkButton from "../common/app-link-button";
import { Share2 } from "lucide-react";

interface ShareSheetProps {
    fileId: string; 
    title: string; 
    sharedWith: string[]; 
    visibility: VisibilityType;
};

const ShareSheet: React.FC<ShareSheetProps> = (
    {fileId, title, sharedWith, visibility}
) => {

    return (
        <SheetContainer
            trigger={
                <AppLinkButton
                    type="ghost"
                    size="sm"
                >
                    <Share2 size={18} />
                </AppLinkButton>
            }
        >
            share
        </SheetContainer>
    )
};

export default ShareSheet; 