// app checkbox 

import React from "react";
import { Paragraph } from "../ui/typography"
import { Checkbox } from "../ui/checkbox";

interface AppCheckboxProps {
    checked: boolean; 
    onCheck: () => void;
    text?: string;  
}

const AppCheckbox: React.FC<AppCheckboxProps> = ({checked, onCheck, text}) => {

    return (
        <Paragraph 
            className="flex gap-2 items-center cursor-pointer hover:text-main-color duration-700"
            onClick={onCheck}
        >
            <Checkbox 
                checked={checked}
                onCheckedChange={onCheck}
            />
            {
                text && <span>{text}</span>
            }
        </Paragraph>
    )
};

export default AppCheckbox; 