// help sheet

import { HelpCircle } from "lucide-react"
import AppLinkButton from "../common/app-link-button"
import SheetContainer from "./container"

const HelpSheet = () => {

    return (
        <SheetContainer
            trigger={
                <AppLinkButton
                    type="ghost"
                    size="icon"
                >
                    <HelpCircle size={18}/>
                </AppLinkButton>
            }
        >

            help
        </SheetContainer>
    )
};

export default HelpSheet; 