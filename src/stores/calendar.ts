import { create } from 'zustand';
import { EventType } from "@/types";  

type CalendarStateType = {
    selectedTime: string; 
    setSelectedTime: (time: string) => void; 
    day: number;
    setDay: (day: number) => void;
    week: number; 
    setWeek: (week: number) => void; 
    year: number;
    setYear: (year: number) => void;  
    monthIndex: number; 
    setMonthIndex: (index: number) => void; 
    smallCalendarMonth: number; 
    setSmallCalendarMonth: (index: number) => void; 
    daySelected: Date | undefined; 
    setDaySelected: (day: Date | undefined) => void; 
    showEventModal: boolean; 
    setShowEventModal: () => void; 
    events: EventType[]; 
    updateEvent: (event: EventType) => Promise<void>; 
    deleteEvent: (event: EventType) => Promise<void>; 
    addEvents: (events: EventType[]) => void; 
    addEvent: (event: EventType) => void; 
};


export const calendarStateStore = create<CalendarStateType>((set, get) => ({
    selectedTime: "8:00 AM",
    week: 0,
    day: 1, 
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
    smallCalendarMonth: new Date().getMonth(), 
    daySelected: undefined, 
    showEventModal: false, 
    events: [],
    setSelectedTime: (time: string) => {
        set({selectedTime: time})
    },
    setDay: (day: number) => {
        set({day})
    },
    setWeek: (week: number) => {
        set({week: week})
    },
    setYear: (year: number) => {
        set({year})
    },
    setMonthIndex: (index: number) => {
        set({monthIndex: index})
    }, 
    setSmallCalendarMonth: (index: number) => {
        set({smallCalendarMonth: index})
    },
    setDaySelected: (day: Date | undefined) => {
        set({daySelected: day})
    },
    setShowEventModal: () => {
        let {showEventModal} = get(); 

        set({showEventModal: !showEventModal}); 
    },
    addEvents: (events: EventType[]) => {
        set({events});
    },
    updateEvent: async (event: EventType) => {},
    deleteEvent: async (event: EventType) => {
        let events = get().events; 

        // handle delete here

        let filtered = events.filter(evnt => evnt.id !== event.id);
        set({events: filtered}); 
    },
    addEvent: (event: EventType) => {
        let events = get().events; 

        let updated = [event, ...events.filter(evnt => evnt.id !== event.id)]; 
        set({events: updated});
    }
}))