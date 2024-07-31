// checkbox settings
 
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxProps {
    checked: boolean;
    onClick: () => Promise<void>;
    text: string;
}

const CheckboxItem: React.FC<CheckboxProps> = ({ checked, onClick, text }) => (
    <span className="my-3 flex items-center gap-2 cursor-pointer hover:text-prim-color" onClick={onClick}>
        <Checkbox
            checked={checked}
        // onCheckedChange={setChecked}
        />
        <span className="text-xs lg:text-sm">{text}</span>

    </span>

);

export default CheckboxItem;