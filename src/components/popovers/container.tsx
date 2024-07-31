import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";


interface PopoverProps {
    trigger: React.ReactNode; 
    triggerClassName?: string; 
    children: React.ReactNode; 
    contentClassName?: string; 
}


const PopoverContainer: React.FC<PopoverProps> = ({trigger, triggerClassName, children, contentClassName}) => {


    return (
        <Popover>
            <PopoverTrigger 
                className={triggerClassName ? triggerClassName: ""}
                onClick={(e: any) => {
                    e.stopPropagation()
                }}
            >
                {trigger}
            </PopoverTrigger>
            <PopoverContent className={contentClassName ? contentClassName: ""}>
                {children}
            </PopoverContent>
        </Popover>
    )
};

export default PopoverContainer; 