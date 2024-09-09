import { create } from 'zustand';
import { EventType } from "@/types";  

type CalendarStateType = {
    year: number;
    setYear: (year: number) => void;  
    monthIndex: number; 
    setMonthIndex: (index: number) => void; 
    smallCalendarMonth: number; 
    setSmallCalendarMonth: (index: number) => void; 
    daySelected: number | null; 
    setDaySelected: (day: number) => void; 
    showEventModal: boolean; 
    setShowEventModal: () => void; 
    events: EventType[]; 
    updateEvent: (event: EventType) => Promise<void>; 
    deleteEvent: (event: EventType) => Promise<void>; 
    addEvent: (event: EventType) => Promise<void>; 
};


export const calendarStateStore = create<CalendarStateType>((set, get) => ({
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
    smallCalendarMonth: new Date().getMonth(), 
    daySelected: 0, 
    showEventModal: false, 
    events: [],
    setYear: (year: number) => {
        set({year})
    },
    setMonthIndex: (index: number) => {
        set({monthIndex: index})
    }, 
    setSmallCalendarMonth: (index: number) => {
        set({smallCalendarMonth: index})
    },
    setDaySelected: (day: number) => {

    },
    setShowEventModal: () => {
        let {showEventModal} = get(); 

        set({showEventModal: !showEventModal}); 
    },
    updateEvent: async (event: EventType) => {},
    deleteEvent: async (event: EventType) => {},
    addEvent: async (event: EventType) => {}
}))