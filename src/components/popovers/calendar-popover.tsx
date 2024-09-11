import { Calendar } from "@/components/ui/calendar"

import PopoverContainer from "./container";


interface CalendarPopoverProps {
    date: Date | undefined; 
    setDate: (date: Date | undefined) => void | React.Dispatch<Date | undefined>; 
    trigger: React.ReactNode; 
    triggerClassName?: string; 
};

const CalendarPopover: React.FC<CalendarPopoverProps> = ({
    date, setDate, trigger, triggerClassName
}) => {

    return (
        <PopoverContainer
            trigger={trigger}
            triggerClassName={triggerClassName}
        >
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
            />
        </PopoverContainer>
    )
};

export default CalendarPopover; 