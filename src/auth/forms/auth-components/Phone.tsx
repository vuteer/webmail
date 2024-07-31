
import { Phone as Icon } from "lucide-react";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PhoneProps {
    loading: boolean; 
    field: object; 
}
 
const Phone: React.FC<PhoneProps> = ({loading,  field}) => {
    return (
        <FormItem>
            <FormControl>
                <div className='flex items-center relative'>
                    <Icon className={'absolute top-2.5 left-2 h-5 w-5'}/>
                    <Input 
                        className="pl-8"
                        disabled={loading}
                        placeholder={'254700 000 000'}
                        type="number"
                        {...field}
                    />
                </div>
            </FormControl>
        </FormItem>
    );
}
 
export default Phone;