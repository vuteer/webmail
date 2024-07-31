import { Mail } from "lucide-react";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmailProps {
    loading: boolean; 
    field: object; 
}
 
const Email: React.FC<EmailProps> = ({loading,  field}) => {
    return (
        <FormItem>
            <FormControl>
                <div className='flex items-center relative'>
                    <Mail className={'absolute top-2.5 left-2 h-5 w-5'}/>
                    <Input 
                        className="pl-8"
                        disabled={loading}
                        placeholder={'john@domain.com'}
                        type="email"
                        {...field}
                    />
                </div>
            </FormControl>
        </FormItem>
    );
}
 
export default Email;