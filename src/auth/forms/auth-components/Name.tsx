import { User } from "lucide-react";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface NameProps {
    loading: boolean; 
    field: object; 
}
 
const Name: React.FC<NameProps> = ({loading,  field}) => {
    return (
        <FormItem>
            <FormControl>
                <div className='flex items-center relative'>
                    <User className={'absolute top-2.5 left-2 h-5 w-5'}/>
                    <Input 
                        className="pl-8"
                        disabled={loading}
                        placeholder={'John Mwangi'}
                        type="text"
                        {...field}
                    />
                </div>
            </FormControl>
        </FormItem>
    );
}
 
export default Name;