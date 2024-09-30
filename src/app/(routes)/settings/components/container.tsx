// settings container 
 
import { Card } from "@/components/ui/card";
import { Heading2 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

const Container = ({title, children}: {title: string, children: React.ReactNode}) => {


    return (
        <Card className="p-3">
            <Heading2 className="text-md lg:text-base my-2">{title}</Heading2>
            <Separator />
            <>
                {children}
            </>
        </Card>
    )
};

export default Container; 