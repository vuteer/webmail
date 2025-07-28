import { create } from "zustand";
import { getCalendars } from "@/lib/api-calls/calendar";
// import { EventType } from "@/types";

type CalendarStateType = {
  calendarLoading: boolean;
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
  calendars: any;
  setCalendars: () => Promise<void>;
  addCalendar: (calendar: any) => void;
  editCalendar: (calendar: any) => void;
  deleteCalendar: (calendar: any) => void;
};

export const calendarStateStore = create<CalendarStateType>((set, get) => ({
  calendarLoading: true,
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
    set({ selectedTime: time });
  },
  setDay: (day: number) => {
    set({ day });
  },
  setWeek: (week: number) => {
    set({ week: week });
  },
  setYear: (year: number) => {
    set({ year });
  },
  setMonthIndex: (index: number) => {
    set({ monthIndex: index });
  },
  setSmallCalendarMonth: (index: number) => {
    set({ smallCalendarMonth: index });
  },
  setDaySelected: (day: Date | undefined) => {
    set({ daySelected: day });
  },
  setShowEventModal: () => {
    let { showEventModal } = get();

    set({ showEventModal: !showEventModal });
  },
  calendars: [],
  setCalendars: async () => {
    set({ calendars: [], calendarLoading: true });
    const rs = await getCalendars();
    set({ calendars: rs?.docs || [], calendarLoading: false });
  },
  addCalendar: (calendar: any) => {
    let calendars = get().calendars;

    let updated = [
      ...calendars.filter((cal) => cal.id !== calendar.id),
      calendar,
    ];
    set({ calendars: updated });
  },
  editCalendar: (calendar: any) => {
    let calendars = get().calendars;

    let updated = calendars.map((cal) =>
      cal.id === calendar.id ? calendar : cal,
    );
    set({ calendars: updated });
  },
  deleteCalendar: (calendar: any) => {
    let calendars = get().calendars;

    let filtered = calendars.filter((cal) => cal.id !== calendar.id);
    set({ calendars: filtered });
  },
}));
