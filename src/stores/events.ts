import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "@/lib/api-calls/events";
import { EventType } from "@/types";
import { create } from "zustand";

// events, setEvents, updateEvent, appendEvent, deleteEvent
//
//
type EventStateType = {
  eventsLoading: boolean;
  events: EventType[];
  setEvents: (
    calendar?: string,
    startDate?: Date,
    endDate?: Date,
  ) => Promise<void>;
  updateEvent: (
    url: string,
    calendarId: string,
    event: EventType,
  ) => Promise<void>;
  appendEvent: (event: EventType) => Promise<void>;
  deleteEvent: (id: string) => Promise<boolean>;
};

export const eventStateStore = create<EventStateType>((set, get) => ({
  eventsLoading: true,
  events: [],
  setEvents: async (calendar?: string, startDate?: Date, endDate?: Date) => {
    set({ events: [], eventsLoading: true });
    const rs = await getEvents();

    set({ events: rs?.docs || [], eventsLoading: false });
  },
  updateEvent: async (url: string, calendarId: string, event: EventType) => {
    const rs = await updateEvent(url, calendarId, event);
    if (rs) {
      set((state) => ({
        ...state,
        events: state.events.map((e) =>
          e.url === url ? { ...e, ...event, ...rs } : e,
        ),
      }));
    }
  },
  appendEvent: async (event: EventType) => {
    const rs = await createEvent(event);
    if (rs) {
      set((state) => ({
        ...state,
        eventsLoading: false,
        events: [...state.events, { ...event, ...rs }],
      }));
    }
  },
  deleteEvent: async (id: string) => {
    const rs = await deleteEvent(id);
    if (rs) {
      set((state) => ({
        ...state,
        events: state.events.filter((e) => e.id !== id),
      }));

      return true;
    }

    return false;
  },
}));
