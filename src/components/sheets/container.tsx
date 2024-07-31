
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const SheetContainer = ({trigger, children, width}: {trigger: React.ReactNode, children: React.ReactNode, width?: string}) => {

    return (
        <Sheet>
            <SheetTrigger className='mr-2 max-sm:mr-0'>
                {trigger}
            </SheetTrigger>
            <SheetContent className={`${width && width} h-full flex flex-col`}>
                {children}
            </SheetContent>
        </Sheet>
    )
}; 


export default SheetContainer; 