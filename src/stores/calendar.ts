import { create } from "zustand";
import {
  deleteCalendar,
  getCalendars,
  makeCalendar,
  updateCalendar,
} from "@/lib/api-calls/calendar";
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
  addCalendar: (calendar: any) => Promise<boolean>;
  editCalendar: (
    last_url: string,
    data: { url: string; name?: string; color?: string; description?: string },
  ) => Promise<boolean>;
  deleteCalendar: (calendar: any) => Promise<boolean>;
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
  addCalendar: async (calendar: any) => {
    let calendars = get().calendars;
    const rs = await makeCalendar(calendar);
    if (rs) {
      let updated = [
        {
          id: Date.now(),
          caldavId: Date.now(),
          calendarColor: calendar.color,
          createdAt: Date.now(),
          displayName: calendar.name,
          description: calendar.description,
          url: rs.url,
        },
        ...calendars.filter((cal: any) => cal.url !== rs.url),
      ];
      set({ calendars: updated });
      return true;
    }
    return false;
  },
  editCalendar: async (
    last_url: string,
    data: { url: string; name?: string; color?: string; description?: string },
  ) => {
    let calendars = get().calendars;

    const rs = await updateCalendar(last_url, { ...data });
    if (rs) {
      let updated = calendars.map((cal: any) =>
        cal.url === data.url ? { ...cal, ...data } : cal,
      );

      set({ calendars: updated });
      return true;
    }
    return false;
  },
  deleteCalendar: async (url: string) => {
    let calendars = get().calendars;
    const rs = await deleteCalendar(url);
    if (rs) {
      let filtered = calendars.filter((cal: any) => cal.url !== rs);
      set({ calendars: filtered });
      return true;
    }
    return false;
  },
}));
