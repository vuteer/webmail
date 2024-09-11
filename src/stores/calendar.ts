import dayjs from 'dayjs';

import { create } from 'zustand';
import { EventType } from "@/types";  

type CalendarStateType = {
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
    week: 0,
    day: 1, 
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
    smallCalendarMonth: new Date().getMonth(), 
    daySelected: 0, 
    showEventModal: false, 
    events: [],
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